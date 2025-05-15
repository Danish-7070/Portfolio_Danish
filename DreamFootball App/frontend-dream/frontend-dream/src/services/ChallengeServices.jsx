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

const ChallengeServices = {
  fetchChallenges: async () => {
    try {
      const response = await axios.get(`${URL}/challenge`);
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
  sendChallenge: async ({ challenged, ground, date, time }) => {
    try {
      console.log("Ground:", ground);
      const token = localStorage.getItem("teamToken");
      const response = await axios.post(
        `${URL}/challenge`,
        {
          challenged,
          ground,
          date,
          time,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
  changeChallengeStatus: async (challengeId, status) => {
    try {
      const response = await axios.put(`${URL}/challenge/${challengeId}`, {
        status,
      });
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
  getChallengesForTeam: async () => {
    try {
      const token = localStorage.getItem("teamToken");
      const response = await axios.get(`${URL}/challenge/active`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
};

export default ChallengeServices;
