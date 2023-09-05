import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import './ProfileButton.css'


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(sessionActions.logout());
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <section className="homeButton">
        <button className="button" onClick={openMenu}>
          <span className="bars">
            <i className="fa-solid fa-bars"></i>
          </span>
          <i className="fa-solid fa-user-large"></i>
        </button>
        <section className="dropdown">
          <ul id="manageId" className={ulClassName} ref={ulRef}>
            <li>Hello, {user.firstName}</li>

            <li>{user.email}</li>

            <li><Link to='/spots/current'><button className="manSpot"
              onClick={() => setShowMenu(false)}>Manage Spots</button></Link></li>
            <li>
              <button className="manSpot2"
                onClick={logout}>Log Out</button>
            </li>

          </ul>
        </section>
      </section>
    </>
  );
}

export default ProfileButton;
