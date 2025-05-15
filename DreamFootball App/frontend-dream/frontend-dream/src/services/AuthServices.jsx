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

const AuthServices = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${URL}/auth/admin/login`, {
        username,
        password,
      });
      console.log('🚀 ~ admin login ~ response:', response  )
      //set token
      localStorage.setItem("token", response.data.token);
      window.location.href = "/admin/dashboard";
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
  customerLogin: async ({email, password}) => {
    try {
      const response = await axios.post(`${URL}/auth/customer/login`, {
        email,
        password,
      });
      //set token
      localStorage.setItem("token", response.data.token);
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },
  registerCustomer: async (data) => {
    try {
      const { username, password, email, address, phone, dob } = data;
      const response = await axios.post(`${URL}/auth/customer/register`, 
        {
          username,
          password,
          email,
          address,
          phone,
          dob,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error };
    }
  },

};

export default AuthServices;