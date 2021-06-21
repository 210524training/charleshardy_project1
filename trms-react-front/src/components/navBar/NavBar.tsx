/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutAsync, selectUser, UserState } from '../../slices/user.slice';




const navbar: React.FC<unknown> = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const user = useAppSelector<UserState>(selectUser);

  const handleLogout = async() => {
    const result = await dispatch(logoutAsync());
    if(result.meta.requestStatus === 'fulfilled'){
      history.push('/');
    }else{
      window.alert("logout failed!");
    }
  }
  return(
    <>
      <nav className="navbar navbar-expand-md navbar-light fixed-top bg-primary primary-color">
        <div id="nav" className="container-fluid">
          <NavLink className="navbar-brand text-light" to="/">TRMS</NavLink>
          <button className="navbar-toggler secondary-color-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon secondary-color-2"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav">
              { !user ? (<></>):(
                <>
                  <li className="nav-item">
                  <NavLink className="nav-link text-light" to="/reimbursments">Reimbursements</NavLink>
                  </li>
                </>)
              }
            </ul>
            <ul className="navbar-nav ms-auto">
              { !user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link text-light" to="/login">Login</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-light" to="/register">Register</NavLink>
                  </li>
                </>
                ) : (
                  <>
                    <li className="nav-item nav-link text-light circle">
                      <button type="button" className="btn btn-primary primary-color" onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
      <div className="spacer"></div>
    </>
  );
}

export default navbar;