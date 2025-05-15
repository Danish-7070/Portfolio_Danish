import React, { useState } from "react";
import logo from "../../../assets/logoWhite.png";
import registebg from "../../../assets/register.png";
import { BsGoogle } from "react-icons/bs";
import TeamServices from "../../../services/TeamServices";

const TeamLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const response = await TeamServices.loginTeam(email, password);
      if (response.error) {
        setError(response.error.response.data.message);
      } else {
        console.log("Logged in successfully");
        localStorage.setItem("teamToken", response.data.teamToken);
        setError(null);
        setEmail("");
        setPassword("");
        window.location.href = "/teams";
      }
    } catch (error) {
      console.log("Error occurred", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-col bg-gray-800"
      style={{ backgroundImage: `url(${registebg})`, backgroundSize: "cover" }}
    >
      <div className="flex flex-col items-center justify-center h-screen gap-4 max-sm:w-full max-md:w-2/3 max-sm:p-4">
        <div className="bg-gray-700 shadow-lg p-10 rounded-3xl w-1/3 bg-opacity-40 max-sm:w-full max-md:w-full max-sm:p-3">
          <div className="flex justify-between items-center mb-3 max-sm:text-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                TEAM <span className="text-[#EF4444]">PORTAL</span>
              </h1>
              <p className="text-white text-center">
                Login to manage your team
              </p>
            </div>
            <img src={logo} alt="logo" className="w-36 h-36" />
          </div>
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
                className={`btn btn-primary bg-[#EF4444] border-none hover:bg-[#a63030] hover:scale-105 mt-5  w-full text-white rounded-full ${
                  loading ? "cursor-not-allowed" : ""
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
                <a href="/teams/register" className="text-[#EF4444]">
                  Register
                </a>
              </p>
            </div>

            <div className="flex items-center justify-center text-white border-t border-gray-300"></div>

            <div className="flex items-center justify-center text-white">
              <BsGoogle className="text-2xl text-red-500" />
              <span className="ml-2">Sign in with Google</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;
