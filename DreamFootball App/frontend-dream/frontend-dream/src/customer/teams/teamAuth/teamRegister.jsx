import React, { useState } from "react";
import logo from "../../../assets/logoWhite.png";
import registebg from "../../../assets/register.png";
import TeamServices from "../../../services/TeamServices";
import { BsGoogle } from "react-icons/bs";

const TeamRegister = () => {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([""]);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      teamName === "" ||
      players.some((player) => player === "") ||
      password === "" ||
      email === ""
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await TeamServices.registerTeam(
        teamName,
        players,
        password,
        email
      );
      if (response.error) {
        setError(response.error.response?.data.message || "An error occurred");
      } else {
        setError(null);
        console.log("Registered successfully");
        setTeamName("");
        setPlayers([""]);
        setPassword("");
        setEmail("");
        window.location.href = "/teams";
      }
    } catch (error) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    setPlayers([...players, ""]);
  };

  const removePlayerField = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-800"
      style={{ backgroundImage: `url(${registebg})`, backgroundSize: "cover" }}
    >
      <div className="flex flex-col items-center justify-center gap-4 flex-grow p-4">
        <div className="bg-gray-700 shadow-lg p-10 rounded-3xl w-full max-w-md bg-opacity-40">
          <div className="flex justify-between items-center mb-3 text-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                TEAM <span className="text-[#EF4444]">REGISTRATION</span>
              </h1>
              <p className="text-white">Register your team</p>
            </div>
            <img src={logo} alt="logo" className="w-36 h-36" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                role="alert"
                className="alert alert-error leading-tight flex justify-between py-1"
              >
                <span>{error}</span>
                <button className="btn btn-sm border-none" onClick={() => setError(null)}>x</button>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team Name"
                className="rounded-md p-3 border border-gray-300 w-full opacity-70"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-md p-3 border border-gray-300 w-full opacity-70"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="rounded-md p-3 border border-gray-300 w-full opacity-70"
              />
            </div>

            <h2 className="text-xl font-bold text-white">Players</h2>
            {players.map((player, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={player}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="rounded-md p-3 border border-gray-300 w-full opacity-70"
                />
                {players.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePlayerField(index)}
                    className="btn btn-secondary"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addPlayerField}
              className="btn btn-secondary w-48 text-white"
            >
              + Add Player
            </button>

            <div className="flex items-center justify-center">
              <button
                className={`btn btn-primary bg-[#EF4444] border-none hover:bg-[#a63030] hover:scale-105 mt-5 w-full text-white rounded-full ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                type="submit"
              >
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? "Registering..." : "Register"}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <p className="text-white">
                Already have an account?{" "}
                <a href="/teams/login" className="text-[#EF4444]">
                  Login
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

export default TeamRegister;
