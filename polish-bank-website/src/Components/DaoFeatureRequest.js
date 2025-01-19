import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { db, auth } from '../firebase';
import { toast } from 'react-toastify';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { signInAnonymously } from 'firebase/auth';
import './DaoFeatureRequest.css';

const DaoFeatureRequest = ({ provider, account }) => {
  const [featureType, setFeatureType] = useState('Feature Request');
  const [featureDescription, setFeatureDescription] = useState('');
  const [messageSigned, setMessageSigned] = useState(false);

  useEffect(() => {
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log('User signed in:', userCredential.user);
      })
      .catch((error) => {
        console.error('Error signing in:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!featureDescription.trim()) {
      toast.error('Feature description cannot be empty.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          border: '1px solid red',
          padding: '16px',
          color: 'red'
        },
        icon: '❌'
      });
      return;
    }

    if (provider && account) {
      const signer = await provider.getSigner();
      const message = `${featureDescription}`;
      try {
        const signature = await signer.signMessage(message);
        setMessageSigned(true);

        await addDoc(collection(db, 'featureRequests'), {
          initiator: account,
          featureType: featureType,
          featureDescription: featureDescription,
          signature: signature,
          timestamp: serverTimestamp(),
        });
        toast.success('Feature request submitted successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            border: '1px solid green',
            padding: '16px',
            color: 'green'
          },
          icon: '✅'
        });
      } catch (error) {
        console.error('Error signing message:', error);
        toast.error('Error submitting the feature request.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            border: '1px solid red',
            padding: '16px',
            color: 'red'
          },
          icon: '❌'
        });
      }
    } else {
      alert('Please connect your wallet to sign the message.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feature-request-form">
      <label>
        Type:
        <select
          value={featureType}
          onChange={(e) => setFeatureType(e.target.value)}
          className="form-control"
        >
          <option value="Feature Request">Feature Request</option>
        </select>
      </label>
      <label>
        Description:
        <textarea
          value={featureDescription}
          onChange={(e) => setFeatureDescription(e.target.value)}
          className="form-control"
          rows="4"
          placeholder="Enter your feature request here"
        ></textarea>
      </label>
      <button type="submit" className="wallet-button">
        {messageSigned ? 'Signed' : 'Sign'}
      </button>
    </form>
  );
};

export default DaoFeatureRequest;
