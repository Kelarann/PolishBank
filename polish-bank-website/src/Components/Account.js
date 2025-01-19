import React from "react";
import { Link } from 'react-scroll';
import "./Account.css";
import { FaMoneyBillWave, FaPercentage } from "react-icons/fa";


const Account = ({ account, BDAObalance, deposits, copyToClipboard, disconnectWallet }) => {
  return (
    <div class="card">
      <div class="card__border"></div>
      <div class="card_title__container">
        <span class="card_title">Main Account</span>
        <p style={{ fontSize: '10px' }} onClick={() => copyToClipboard(account)}>
          {account}
        </p>
      </div>
      <hr class="line" />
      <ul class="card__list">
        <li class="card__list_item">
          <FaMoneyBillWave
            style={{
              color: "var(--primary-color)", // Black icon color
              fontSize: "22px"
            }} 
          />
          <span class="list_text"><strong style={{color: 'var(--primary-color)'}}>Account Balance :</strong> {formatBalance(parseFloat(BDAObalance).toFixed(2))}  tPLN</span>
        </li>
        <li class="card__list_item">
          <FaPercentage
            style={{
              color: "var(--primary-color)", // Black icon color
              fontSize: "22px"
            }}
          />
          {(!deposits || deposits.length === 0) ? (
            <span class="list_text"><strong style={{color: 'var(--primary-color)'}}>Deposits :</strong> <Link to="deposits" style={{color: 'var(--text-color)'}} smooth={true} duration={500}> No Deposits ? Go make one!</Link></span>
          ) : (
            <span class="list_text"><strong style={{color: 'var(--primary-color)'}}>Deposits :</strong> {formatBalance(parseFloat(deposits).toFixed(2))}  tPLN</span>
          )}
        </li>
      </ul>
      <button class="primary-button" onClick={disconnectWallet}>Disconnect</button>
    </div>
  );
};

function formatBalance(balance) {
  const formatted = new Intl.NumberFormat("en-US").format(balance);
  return formatted.replace(/,/g, " ").replace(".", ",");
}

export default Account;
