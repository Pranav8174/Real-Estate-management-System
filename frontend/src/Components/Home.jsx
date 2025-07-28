import React, { useState } from 'react';
import './Comp.css';
import Navbar from './Navbar';

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExploreClick = () => {
    setShowDropdown(true);
  };

  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <Navbar />
      <div className="welcome-section" style={{ textAlign: 'center', maxWidth: '100%', margin: 'auto' }}>
        <h1 className="welcome-title">Welcome to Our Platform</h1>
        <p className="welcome-text">
          Discover the best services, opportunities, and experiences tailored just for you.
        </p>

        {/* Replaced button with image and text */}
        <div className="explore-container" onClick={handleExploreClick} style={{ cursor: 'pointer' }}>
          <img src="https://png.pngtree.com/png-clipart/20230915/original/pngtree-cartoon-explorer-holding-a-book-vector-png-image_12170021.png" alt="Explore Now" className="explore-image" style={{ maxWidth: '300px' }} /> 
          <p className="explore-text" style={{ marginTop: '10px', fontSize: '1.2em', fontWeight: 'bold' }}>Unleash Your Potential</p>
          <p className="explore-subtext">Dive into a world of possibilities. Click to explore.</p> 
        </div>

        {showDropdown && (
          <div className="dropdown">
            <div className="dropdown-content">
              <h3>Explore Our Categories</h3>
              <ul>
                <li><a href="/services">Services</a></li>
                <li><a href="/opportunities">Opportunities</a></li>
                <li><a href="/experiences">Experiences</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
              <p>Ready to embark on a journey of discovery? We offer a diverse range of options to suit your needs.</p>
              <p>From connecting you with top-tier service providers to opening doors to exciting new opportunities, we're here to empower you.</p>
              <p>Looking for unique experiences? Explore our curated collection of adventures and activities.</p>
              <p>Join our community and unlock your full potential. Start exploring today!</p>
              <p>Have questions? <a href="/faq">Check out our FAQs</a> or <a href="/contact">contact us</a>!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}