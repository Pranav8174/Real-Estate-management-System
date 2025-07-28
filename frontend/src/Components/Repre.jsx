import React from 'react';
import { useLocation } from 'react-router-dom';
import './Comp.css';  
import { useNavigate } from 'react-router-dom';

const Repre = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, description, link } = location.state || {};

  const handleClick = () => {
    navigate('/payment');
  };

  return (
    <div className="repre-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '40%', marginRight: '20px' }}>
        <img className="repre-image" src={link} alt="img..." style={{ width: '100%', marginBottom: '10px' }} />
        <img className="repre-image" src={link} alt="img..." style={{ width: '100%' }} />
      </div>
      <div className="repre-content" style={{ width: '50%' }}>
        <h1>{title}</h1>
        <p style={{ textAlign: 'justify' }}>{description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, distinctio odit. Corrupti laboriosam non modi, sit illo culpa quos! Quis, eligendi? Temporibus doloribus maiores, facere dolor dolores et magni blanditiis necessitatibus ut? Libero quaerat, omnis suscipit, illum expedita velit ea atque corrupti exercitationem blanditiis illo quo nesciunt asperiores! Ut illum dolor nihil! Cum quisquam optio illo. Ab animi officia corporis doloremque impedit iusto temporibus beatae commodi sunt amet, distinctio odit, dolorum omnis labore autem odio rem molestiae explicabo, suscipit provident vel dolores mollitia. Quae sequi commodi consequuntur nisi earum consequatur impedit alias, illum omnis. Iste quaerat doloremque facilis ea quam.</p>
        <button className="repre-button" onClick={handleClick}>Buy Now</button>
      </div>
    </div>
  );
};

export default Repre;
