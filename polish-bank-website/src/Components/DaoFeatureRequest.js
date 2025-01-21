import React, { useState, useEffect } from 'react';
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import { toast } from 'react-toastify';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { signInAnonymously } from 'firebase/auth';
import './DaoFeatureRequest.css';

const DaoFeatureRequest = ({ provider, mainAccount }) => {
  const [featureType, setFeatureType] = useState('Feature Request');
  const [featureDescription, setFeatureDescription] = useState('');
  const [messageSigned, setMessageSigned] = useState(false);

  useEffect(() => {
    signInAnonymously(firebase.auth)
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

    if (provider && mainAccount) {
      const signer = await provider.getSigner();
      const message = `${featureDescription}`;
      try {
        const signature = await signer.signMessage(message);
        setMessageSigned(true);

        await addDoc(collection(firebase.db, 'featureRequests'), {
          initiator: mainAccount,
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
        <p> Type </p>
        <select
          value={featureType}
          onChange={(e) => setFeatureType(e.target.value)}
          className="primary-input"
        >
          <option value="Feature Request">Feature Request</option>
        </select>
      </label>
      <label>
      <p> Description </p>
        <textarea
          value={featureDescription}
          onChange={(e) => setFeatureDescription(e.target.value)}
          className="primary-input"
          rows="4"
          placeholder="Enter your feature request here"
        ></textarea>
      </label>
      <button type="submit" className="primary-button">
        {messageSigned ? 'Signed' : 'Sign'}
      </button>
    </form>
  );
};

export default DaoFeatureRequest;
