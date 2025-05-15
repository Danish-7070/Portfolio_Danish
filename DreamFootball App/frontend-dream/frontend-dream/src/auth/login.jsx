import React, { useState } from "react";
import AuthServices from "../services/AuthServices";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import dfa1 from "../assets/dfa1.jpg";

const URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (username === "" || password === "") {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const response = await AuthServices.login(username, password);
      if (response.error) {
        setError(response.error.response.data.message || 'An error occurred');  
      } else {
        setError(null);
      }
    } catch (error) {
      console.log('error', error)
      setError(error.response.data.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex ">
      <div className="w-1/2 h-screen max-sm:w-0 max-md:w-1/3">
        <img src={dfa1} alt="dfa1" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col items-center justify-center h-screen gap-4 w-1/2 max-sm:w-full max-md:w-2/3 max-sm:p-5">
        <img src={logo} alt="logo" className="w-36 h-36" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">DREAM FOOTBALL ARENA</h1>
          {error && (
                <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1">
                  <span>{error}</span>
                  <div>
                    <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
                  </div>
                </div>
              )}
          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            className="rounded-md p-3 border border-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md p-3 border border-gray-400"
          />
          <p className="text-gray-500 text-sm text-center">
            Incase you don't have an account, please contact the technical team.
          </p>
          <button
            className={`btn btn-primary mt-5 w-96 max-sm:w-full text-white rounded-full ${
              loading ? "cursor-not-allowed" : ""
            }`}
            type="submit"
          >
            {loading && <span className="loading loading-spinner"></span>}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
