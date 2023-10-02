// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

   const loginDisabled = credential.length < 4 || password.length < 6;

  return (
    <>
    <div className="loginScreen">
      <h1 className="loginDisplay">Log In</h1>
      <form id='loginForm' onSubmit={handleSubmit}>


          <input className="loginInput"
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />

    <br></br>

          <input
            type="password"
            placeholder="Password"
            className="loginInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br></br>

        {errors.credential && (
          <p className="errorMsg">{errors.credential}</p>
        )}
        <button
          className="loginSubmit"
          disabled={credential.length < 4 || password.length < 6}
          type="submit"
        >
          Log In
        </button>
      </form>
      <button className="loginModal"
       onClick={() => {
      setCredential('Demo-lition');
        setPassword('password');
        dispatch(sessionActions.login({credential: 'Demo-lition', password: 'password'}))
        .then(closeModal)
      }}>
        Demo User
        </button>
      </div>
    </>
  );
}

export default LoginFormModal;
