import React, { useState } from 'react';

const LeagueForm = ({ onSubmit, teamsData }) => {
    const [leagueName, setLeagueName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!leagueName || !startDate || !endDate || selectedTeams.length === 0 || !image) {
            setError('Please fill in all fields and upload an image');
            setLoading(false);
            return;
        }

        // Prepare the data
        const leagueData = new FormData();
        leagueData.append("leagueName", leagueName);
        leagueData.append("startDate", startDate);
        leagueData.append("endDate", endDate);
        leagueData.append("teams", JSON.stringify(selectedTeams));
        leagueData.append("image", image);

        // Call onSubmit (sending the form data to the backend)
        onSubmit(leagueData);
        resetForm();
    };


    // Function to reset form fields
    const resetForm = () => {
        setLeagueName('');
        setStartDate('');
        setEndDate('');
        setSelectedTeams([]);
        setError(null);
    };

    // Function to handle checkbox changes
    const handleCheckboxChange = (teamId) => {
        if (selectedTeams.includes(teamId)) {
            setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
        } else {
            setSelectedTeams([...selectedTeams, teamId]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-3/4 mx-auto flex-col gap-4">
            <h1 className="text-2xl font-bold">Add a New League</h1>


            <div className="flex flex-col gap-4">
                <label className="text-gray-500">League Image</label>
                <div className="mt-2">
                    {previewUrl ? (
                        <div className="relative w-32 h-32 rounded-full">
                            <img
                                src={previewUrl}
                                alt="League preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
                            <label className="flex flex-col items-center cursor-pointer">
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
            
            <div className="flex flex-col gap-2">
                <label className="text-gray-500">League Name</label>
                <input
                    type="text"
                    value={leagueName}
                    onChange={(e) => setLeagueName(e.target.value)}
                    placeholder="Enter League Name"
                    required
                    className="rounded-md p-3 border border-gray-300"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-gray-500">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="rounded-md p-3 border border-gray-300"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-gray-500">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="rounded-md p-3 border border-gray-300"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-gray-500">Select Teams</label>
                <div className="flex flex-col gap-2">
                    {teamsData.map((team) => (
                        <div key={team._id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={team._id}
                                value={team._id}
                                checked={selectedTeams.includes(team._id)}
                                onChange={() => handleCheckboxChange(team._id)}
                                className="mr-2"
                            />
                            <label htmlFor={team.id} className="text-gray-700">
                                {team.teamName}
                            </label>
                        </div>
                    ))}
                </div>
            </div>



            {error && <p className="text-red-500">{error}</p>}

            <button
                className={`btn btn-primary mt-5 w-full max-sm:w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""
                    }`}
                type="submit"
            >
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? "Creating League..." : "Create League"}
            </button>
        </form>
    );
};

export default LeagueForm;
