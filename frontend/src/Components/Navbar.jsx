import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='container_02'>
      <nav className="navbar navbar-expand-lg navbar-light bg-secondary fixed-top">
  <Link className="navbar-brand" to="#">ESTATE</Link>
 
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item navelem">
        <Link className="nav-link" to="/signup"><button className='btn btn-warning'>Signup</button></Link>
      </li>
     
    </ul>
  </div>
</nav>
    </div>
  )
}

export default Navbar
