import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../firebase/FirebaseFunctions';
import {AuthContext} from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';
import { Button } from '@mui/material';


function SignUp() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (e) => {
    e.preventDefault();
    const {displayName, email, passwordOne, passwordTwo} = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <div>
      <h1 style={{color: "#fff"}}>Sign up</h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          <label style={{color: "#888989"}}>
            Name:
            <input
              className='form-control'
              required
              name='displayName'
              type='text'
              placeholder='Name'
            />
          </label>
        </div>
        <div className='form-group'>
          <label style={{color: "#888989"}}>
            Email:
            <input
              className='form-control'
              required
              name='email'
              type='email'
              placeholder='Email'
            />
          </label>
        </div>
        <div className='form-group'>
          <label style={{color: "#888989"}}>
            Password:
            <input
              className='form-control'
              id='passwordOne'
              name='passwordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label style={{color: "#888989"}}>
            Confirm Password:
            <input
              className='form-control'
              name='passwordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <Button id='submitButton' className='loginBtn' name='submitButton' type='submit'>
          Sign Up
        </Button>
      </form>
      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignUp;