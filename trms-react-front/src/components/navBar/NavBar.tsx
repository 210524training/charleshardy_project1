import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
//import { useAppDispatch, useAppSelector } from '../../hooks';
//import { logout, selectUser, UserState } from '../../slices/user.slice';

type Props = {
}

/*
const Navbar: React.FC<Props> = (props) => {

  const history = useHistory();
  const dispatch = useAppDispatch();
  // We "Select" the User data from the state
  const user = useAppSelector<UserState>(selectUser);

  const handleLogout = () => {
    dispatch(logout());

    history.push('/');
  }
*/

const navbar: React.FC<unknown> = (props) => {
    return(
      <>
        <nav className="navbar navbar-expand-md navbar-light fixed-top bg-primary primary-color">
          <div id="nav" className="container-fluid">
            <NavLink className="navbar-brand text-light" to="/">GrubDash</NavLink>
            <button className="navbar-toggler secondary-color-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span className="navbar-toggler-icon secondary-color-2"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link text-light" to="/restaurants">Restaurants</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-light" to="/clicker">Clicker</NavLink>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                    <NavLink className="nav-link text-light" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link text-light" to="/register">Register</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="spacer"></div>
      </>
    );
}

export default navbar;