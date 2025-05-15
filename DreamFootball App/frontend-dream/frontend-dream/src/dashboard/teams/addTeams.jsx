import React, { useState } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import TeamServices from "../../services/TeamServices";
import { X, Upload, Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";

const AddTeams = ({ setActiveTab }) => {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamImage, setTeamImage] = useState(null);
  const [teamImagePreview, setTeamImagePreview] = useState(null);
  const [city, setCity] = useState("");
  
  // Store player names only, with image set to null
  const [players, setPlayers] = useState([{ name: "" }]);
  
  // Handle team image change
  const handleTeamImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamImage(file);
      setTeamImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (
      teamName === "" ||
      players.some((player) => player.name === "") ||
      password === "" ||
      email === "" ||
      !teamImage
    ) {
      setError("Please fill in all required fields including team image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("teamName", teamName);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("image", teamImage);
      formData.append("city", city);
      
      // Convert players array to JSON string with name only
      const playersData = players.map(player => ({
        name: player.name,
        image: { url: null, filename: null } // Send null for player images
      }));
      
      formData.append("players", JSON.stringify(playersData));

      // Submit form data
      const response = await TeamServices.addTeam(formData);
      console.log("Response of add team: ", response);
      
      if (response.error) {
        throw new Error(response.error.response?.data?.message || response.error.message || "Unknown error occurred");
      }
      
      toast.success("Team created successfully");
      setActiveTab("View Teams");
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
      toast.error("Error while adding team");
      console.error('Error while adding team: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerNameChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name: value };
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    setPlayers([...players, { name: "" }]);
  };

  const removePlayerField = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const removeTeamImage = () => {
    setTeamImage(null);
    setTeamImagePreview(null);
  };

  return (
    <div className="flex flex-col justify-center gap-4 w-full max-sm:w-full max-md:w-2/3">
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Add a New Team</h1>
          {error && (
            <div role="alert" className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto">
              <span>{error}</span>
              <button type="button" className="btn btn-sm border-none" onClick={() => setError(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="form-group">
              <label className="text-gray-500">Team Image</label>
              <div className="mt-2">
                {teamImagePreview ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={teamImagePreview}
                      alt="Team preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeTeamImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload size={24} className="text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleTeamImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="text-gray-500">Team Name</label>
              <input
                required
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Team A"
                className="rounded-md p-3 border border-gray-300 w-full"
              />
            </div>

            <div className="form-group">
              <label className="text-gray-500">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="rounded-md p-3 border border-gray-300 w-full"
              />
            </div>

            <div className="form-group">
              <label className="text-gray-500">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-md p-3 border border-gray-300 w-full"
              />
            </div>

            <div className="form-group">
            <label className="text-gray-500">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-md p-3 border border-gray-300"
              >
                <option value="">Select Ground City</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Karachi">Karachi</option>
                <option value="Quetta">Quetta</option>
                <option value="Kashmir">Kashmir</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <h2 className="text-xl font-bold mt-4">Players</h2>
          {players.map((player, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1} Name`}
                className="rounded-md p-3 border border-gray-300 w-full"
              />
              <button
                type="button"
                onClick={() => removePlayerField(index)}
                className="btn btn-error"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addPlayerField}
            className="btn btn-secondary w-48"
          >
            <Plus size={18} /> Add Player
          </button>

          <button
            className={`btn btn-primary mt-5 w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner"></span>}
            {loading ? "Creating Team..." : "Create Team"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddTeams;