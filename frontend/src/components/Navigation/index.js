import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";


function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <><section className="buttons">
        <span><NavLink to='/spots/new'><button className="createSpot">Create a new spot</button></NavLink></span>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </section>
      </>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          className="loginBut"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          className="signupBut"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <section className="ulNav">

      <NavLink className="EarthBnB" exact to="/">
        EarthBnB
      </NavLink>


      {isLoaded && sessionLinks}
    </section>
  );
}

export default Navigation;
