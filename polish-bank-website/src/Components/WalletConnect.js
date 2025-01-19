import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Account from './Account.js';
import BDAO_ABI from "../config/BDAO_ABI.json";


const WalletConnectComponent = ({ setAppAccount, setAppAccounts, setAppBalance, setAppProvider }) => {
  const [mainAccount, setMainAccount] = useState(null);
  const [accounts, setMainAccounts] = useState(null);
  const [balance, setBalance] = useState('0.0');
  const [BDAObalance, setBDAObalance] = useState('0.0');
  const [deposits, setDepositsBalance] = useState('0.0');
  const [showPopup, setShowPopup] = useState(false);

  const BDAO_CONTRACT_MAP = {
    bnb: {
      contractAddress: process.env.REACT_APP_BDAO_CONTRACT,
    },
    bnbt: {
      contractAddress: process.env.REACT_APP_BDAO_CONTRACT,
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
      const provider = new ethers.BrowserProvider(instance);
      const network = await provider.getNetwork();

      console.log("Connected Network:", network);

      const networkName = network.name;
      if (networkName !== process.env.REACT_APP_BNB_NETWORK) {
        setShowPopup(true);
        return;
      }

      const accounts = await provider.listAccounts();
      console.log("Connected Accounts:", accounts);
      setMainAccounts(accounts);
      const mainAccount = accounts[0].address;
      console.log("Connected Account:", mainAccount);
      setMainAccount(mainAccount);
      setAppAccount(mainAccount);
      await fetchBalances(provider, mainAccount);

      setAppProvider(provider);

      instance.on('accountsChanged', async (accounts) => {
        const newAccount = accounts[0];
        console.log("Account changed:", newAccount);
        setMainAccount(newAccount);
        setAppAccount(newAccount);
        await fetchBalances(provider, newAccount);
      });

      instance.on('disconnect', () => {
        console.log("Disconnected");
        setMainAccount(null);
        setMainAccounts(null);
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

  const fetchBalances = async (provider) => {
    const network = await provider.getNetwork();
    try {
      // Fetch BDAO Coin balance
      console.log(new ethers.Contract(BDAO_CONTRACT_MAP[network.name].contractAddress, BDAO_ABI, provider))
      const BDAOContract = new ethers.Contract(BDAO_CONTRACT_MAP[network.name].contractAddress, BDAO_ABI, provider);
      
      const accountBalances = await Promise.all(accounts.map(async (account) => {
        const BDAOBalance = await BDAOContract.balanceOf(account.address);
        const formattedBDAOBalance = ethers.formatUnits(BDAOBalance, 18);
        console.log("Fetched BDAO Balance for account", account.address, ":", formattedBDAOBalance);

        const deposits = await BDAOContract.deposits(account.address);
        const formattedDeposits = ethers.formatUnits(deposits, 18);
        console.log("Fetched Deposits for account", account.address, ":", formattedDeposits);

        return {
          address: account.address,
          BDAOBalance: formattedBDAOBalance,
          deposits: formattedDeposits,
        };
      }));

      setBDAObalance(accountBalances[0].BDAOBalance);
      setDepositsBalance(accountBalances[0].deposits);
      setBalance(accountBalances[0].BDAOBalance);
      setAppBalance(accountBalances[0].BDAOBalance);

      // Pass the accountBalances object to the Account component
      setMainAccounts(accountBalances);
      setAppAccounts(accountBalances);

    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const disconnectWallet = async () => {
    web3Modal.clearCachedProvider();
    setMainAccount(null);
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
      {!mainAccount ? (
        <button className="primary-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
          <Account
            accounts={accounts}
            copyToClipboard={copyToClipboard}
          />
          <button style={{ marginTop: '20px' }} className="primary-button" onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectComponent;

