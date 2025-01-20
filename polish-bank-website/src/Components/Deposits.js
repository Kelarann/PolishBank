/* global BigInt */

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'react-datepicker/dist/react-datepicker.css';
import './Deposits.css';
import BDAO_ABI from "../config/BDAO_ABI.json";

const DepositComponent = ({ provider, mainAccount }) => {
  const [depositList, setDepositList] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [newDeposit, setNewDeposit] = useState({
    amount: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const contractAddress = process.env.REACT_APP_BDAO_CONTRACT;

  useEffect(() => {
    if (provider) {
    }
  }, [provider]);


  const deposit = async (e) => {
    e.preventDefault();
    try {
      const { amount } = newDeposit;
      const signer = await provider.getSigner();
      const depositContractWithSigner = new ethers.Contract(contractAddress, BDAO_ABI, signer);
      await depositContractWithSigner.deposit(BigInt(amount) * BigInt(10 ** 18));
      console.log('deposit created successfully');
    } catch (error) {
      console.error("Error creating deposit:", error);
      setErrorMessage(error.reason);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="deposits">
      <h2>Deposits</h2>
      <form onSubmit={deposit} className="create-deposit-form">
        <h3>Create New deposit</h3>
        <input
          type="text"
          placeholder="Amount"
          value={newDeposit.amount}
          onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
          required
          className="primary-input"
        />
        <button type="submit" className="primary-button">Create deposit</button>
      </form>
    </div>
  )
};

export default DepositComponent;
