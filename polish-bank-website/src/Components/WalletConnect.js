import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Account from './Account.js';

const WalletConnectComponent = ({ setAppAccount, setAppBalance, setAppProvider }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0.0');
  const [BDAObalance, setBDAObalance] = useState('0.0');
  const [showPopup, setShowPopup] = useState(false);
  
  const BDAO_CONTRACT_MAP = {
    'bnb_CONTRACT_ADDRESS' : process.env.REACT_APP_BDAO_CONTRACT,
    'bnb_ABI' :  'function balanceOf(address owner) view returns (uint256)',
    'bnbt_CONTRACT_ADDRESS' : process.env.REACT_APP_BDAO_CONTRACT,
    'bnbt_ABI' :  'function balanceOf(address owner) view returns (uint256)'
  }

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
      const provider = new ethers.BrowserProvider(instance);
      const network = await provider.getNetwork();

      console.log("Connected Network:", network);

      const networkName = network.name;
      if (networkName !== process.env.REACT_APP_BNB_NETWORK) { 
        setShowPopup(true);
        return;
      }

      const accounts = await provider.listAccounts();
      const account = accounts[0].address;
      console.log("Connected Account:", account);
      setAccount(account);
      setAppAccount(account);
      await fetchBalances(provider, account);

      setAppProvider(provider);

      instance.on('accountsChanged', async (accounts) => {
        const newAccount = accounts[0];
        console.log("Account changed:", newAccount);
        setAccount(newAccount);
        setAppAccount(newAccount);
        await fetchBalances(provider, newAccount);
      });

      instance.on('disconnect', () => {
        console.log("Disconnected");
        setAccount(null);
        setAppAccount(null);
        setBDAObalance('0.0');
        setBalance('0.0')
        setAppBalance('0.0');
        setAppProvider(null);
      });
    } catch (error) {
      console.error("Could not connect to wallet", error);
    }
  };

  const fetchBalances = async (provider, address) => {
    const network = await provider.getNetwork();
    try {
      // Fetch BDAO Coin balance
      console.log(new ethers.Contract(BDAO_CONTRACT_MAP[network.name + '_CONTRACT_ADDRESS'], [BDAO_CONTRACT_MAP[network.name + '_ABI']], provider))
      const BDAOContract = new ethers.Contract(BDAO_CONTRACT_MAP[network.name + '_CONTRACT_ADDRESS'], [BDAO_CONTRACT_MAP[network.name + '_ABI']], provider);
      const BDAOBalance = await BDAOContract.balanceOf(address);
      const formattedBDAOBalance = ethers.formatUnits(BDAOBalance, 18);
      console.log("Fetched BDAO Balance:", formattedBDAOBalance);
      setBDAObalance(formattedBDAOBalance);
      setBalance(formattedBDAOBalance);
      setAppBalance(formattedBDAOBalance);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const disconnectWallet = async () => {
    web3Modal.clearCachedProvider();
    setAccount(null);
    setAppAccount(null);
    setBDAObalance('0.0');
    setAppBalance('0.0');
    setBalance('0.0')
    setAppProvider(null);
  };

  const closePopup = () => {
    setShowPopup(false);
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
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>You are not connected to the {process.env.REACT_APP_BNB_NETWORK_DESCRIPTION}.</p>
            <button className="popup-button" onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
      {!account ? (
        <button className="wallet-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Account
          account={account}
          BDAObalance={BDAObalance}
          copyToClipboard={copyToClipboard}
          disconnectWallet={disconnectWallet}
        />
      </div>
      )}
    </div>
  );
};

export default WalletConnectComponent;
