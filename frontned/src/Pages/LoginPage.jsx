import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../Services/api";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        //   navigate("/");
        window.location = "/";
        alert("Login successful");
      }
    } catch (error) {
      console.log(error);
      alert("Error while logging in " + error.message);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          Don't Have an account?{" "}
          <NavLink to="/register" p={1}>
            Register
          </NavLink>{" "}
          Now!
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
