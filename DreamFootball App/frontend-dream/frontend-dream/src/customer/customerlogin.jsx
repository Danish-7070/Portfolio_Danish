import React, { useEffect, useState } from "react";
import AuthServices from "../services/AuthServices";
import TeamServices from "../services/TeamServices";
import logo from "../assets/logoWhite.png";
import tfLogo from "../assets/TF-Logo-White.png"
import registebg from "../assets/register.png";
import { BsGoogle } from "react-icons/bs";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const LoginCustomer = () => {
  const [role, setRole] = useState("customer");
  const queryParams = new URLSearchParams(window.location.search);
  const roleParam = queryParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [teamEmail, setTeamEmail] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [teamError, setTeamError] = useState(null);

  const { customer } = useUser();


  const handleSubmit = async (e) => {
    setLoading(true);
    setError(null);
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const response = await AuthServices.customerLogin({
        email,
        password,
      });
      if (response.error) {
        setError(response.error.response.data.message);
      } else {
        console.log("logged in successfully");
        localStorage.setItem("token", response.data.token);
        setError(null);
        setEmail("");
        setPassword("");
        window.location.href = "/";
      }
    } catch (error) {
      console.log("error occured", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSubmit = async (e) => {
    setLoading(true);
    setTeamError(null);
    e.preventDefault();
    if (teamEmail === "" || teamPassword === "") {
      setTeamError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const response = await TeamServices.loginTeam(teamEmail, teamPassword);
      if (response.error) {
        setTeamError(response.error.response.data.message);
      } else {
        console.log("Logged in successfully");
        localStorage.setItem("teamToken", response.data.teamToken);
        setTeamError(null);
        setTeamEmail("");
        setTeamPassword("");
        window.location.href = "/teams";
      }
    } catch (error) {
      console.log("Error occurred", error);
      setTeamError(error);
    } finally {
      setLoading(false);
    }
  };

  if (customer && roleParam !== "team") {
    return <Navigate to="/" />;
  } 

  useEffect(() => {
    if (roleParam) {
      setRole(roleParam);
    }
  }
  , [roleParam]);

  return (
    <div
      className="flex-col bg-custom"
    // className="flex-col bg-gray-800"
    // style={{ backgroundImage: `url(${registebg})`, backgroundSize: "cover" }}
    >
      <div className="flex flex-col items-center justify-center h-screen gap-4 max-sm:w-full max-md:w-2/3 max-sm:p-4">
        <div className="bg-gray-700 shadow-lg p-10 rounded-3xl w-1/3 bg-opacity-40 max-sm:w-full max-md:w-full max-sm:p-3">
          <div className="flex justify-center items-center mb-3 max-sm:text-center">
            {/* <div>
              <h1 className="text-3xl font-extrabold text-white">
                DREAM <span className="text-[#EF4444]">ARENA</span>
              </h1>
              <p className="text-white text-center">
                Login to book your favorite ground
              </p>
            </div> */}
            <img src={tfLogo} alt="logo" className="w-36 h-36" />
            <img src={logo} alt="logo" className="w-36 h-36" />
          </div>
          {role === "customer" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {error && (
                  <div
                    role="alert"
                    className="alert alert-error leading-tight flex justify-between  py-1"
                  >
                    <span>{error}</span>
                    <div>
                      <button
                        className="btn btn-sm border-none "
                        onClick={() => setError(null)}
                      >
                        x
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="rounded-md p-3 border border-gray-300 w-full opacity-70"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="rounded-md p-3 border border-gray-300  w-full opacity-70"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  className={`btn btn-primary bg-[#EF4444] border-none hover:bg-[#a63030] hover:scale-105 mt-5  w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""
                    }`}
                  type="submit"
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-white">
                  Don't have an account?{" "}
                  <a href="/customer/register" className="text-[#EF4444]">
                    Register
                  </a>
                </p>
              </div>

              <div className="flex items-center justify-center text-white border-t border-gray-300">
                {" "}
              </div>

              <div className="flex items-center justify-center">
                <p className="text-white">Select your role</p>
              </div>
              <div className="flex items-center justify-center text-white gap-5">
                <div className="flex items-center text-white gap-1">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === "customer"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor="customer" className="text-white">
                    Player
                  </label>
                </div>

                <div className="flex items-center justify-center text-white gap-1">
                  <input
                    type="radio"
                    name="role"
                    value="team"
                    checked={role === "team"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor="team" className="text-white">
                    Team
                  </label>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <form onSubmit={handleTeamSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {teamError && (
                    <div
                      role="alert"
                      className="alert alert-error leading-tight flex justify-between  py-1"
                    >
                      <span>{teamError}</span>
                      <div>
                        <button
                          className="btn btn-sm border-none "
                          onClick={() => setTeamError(null)}
                        >
                          x
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="email"
                    value={teamEmail}
                    onChange={(e) => setTeamEmail(e.target.value)}
                    placeholder="email"
                    className="rounded-md p-3 border border-gray-300 w-full opacity-70"
                  />
                  <input
                    type="password"
                    value={teamPassword}
                    onChange={(e) => setTeamPassword(e.target.value)}
                    placeholder="password"
                    className="rounded-md p-3 border border-gray-300  w-full opacity-70"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <button
                    className={`btn btn-primary bg-[#EF4444] border-none hover:bg-[#a63030] hover:scale-105 mt-5  w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""
                      }`}
                    type="submit"
                  >
                    {loading && (
                      <span className="loading loading-spinner"></span>
                    )}
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-white">
                    Don't have an account?{" "}
                    <a href="/teams/register" className="text-[#EF4444]">
                      Register
                    </a>
                  </p>
                </div>
                <div className="flex items-center justify-center text-white border-t border-gray-300">
                  {" "}
                </div>

                <div className="flex items-center justify-center">
                  <p className="text-white">Select your role</p>
                </div>
                <div className="flex items-center justify-center text-white gap-5">
                  <div className="flex items-center text-white gap-1">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={role === "customer"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="customer" className="text-white">
                      Player
                    </label>
                  </div>

                  <div className="flex items-center justify-center text-white gap-1">
                    <input
                      type="radio"
                      name="role"
                      value="team"
                      checked={role === "team"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="team" className="text-white">
                      Team
                    </label>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginCustomer;
