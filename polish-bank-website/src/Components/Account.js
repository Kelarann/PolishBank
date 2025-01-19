import React from "react";
import "./Account.css";
import { FaMoneyBillWave } from "react-icons/fa";


const Account = ({ account, BDAObalance, copyToClipboard, disconnectWallet }) => {
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
          <span class="list_text">Account Balance : {formatBalance(parseFloat(BDAObalance).toFixed(2))}  tPLN</span>
        </li>
      </ul>
      <button class="wallet-button" onClick={disconnectWallet}>Disconnect</button>
    </div>

  );
};

function formatBalance(balance) {
  const formatted = new Intl.NumberFormat("en-US").format(balance);
  return formatted.replace(/,/g, " ").replace(".", ",");
}

export default Account;
