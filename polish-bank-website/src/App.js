import React, { useState, useEffect } from 'react';
import { Link, Element } from 'react-scroll';
import logo from './logo.svg';
import { Fade } from 'react-awesome-reveal';
import { SocialIcon } from 'react-social-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import WalletConnectComponent from './Components/WalletConnect';
import DaoProposalsComponent from './Components/DaoProposals';
import DepositComponent from './Components/Deposits';
import PresaleLink from './Components/PresaleLink'
import BackToTopButton from './Components/BackToTopButton';
import DaoFeatureRequest from './Components/DaoFeatureRequest';
import './App.css';
import './Components/DaoProposals.css';
import './Components/Deposits.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from 'react-slick';

ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {

  <Helmet>
    <title>Polish Bank</title>
    <meta name="description" content="Polish Bank ." />
    <meta name="keywords" content="Polish Bank as first blockchain national bank in the world." />
    <meta name="author" content="Polish Bank Team" />

    <meta property="og:title" content="Polish Bank" />
    <meta property="og:description" content="Join Polish Bank " />
    <meta property="og:image" content="%PUBLIC_URL%/logo.svg" />
    <meta property="og:url" content="https://polishBank.com" />
    <meta property="og:type" content="website" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Polish Bank" />
    <meta name="twitter:description" content="Join Polish Bank " />
    <meta name="twitter:image" content="%PUBLIC_URL%/logo.svg" />
  </Helmet>

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0.0');
  const [isDaoEnabled, setIsDaoEnabled] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const parsedBalance = parseFloat(balance);
    const newIsDaoEnabled = account && parsedBalance > (1000000000 * 0.000001);
    console.log("Account:", account);
    console.log("Balance:", balance);
    console.log("Parsed Balance:", parsedBalance);
    console.log("isDaoEnabled:", newIsDaoEnabled);
    setIsDaoEnabled(newIsDaoEnabled);
  }, [account, balance]);



  const roadmapData = [
    { quarter: '24Q3', milestones: [{ text: 'Create Website', status: 'completed' }, { text: 'Create X Account', status: 'completed' }, { text: 'WalletConnect Protocol V1', status: 'completed' }, { text: 'Community DAO', status: 'in-progress' }, { text: 'Fair Launch on BSC & Dex Trading', status: 'in-progress' }, { text: 'CMC application', status: 'in-progress' }, { text: 'Social Media Promotion', status: 'in-progress' }, { text: 'First Audit chosen by community', status: 'in-progress' }] },
    { quarter: '24Q4', milestones: [{ text: 'Testnet', status: 'in-progress' }, { text: 'Cex Listings', status: 'in-progress' }, { text: 'RPC data published', status: 'in-progress' }, { text: 'Marketing', status: 'in-progress' }, { text: 'WalletConnect Protocol V2', status: 'in-progress' }] },
  ];

  const socials = [
    {
      network: 'telegram',
      url: 'https://t.me/polishBank',
      name: 'polishBank',
    },
    {
      network: 'twitter',
      url: 'https://x.com/polishBank',
      name: 'CommunityBlockchain',
    },
    {
      network: 'email',
      url: 'mailto:devteam@polishBank.com',
      name: 'devteam@polishBank.com',
    },
    {
      network: 'github',
      url: 'https://github.com/DevTeampolishBank',
      name: 'https://github.com/DevTeampolishBank',
    }
  ];

  const sliderImages = [
   
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const data = {
    labels: ['Liquidity', 'Fair Launch (PinkSale)', 'CEX', 'Team', 'Development Purposes', 'Marketing'],
    datasets: [
      {
        data: [45.31, 47.69, 2, 2, 2, 1],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          },
        },
      },
    },
  };

  const contractAddress = process.env.REACT_APP_BDAO_CONTRACT;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      alert('Contract address copied to clipboard!');
    }).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Polish Bank Logo" className="App-logo" />
        <h1 class="app-text" >Polish Bank</h1>
        <nav>
          <ul>
            <li><Link to="about" smooth={true} duration={500}>About us</Link></li>
            <li><Link to="deposits" smooth={true} duration={500}>Deposits</Link></li>
            <li>
              <a href="/Community_Blockchain_White_Paper.pdf" target="_blank" rel="noopener noreferrer">Whitepaper</a>
            </li>
            <li><Link to="roadmap" smooth={true} duration={500}>Roadmap</Link></li>
            <li className={`tooltip ${isDaoEnabled ? '' : 'enabled'}`}>
              {isDaoEnabled ? (
                <div className="dropdown">
                  <Link to="dao" smooth={true} duration={500}>DAO</Link>
                  <div className="dropdown-content">
                    <Link to="dao-proposals" smooth={true} duration={500}><p>Vote</p></Link>
                    <Link to="dao-feature-request" smooth={true} duration={500}><p>Feature Request</p></Link>
                  </div>
                </div>
              ) : (
                <Link to="dao" smooth={true} duration={500} className="disabled-link">DAO</Link>
              )}
              {!isDaoEnabled && (
                <span className="tooltiptext">DAO is disabled because your wallet is disconnected or you have insufficient balance of PLN required for DAO Voting. We require to hold min <strong>{1000000000 * 0.000001 + " BNBB"}</strong></span>
              )}
            </li>
            <li><Link to="socials" smooth={true} duration={500}> <div class="app-text">Socials & Contact</div></Link></li>
          </ul>
          <hidden><PresaleLink /></hidden>
          <div className="contract-address">
            <h2 class="app-text">PLN Currency Contract Address</h2>
            <p className="address" onClick={copyToClipboard}>
              {contractAddress}
            </p>
          </div>
          <WalletConnectComponent setAppAccount={setAccount} setAppBalance={setBalance} setAppProvider={setProvider} />
        </nav>
      </header>
      <Element name="about" className="section">
        <div className="about-container">
          <div className="about-text">
            <h1>Polish Bank Training Project</h1>
            <p> Creating banking products <strong>on chain </strong> </p>
          </div>
        </div>
      </Element>

      <Element name="deposits" className="section">
      <div>
          <Element name="deposits" className="section">
            <Fade>
              <h1>Deposits</h1>
              <DepositComponent provider={provider} setBalance={balance} />
            </Fade>
          </Element>
        </div>
      </Element>
    
      {/* <Element name="tokenomics" className="section">
        <Fade>
          <h1>Tokenomics</h1>
          <p>Total Supply : <strong>1 000 000 000</strong></p>
          <div className="chart-container">
            <Pie data={data} options={options} />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Percentage</th>
                  <th>Category</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>47,69%</td>
                  <td>Fair Launch (PinkSale)</td>
                  <td>Tokens distributed during the fair launch on Pinksale. All sold token goes to LP</td>
                </tr>
                <tr>
                  <td>45,31%</td>
                  <td>Liquidity</td>
                  <td>Calculated liquidity after fair launch.</td>
                </tr>
                <tr>
                  <td>2%</td>
                  <td>CEX</td>
                  <td>Allocated for listing the token on major centralized exchanges to improve liquidity and accessibility.</td>
                </tr>
                <tr>
                  <td>2%</td>
                  <td>Team</td>
                  <td>Reserved for the core team and advisors to incentivize long-term commitment and development.</td>
                </tr>
                <tr>
                  <td>1%</td>
                  <td>Marketing</td>
                  <td>Used for marketing campaigns, partnerships, and community engagement to promote the blockchain and expand its user base.</td>
                </tr>
                <tr>
                  <td>2%</td>
                  <td>Development purposes</td>
                  <td>Reserved for ongoing development, upgrades, and enhancements of the blockchain network.</td>
                </tr>
              </tbody>
            </table>
            <br />
            <div>
              <p>
                During the development phase, we have deployed a transitional token on the BSC network with a fixed tax rate of <strong>3% for transactions. This tax rate is non-modifiable</strong>; it can only be removed entirely, but it cannot be increased or changed.
              </p>
              <p>
                The tax collected will be utilized to further develop the blockchain and enhance services for the community. This ensures continuous growth and improvement for the benefit of all community members.
              </p>
            </div>
          </div>
        </Fade>
      </Element> */}


      <Element name="roadmap" className="section">
        <Fade>
          <h1>Roadmap</h1>
          <div className="roadmap-container">
            {roadmapData.map((item, index) => (
              <div key={index} className="roadmap-card">
                <h2>{item.quarter}</h2>
                <ul>
                  {item.milestones.map((milestone, idx) => (
                    <li key={idx}>
                      {milestone.text}
                      {' '}
                      {milestone.status === 'completed' ? (
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
                      ) : (
                        <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'orange' }} />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Fade>
      </Element>
      {isDaoEnabled && (
        <div>
          <Element name="dao-proposals" className="section">
            <Fade>
              <h1>DAO Proposals</h1>
              <DaoProposalsComponent provider={provider} />
            </Fade>
          </Element>
          <Element name="dao-feature-request" className="section">
            <Fade>
              <h1>Feature Request</h1>
              <DaoFeatureRequest provider={provider} account={account} />
            </Fade>
          </Element>
        </div>
      )},

      <Element name="socials" className="section">
        <Fade>
          <h2 class="app-text">Socials & Contact</h2>
          <div className="socials-container">
            {socials.map((social, index) => (
              <SocialIcon key={index} network={social.network} url={social.url} style={{ height: 40, width: 40 }} />
            ))}
          </div>
        </Fade>
        {sliderImages.length > 3 ? (
          <div className="slider-container">
            <h2>We are backed up by:</h2>
            <Slider {...sliderSettings}>
              {sliderImages.map((image, index) => (
                <div key={index} className="slider-item">
                  <img src={`/${image}`} alt={`Logo ${index}`} className="logo-image" />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          sliderImages.length > 0 && (
            <div className="static-logos">
              <h2>We are backed up by</h2>
              <div className="logo-container">
                {sliderImages.map((image, index) => (
                  <img key={index} src={`/${image}`} alt={`Logo ${index}`} className="logo-image" />
                ))}
              </div>
            </div>
          )
        )}
      </Element>
      <BackToTopButton />
      <ToastContainer />
    </div>
  );
}

export default App;
