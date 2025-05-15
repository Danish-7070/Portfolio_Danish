import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";

const URL = import.meta.env.VITE_BACKEND_URL;

const SocialMedia = () => {
  return (
    <section className="bg-customDark text-white">
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md sm:text-center">
          <div className="flex items-center justify-center">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl text-primary shadow-md shadow-red-400 w-fit">Connect With Us</h2>
          </div>
          
          {/* YouTube Video Embed */}
          <div className="relative pb-8">
            <div className="overflow-hidden rounded-lg shadow-xl ">
              {/* <div className="flex justify-center items-center mb-4">
                <FaYoutube className="w-10 h-10 text-red-600 mr-2" />
                <h3 className="text-xl font-bold">Latest Video</h3>
              </div> */}
              <iframe
                className="w-full h-96 mx-auto"
                src="https://www.youtube.com/embed/d-uH902DVTc?si=3V05gtlDPUXj4XWg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
          {/* Social Media Section */}
          <div className="mt-5 space-y-6">
            <h3 className="text-2xl font-bold mb-4">Follow Us On Social Media</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Instagram */}
              <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-gray-700 max-w-xs w-full">
                <FaInstagram className="w-12 h-12 text-pink-500 mb-3" />
                <h4 className="text-xl font-semibold mb-2">Instagram</h4>
                <p className="text-gray-300 text-center">Follow us <a href="https://www.instagram.com/dreamfootballarena" target="_blank" className="text-blue-400 hover:underline font-medium">@dreamfootballarena</a> for updates, behind-the-scenes content and more!</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-300 flex justify-center items-center">
                <FaEnvelope className="w-5 h-5 mr-2 text-blue-400" />
                Want to collaborate or have questions? Reach out to us at <a href="mailto:contact@example.com" className="text-blue-400 hover:underline ml-1">dreamfootball@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;