import React from "react";
import { Link } from 'react-scroll';
import "./Account.css";
import { FaMoneyBillWave, FaPercentage } from "react-icons/fa";


const Account = ({ accounts, copyToClipboard }) => {
  if (!accounts) {
    return null;
  }
  return (
    <div className="cards-container">
      {accounts.map((element, index) => (
        <div className="card" key={index}>
          <div className="card__border"></div>
          <div className="card_title__container">
            <span className="card_title" onClick={() => copyToClipboard(element.address)}>{truncateAddress(element.address)}</span>
          </div>
          <hr className="line" />
          <ul className="card__list">
            <li className="card__list_item">
              <FaMoneyBillWave
                style={{
                  color: "var(--primary-color)", // Black icon color
                  fontSize: "22px"
                }} 
              />
              <span className="list_text"><strong style={{color: 'var(--primary-color)'}}>Account Balance :</strong> {formatBalance(parseFloat(element.BDAOBalance).toFixed(2))}  tPLN</span>
            </li>
            <li className="card__list_item">
              <FaPercentage
                style={{
                  color: "var(--primary-color)", // Black icon color
                  fontSize: "22px"
                }}
              />
              {(parseFloat(element.deposits).toFixed(2) <= 0) ? (
                <span className="list_text"><strong style={{color: 'var(--primary-color)'}}>Deposits :</strong> <Link to="deposits" style={{color: 'var(--text-color)'}} smooth={true} duration={500}> No Deposits ? Go make one!</Link></span>
              ) : (
                <span className="list_text"><strong style={{color: 'var(--primary-color)'}}>Deposits :</strong> {formatBalance(parseFloat(element.deposits).toFixed(2))}  tPLN</span>
              )}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
  
};

function formatBalance(balance) {
  const formatted = new Intl.NumberFormat("en-US").format(balance);
  return formatted.replace(/,/g, " ").replace(".", ",");
}

function truncateAddress(address) {
  if (!address) return '';
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
}

export default Account;
