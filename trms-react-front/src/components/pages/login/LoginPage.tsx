/* eslint-disable react-hooks/rules-of-hooks */
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks';
import { loginAsync } from '../../../slices/user.slice';

const login: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(loginAsync({username, password}));
    if(result.meta.requestStatus === 'fulfilled'){
      history.push('/');
    }else{
      window.alert("login failed!");
    }
  }

  return(
    <>
      <div className="spacer"/>
      <div className="container w-50 secondary-color-2 p-3 rounded">
        <form onSubmit={handleFormSubmit} > 
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">User name:</label>
            <input type="text" className="form-control" placeholder="Enter username" onChange={handleUsernameChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password:</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={handlePasswordChange}/>
          </div>
          <br/>
          <button type="submit" className="btn btn-primary text-light primary-color">Login</button>
        </form>
      </div>
    </>
  );
}

export default login;