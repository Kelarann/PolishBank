/* global BigInt */

import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './Deposits.css';

const DepositComponent = ({ tokenCallable }) => {

  const [newDeposit, setNewDeposit] = useState({
    amount: '',
  });
  const [, setErrorMessage] = useState('');
  const [, setShowErrorModal] = useState(false);

  const createDeposit = async (deposit) => {
    deposit.preventDefault();
    try {
      const { amount } = newDeposit;
      await tokenCallable.deposit(BigInt(amount) * BigInt(10 ** 18));
      console.log('deposit created successfully');
    } catch (error) {
      console.error("Error creating deposit:", error);
      setErrorMessage(error.reason);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="deposits">
      <form onSubmit={createDeposit} className="create-deposit-form">
        <h3>Create New deposit</h3>
        <input
          type="text"
          placeholder="Amount"
          value={newDeposit.amount}
          onChange={(deposit) => setNewDeposit({ ...newDeposit, amount: deposit.target.value })}
          required
          className="primary-input"
        />
        <button type="submit" className="primary-button">Create deposit</button>
      </form>
    </div>
  )
};

export default DepositComponent;
