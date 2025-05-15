import React, { useState } from "react";
import { X, Upload, Trash, Plus } from "lucide-react";
import toast from "react-hot-toast";

const EditTeamForm = ({ teamData, onSubmit }) => {
    const [teamName, setTeamName] = useState(teamData.teamName);
    const [email, setEmail] = useState(teamData.email || "");
    // Convert players from the updated model format
    const [players, setPlayers] = useState(
        teamData.players ? teamData.players.map(player => ({
            _id: player._id,
            name: player.name
        })) 
        :
        []
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(teamData?.image || null);
    const [previewUrl, setPreviewUrl] = useState(teamData.image?.url || null);
    const [imageChanged, setImageChanged] = useState(false);
    const [city, setCity] = useState(teamData.city || "");
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageChanged(true);
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
        setImageChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (teamName === "") {
            setError("Team name is required");
            setLoading(false);
            return;
        }

        try {
            // Use FormData for file uploads
            const formData = new FormData();
            formData.append("teamName", teamName);
            formData.append("email", email);
            formData.append("city", city);
            
            // Filter out empty player entries and format for the updated model
            const validPlayers = players
                .filter(player => player.name.trim() !== "")
                .map(player => ({
                    _id: player._id, // Include _id for existing players
                    name: player.name,
                    image: { url: null, filename: null } // Set image to null as requested
                }));
                
            // Convert players array to JSON string
            formData.append("players", JSON.stringify(validPlayers));
            
            // Only append image if it was changed or new
            if (imageChanged && image) {
                formData.append("image", image);  // Send the new image if changed
            }

            await onSubmit(formData, teamData._id);
            toast.success("Team updated successfully");
        } catch (error) {
            setError(error?.message || "Error updating team");
            toast.error("Error updating team");
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
        // Add a new player without an ID (backend will create one)
        setPlayers([...players, { name: "" }]);
    };

    const removePlayerField = (index) => {
        const newPlayers = players.filter((_, i) => i !== index);
        setPlayers(newPlayers);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Edit Team</h1>
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
                        {previewUrl ? (
                            <div className="relative w-32 h-32">
                                <img
                                    src={previewUrl}
                                    alt="Team preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
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
                                        onChange={handleImageChange}
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
            {players && players.map((player, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="rounded-md p-3 border border-gray-300 w-full"
                    />
                    <button
                        type="button"
                        onClick={() => removePlayerField(index)}
                        className="btn btn-secondary"
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
                {loading ? "Updating Team..." : "Update Team"}
            </button>
        </form>
    );
};

export default EditTeamForm;