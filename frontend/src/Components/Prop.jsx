import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Comp.css';
import Repre from './Repre';

const Prop = () => {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const [value,setValue]=useState('');

  const onClickButton = (title, description, link) => {
    setSelected({ title, description, link });
    navigate('/repre', { state: { title, description, link } });
  };


  const onChangeForText=(e)=>{
   try {
    const input = e.target.value;
      if (!input) start();
      setValue(input);
      setCards(cards.filter(({ title, desc }) => 
        title.toLowerCase().includes(input.toLowerCase()) || 
        desc.toLowerCase().includes(input.toLowerCase())
      ));
   } catch (error) {
    console.log(error);
   }
  };
  const start = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/data/cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setCards(data.data);
    } else {
      console.log(response);
    }
  };
  useEffect(() => {
    try {
     
      start();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div style={{display:'flex', flexDirection:'column'}}>

<button 
        className='add-property-button' 
        onClick={() => navigate('/addProperty')} 
        style={{margin:'20px auto', width:'fit-content', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
        Add Property
      </button>
      <input type='text' value={value} onChange={(e)=>{onChangeForText(e)}} style={{width: '60vw',
    margin: 'auto', borderRadius:'14px',padding:'12px', border:'3px solid black'}} placeholder='Search Here....' name='value'/>
    <div className='properties'>
     
      {cards && cards.map((element, index) => (
        <div className='card-container' key={index} style={{ gap: '10px' }}>
          <div className="card" style={{ width: '35rem' }}>
            <img className="card-img-top" src={element.img} alt="Card image cap" />
            <div className="card-body">
              <h5 className="card-title">{element.title}</h5>
              <p className="card-text">{element.desc}</p>
              <button onClick={() => { onClickButton(element.title, element.desc, element.img) }} style={{backgroundColor:'#1eef1e'}}>
                Visit Site
              </button>
            </div>
          </div>
        </div>
      ))}
      {selected && <Repre {...selected} />}
    </div>
    </div>
  );
};

export default Prop;
