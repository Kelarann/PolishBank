import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DaoProposals.css';

const DaoProposalsComponent = ({ mainAccount, tokenQueryable, tokenCallable }) => {
  const [proposals, setProposals] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [newProposal, setNewProposal] = useState({
    description: '',
    options: '',
    votingPeriod: new Date(),
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const proposalsPerPage = 5;

  useEffect(() => {
    if (tokenCallable) {
      checkIfOwner();
      fetchProposals();
    }
  }, [tokenCallable]);

  const checkIfOwner = async () => {
    const ownerAddress = await tokenCallable.owner();
    setIsOwner(mainAccount.toLowerCase() === ownerAddress.toLowerCase());
  };

  const fetchProposals = async () => {
    try {
      const [
        descriptions,
        options,
        votes,
        isActive,
        endTimes,
        winningOptions
      ] = await tokenQueryable.getAllProposals();

      const fetchedProposals = descriptions.map((description, index) => ({
        description,
        options: options[index],
        votes: votes[index].map(vote => vote.toString()),
        isActive: isActive[index],
        endTime: endTimes[index],
        winningOption: winningOptions[index]
      }));

      setProposals(fetchedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setErrorMessage(error.reason);
      setShowErrorModal(true);
    }
  };

  const voteOnProposal = async (proposalId, option) => {
    try {
      await tokenCallable.vote(proposalId, option);
      console.log(`Voted on proposal ${proposalId} with option ${option}`);
      fetchProposals();
    } catch (error) {
      console.error("Error voting on proposal:", error);
      setErrorMessage(error.reason);
      setShowErrorModal(true);
    }
  };

  const createProposal = async (e) => {
    e.preventDefault();
    try {
      const { description, options, votingPeriod } = newProposal;
      const optionsArray = options.split(',').map(option => option.trim());
      const votingPeriodInSeconds = Math.floor((votingPeriod.getTime() - new Date().getTime()) / 1000);

      await tokenCallable.createProposal(description, optionsArray, votingPeriodInSeconds);
      console.log('Proposal created successfully');
      fetchProposals();
    } catch (error) {
      console.error("Error creating proposal:", error);
      setErrorMessage(error.reason);
      setShowErrorModal(true);
    }
  };

  const indexOfLastProposal = currentPage * proposalsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - proposalsPerPage;
  const currentProposals = proposals.slice(indexOfFirstProposal, indexOfLastProposal);

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <div className="dao-proposals">
      <h2>Proposals</h2>
      {isOwner && (
        <form onSubmit={createProposal} className="create-proposal-form">
          <h3 className="app-text">Create New Proposal</h3>
          <input
            type="text"
            placeholder="Description"
            value={newProposal.description}
            onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
            required
            className="primary-input"
          />
          <input
            type="text"
            placeholder="Options (comma separated)"
            value={newProposal.options}
            onChange={(e) => setNewProposal({ ...newProposal, options: e.target.value })}
            required
            className="primary-input"
          />
          <DatePicker
            selected={newProposal.votingPeriod}
            onChange={(date) => setNewProposal({ ...newProposal, votingPeriod: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="primary-input"
          />
          <button type="submit" className="primary-button">Create Proposal</button>
        </form>
      )}
      {currentProposals.length === 0 ? (
        <p>No proposals available</p>
      ) : (
        currentProposals.map((proposal, index) => (
          <div key={index} className="proposal">
            <h3>{proposal.description}</h3>
            {proposal.isActive ? (
              proposal.options.map((option, idx) => (
                <button
                  key={idx}
                  className="primary-button"
                  onClick={() => voteOnProposal(indexOfFirstProposal + index, idx)}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="result">
                <p>Voting ended. Winning option: <strong>{proposal.winningOption.toUpperCase()}</strong></p>
                <ul>
                  {proposal.options.map((option, idx) => (
                    <li key={idx}>
                      <em>{option.toUpperCase()} - {proposal.votes[idx]} votes</em>
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
        {indexOfLastProposal < proposals.length && <button onClick={nextPage} className="primary-button">Next</button>}
      </div>
    </div>
  );
};

export default DaoProposalsComponent;
