import axios from "axios";
const URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = (response) => {
  try {
    console.log("🚀 ~ handleResponse ~ response:", response);
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.message };
    }
  } catch (error) {
    return { error: error };
  }
};

const TeamServices = {
  addTeam: async (formData) => {
    try {
      for (let pair of formData.entries()) {
        console.log('FormData content:', pair[0], pair[1]);
      }

      const response = await axios.post(
        `${URL}/teams`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },

  fetchTeams: async () => {
    try {
      const response = await axios.get(`${URL}/teams`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
  fetchTeamsForCustomers: async () => {
    try {
      const response = await axios.get(`${URL}/customer/teams`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
  removeTeam: async (teamId) => {
    try {
      const response = await axios.delete(`${URL}/teams/${teamId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },

  // team auth
  loginTeam: async (email, password) => {
    try {
      const response = await axios.post(
        `${URL}/customer/teams/login`,
        { email, password },
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
  },
  registerTeam: async (teamName, players, password, email) => {
    try {
      const response = await axios.post(
        `${URL}/customer/teams/register`,
        {
          teamName,
          players,
          password,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          }
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },

  // Add this method to your existing TeamServices.js file
fetchTeamStatistics: async () => {
    try {
      const response = await axios.get(`${URL}/teams/statistics`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
}

export default TeamServices;
