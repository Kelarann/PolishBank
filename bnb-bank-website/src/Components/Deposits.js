/* global BigInt */

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'react-datepicker/dist/react-datepicker.css';
import './Deposits.css';

const DEPOSITS_ABI = [
  { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const DepositComponent = ({ provider }) => {
  const [depositList, setDepositList] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [newDeposit, setnewDeposit] = useState({
    amount: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const deposits = 5;
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
      const depositContractWithSigner = new ethers.Contract(contractAddress, DEPOSITS_ABI, signer);
      await depositContractWithSigner.deposit(BigInt(amount) * BigInt(10 ** 18));
      console.log('deposit created successfully');
    } catch (error) {
      console.error("Error creating deposit:", error);
      setErrorMessage(error.reason);
      setShowErrorModal(true);
    }
  };

  const indexOfLastdeposit = currentPage * deposits;
  const indexOfFirstdeposit = indexOfLastdeposit - deposits;
  const currentDeposits = depositList.slice(indexOfFirstdeposit, indexOfLastdeposit);

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
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
          onChange={(e) => setnewDeposit({ ...newDeposit, amount: e.target.value})}
          required
          className="deposit-input"
        />
        <button type="submit" className="create-button">Create deposit</button>
      </form>
      {currentDeposits.length === 0 ? (
        <p>No deposits available</p>
      ) : (
        currentDeposits.map((deposit, index) => (
          <div key={index} className="deposit">
            <h3>{deposit.description}</h3>
            {deposit.isActive ? (
              deposit.options.map((option, idx) => (
                <button
                  key={idx}
                  className="vote-button"
                  onClick={() => { }}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="result">
                <p>Voting ended. Winning option: <strong>{deposit.winningOption.toUpperCase()}</strong></p>
                <ul>
                  {deposit.options.map((option, idx) => (
                    <li key={idx}>
                      <em>{option.toUpperCase()} - {deposit.votes[idx]} votes</em>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
      {showErrorModal && (
        <div className="error-modal">
          <div className="error-modal-content">
            <h3>Error</h3>
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorModal(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="pagination">
        {currentPage > 1 && <button onClick={prevPage} className="pagination-button">Previous</button>}
        {indexOfLastdeposit < depositList.length && <button onClick={nextPage} className="pagination-button">Next</button>}
      </div>
    </div>
  );
};

export default DepositComponent;
