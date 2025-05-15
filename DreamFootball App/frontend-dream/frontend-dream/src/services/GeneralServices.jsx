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

const GeneralServices = {
  getGrounds: async () => {
    try {
      const response = await axios.get(`${URL}/general/grounds`);
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  }
};

export default GeneralServices;