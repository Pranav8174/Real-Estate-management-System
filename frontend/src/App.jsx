import React from 'react';
import Home from './Components/Home';
import Signup from './Components/SignUp'; 
import Prop from './Components/Prop';
import Signin from './Components/SignIn';
import { Routes, Route } from 'react-router-dom';
import Repre from './Components/Repre';
import PaymentButton from './Components/PaymentButton';
import AddProperty from './Components/AddProperty';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/payment' element={<PaymentButton />} />
        <Route path='/addProperty' element={<AddProperty />} />
        <Route path='/prop' element={<Prop />} />
        <Route path='/repre' element={<Repre />} />
      </Routes>
    </div>
  );
};

export default App;
