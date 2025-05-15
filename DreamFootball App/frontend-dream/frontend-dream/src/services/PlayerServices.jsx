import axios from "axios";
const URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = (response) => {
  try {
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.message };
    }
  } catch (error) {
    return { error: error };
  }
};

const PlayerServices = {
  // Get all player statistics
  fetchPlayerStatistics: async () => {
    try {
      const response = await axios.get(
        `${URL}/players/statistics`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  }

}


export default PlayerServices;