import React, { useState } from "react";
import AuthServices from "../services/AuthServices";
import logo from "../assets/logoWhite.png";
import registebg from "../assets/register.png";
import { BsGoogle } from "react-icons/bs";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(null);
    e.preventDefault();
    console.log('registering')
    if (username === "" || name === "" || password === "" || email === "" || address === "" || phone === "" || dob === "" ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const response = await AuthServices.registerCustomer({
        username,
        name,
        password,
        email,
        address,
        phone,
        dob,
      });
      console.log('response', response)
      if (response.error) {
        setError(response.error.response.data.message);
      } else {
        console.log('registered successfully')
        window.location.href = "/customer/login";
        setError(null);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex-col bg-custom">
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 max-sm:w-full max-sm:p-4 max-md:w-2/3 overflow-auto">
      <div className="bg-gray-700 shadow-lg p-10 rounded-3xl w-2/3 bg-opacity-40 max-sm:p-2 max-sm:w-full">
        <div className="flex justify-between items-center mb-3  max-sm:text-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              DREAM <span className="text-[#EF4444]">ARENA</span>
            </h1>
            <p className="text-white text-center">
              Register to book your favorite ground
            </p>
          </div>
          <img src={logo} alt="logo" className="w-36 h-36" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1">
              <span>{error}</span>
              <div>
                <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
              </div>
            </div>
          )}
          <div className="flex gap-2 max-sm:flex-col">
            <div className="w-full">
              <label className="text-white block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="rounded-md p-3 border border-gray-300 w-full opacity-70"
              />
            </div>
            <div className="w-full">
              <label className="text-white block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="full name"
                className="rounded-md p-3 border border-gray-300 w-full opacity-70"
              />
            </div>
          </div>
          <div className="flex gap-2 max-sm:flex-col">
            <div className="w-full">
              <label className="text-white block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="rounded-md p-3 border border-gray-300  w-full opacity-70"
              />
            </div>
            <div className="w-full">
              <label className="text-white block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="rounded-md p-3 border border-gray-300  w-full opacity-70"
              />
            </div>
          </div>
          <div className="flex gap-2 max-sm:flex-col">
            <div className="w-full">
              <label className="text-white block mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="address"
                className="rounded-md p-3 border border-gray-300 w-full opacity-70"
              />
            </div>
            <div className="w-full">
              <label className="text-white block mb-1">Phone</label>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={phone => setPhone(phone)}
                inputClass="!w-full !rounded-md !p-3 !border !border-gray-300 opacity-70"
                containerClass="w-full"
                buttonClass="!border !border-gray-300 !rounded-l-md"
                dropdownClass="!bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 max-sm:flex-col">
            <div className="w-full">
              <label className="text-white block mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="dob"
                className="rounded-md p-3 border border-gray-300  w-full opacity-70"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className={`btn btn-primary bg-[#EF4444] border-none hover:bg-[#a63030] hover:scale-105 mt-5 w-96 max-md:w-full max-sm:w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""}`}
              type="submit"
            >
              {loading && <span className="loading loading-spinner"></span>}
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-white">
              Already have an account?{" "}
              <a href="/customer/login" className="text-[#EF4444]">
                Login
              </a>
            </p>
          </div>
          <div className="flex items-center justify-center text-white border-t border-gray-300"></div>
          {/* <div className="flex items-center justify-center text-white">
            <BsGoogle className="text-2xl text-red-500" />
            <span className="ml-2">Sign in with Google</span>
          </div> */}
        </form>
      </div>
    </div>
  </div>
);

};

export default Register;