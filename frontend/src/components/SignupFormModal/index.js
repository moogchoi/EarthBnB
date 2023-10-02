import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>

      {errors.firstName && (
        <p className="signup-errors">• {errors.firstName}</p>
      )}
      {errors.lastName && <p className="signup-errors">• {errors.lastName}</p>}
      {errors.email && <p className="signup-errors">• {errors.email}</p>}
      {errors.username && <p className="signup-errors">• {errors.username}</p>}
      {errors.confirmPassword && (
        <p className="signup-errors">• {errors.confirmPassword}</p>
      )}
      <form className="signupForm" onSubmit={handleSubmit}>
        <div className="label-input-container">
          <label className="signup-label">First Name:</label>
        </div>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <div className="label-input-container">
          <label className="signup-label">Last Name:</label>
        </div>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <div className="label-input-container">
          <label className="signup-label">Email:</label>
        </div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="label-input-container">
          <label className="signup-label">Username:</label>
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="label-input-container">
          <label className="signup-label">Password:</label>
          {errors.password && <p>{errors.password}</p>}
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="label-input-container">
          <label className="signup-label">Confirm Password:</label>
        </div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          className="signup-submitbutton"
          disabled={
            username.length < 4 ||
            password.length < 6 ||
            firstName.length < 1 ||
            lastName.length < 1 ||
            confirmPassword.length < password.length ||
            email.length < 1
          }
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
