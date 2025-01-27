/* global BigInt */

import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Account from './Account.js';
import PLN_ABI from "../config/PLN_ABI.json";


const WalletConnectComponent = ({ mainAccount, setMainAccount, appAccounts, setAppAccounts, setAppProvider, tokenQueryable, setTokenQueryable, tokenCallable, setTokenCallable, balance, setBalance, depositsBalance, setDepositsBalance, FetchBalances, setIsDaoEnabled }) => {
  const [popUp, setPopUp] = useState({ show: false, message: '' });

  const PLN_CONTRACT_MAP = {
    bnb: {
      contractAddress: process.env.REACT_APP_PLN_CONTRACT_BNB,
    },
    bnbt: {
      contractAddress: process.env.REACT_APP_PLN_CONTRACT,
    },
  };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          [process.env.REACT_APP_CHAIN_ID]: process.env.REACT_APP_RPC_URL
        },
        chainId: parseInt(process.env.REACT_APP_CHAIN_ID, 10),
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Web3Modal Example',
        rpc: process.env.REACT_APP_RPC_URL,
        chainId: parseInt(process.env.REACT_APP_CHAIN_ID, 10),
      },
    },
  };

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      console.log("Cached provider found. Connecting...");
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();

      instance.removeAllListeners(); // Clean existing listeners

      const provider = new ethers.BrowserProvider(instance);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();

      const tokenQueryable = new ethers.Contract(PLN_CONTRACT_MAP[network.name].contractAddress, PLN_ABI, provider);
      const tokenCallable = new ethers.Contract(PLN_CONTRACT_MAP[network.name].contractAddress, PLN_ABI, signer);
      setTokenQueryable(tokenQueryable);
      setTokenCallable(tokenCallable);

      const accounts = await provider.listAccounts();
      setAppAccounts(accounts);
      FetchBalances(accounts);

      setMainAccount(accounts[0].address);
      setAppProvider(provider);

      instance.on('accountsChanged', async (account) => {
        setMainAccount(account);
      });

      instance.on('disconnect', () => {
        disconnectWallet();
      });
    } catch (error) {
      console.error("Could not connect to wallet", error);
    }
  };

  const transferFromMainAccount = async (accountAddress, amount,) => {
    try {
      await tokenCallable.transfer(accountAddress, BigInt(amount) * BigInt(10 ** 18));

    }
    catch (error) {
      ;
      setPopUp({ show: true, message: 'Error creating transfer' });

      console.log("Error creating transfer:", error);
    }
    finally {
      setBalance(appAccounts.filter((account) => account.address === accountAddress)[0].balance);
      console.log('transfer created successfully');
      console.log(appAccounts.filter((account) => account.address === accountAddress)[0].balance)
    }

  }
  const disconnectWallet = async () => {
    if (web3Modal.providerController) {
      const providerController = web3Modal.providerController;
      const walletConnectProvider = providerController.cachedProvider === 'walletconnect';
      if (walletConnectProvider && providerController.provider) {
        await providerController.provider.disconnect();
      }
    }
    await web3Modal.clearCachedProvider();
    setMainAccount(null);
    setAppAccounts([]);
    setTokenQueryable(null);
    setTokenCallable(null);
    setBalance('0.0');
    setDepositsBalance('0.0');
    setAppProvider(null);
    setIsDaoEnabled(false);
  };

  const closePopup = () => {
    setPopUp({ show: false });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    }).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="wallet-connect">
      {popUp.show && (
        <div className="popup">
          <div className="popup-content">
            <p>{popUp.message}</p>
            <button className="popup-button" onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
      {!mainAccount ? (
        <button className="primary-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
          <Account
            appAccounts={appAccounts}
            copyToClipboard={copyToClipboard}
            mainAccount={mainAccount}
            setMainAccount={setMainAccount}
            transferFromMainAccount={transferFromMainAccount}
          />
          <button style={{ marginTop: '20px' }} className="primary-button" onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectComponent;

