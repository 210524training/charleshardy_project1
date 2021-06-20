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
  const [role='employee', setRole] = useState<string>('');
  
  //setRole('employee');
  const roles = [
    <option selected value="employee">employee</option>,
    <option value="supervisor">supervisor</option>,
    <option value="department head">department head</option>
    ];

    

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>)=>{
    setRole(e.target.value);
  }

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  };

  return(
    <>
    <div className="spacer"/>
        <div className="container w-75 secondary-color-2 p-3 rounded">
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="inputUsername">User name:</label>
                    <input type="text" id="inputUsername" className="form-control" placeholder="Enter username" onChange={handleUsernameChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="InputPassword">Password:</label>
                    <input type="password" className="form-control" id="InputPassword" placeholder="Password" onChange={handlePasswordChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputRole">Select role:</label>
                    <select id="inputRole" className="form-select" aria-label="Default select example" onChange={handleRoleChange}>
                        {roles}
                    </select>
                </div>
                
                <br/>
            <button type="submit" className="btn btn-primary text-light primary-color">Register</button>
            </form>
        </div>
    </>
  );
}

export default login;