import React, { useState } from "react";

import logoWhite from "../../assets/logoWhite.png";
import tflogoWhite from "../../assets/TF-Logo-White.png";
import logo2 from "../../assets/homeLogos/2.png";
import logo3 from "../../assets/homeLogos/3.png";
import { useUser } from "../../context/userContext";
import { useTeam } from "../../context/teamContext";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { customer } = useUser();
  const { currTeam } = useTeam();

  return (
    <div className="bg-[#233c19] fixed top-0 w-full z-50">
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-4">
          <img src={logoWhite} alt="logo" className="w-10 h-10" />
          <img src={tflogoWhite} alt="logo" className="w-10 h-10" />
          <img src={logo2} alt="logo" className="w-10 h-10" />
          <img src={logo3} alt="logo" className="w-10 h-10" />
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <a href="/" className="text-white">
            Home
          </a>

          {customer && !currTeam && (
            <>
              <a href="/customer/booking" className="text-white">
                Booking
              </a>
              <a href="/customer/match-requests" className="text-white">
                Match Requests
              </a>
              <a href="/player-profiles" className="text-white">
                Players
              </a>
              <a href="/contact" className="text-white">
                Contact
              </a>
              <a href="/invest" className="text-white">
                What We Offer
              </a>
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="text-white cursor-pointer"
              >
                Logout
              </div>
            </>
          )}

          {currTeam && customer && (
            <>
              <a href="/customer/booking" className="text-white">
                {`Booking for Customer`}
              </a>
              <a href="/teams/booking" className="text-white">
                {`Booking for Teams`}
              </a>
              <a href="/teams" className="text-white">
                Teams
              </a>
              <a href="/customer/leagues" className="text-white">
                Leagues
              </a>
              <a href="/player-profiles" className="text-white">
                Players
              </a>
              <a href="/contact" className="text-white">
                Contact
              </a>
              <a href="/invest" className="text-white">
              What We Offer
              </a>
              <div
                onClick={() => {
                  localStorage.removeItem("teamToken");
                  window.location.href = "/customer/login";
                }}
                className="text-white cursor-pointer"
              >
                Logout Team
              </div>
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="text-white cursor-pointer"
              >
                Logout User
              </div>
            </>
          )}

          {currTeam && !customer && (
            <>
              <a href="/teams/booking" className="text-white">
                Booking
              </a>
              <a href="/teams" className="text-white">
                Teams
              </a>
              <a href="/customer/leagues" className="text-white">
                Leagues
              </a>
              <a href="/player-profiles" className="text-white">
                Players
              </a>
              <a href="/contact" className="text-white">
                Contact
              </a>
              <a href="/invest" className="text-white">
              What We Offer
              </a>
              <div
                onClick={() => {
                  localStorage.removeItem("teamToken");
                  window.location.href = "/customer/login";
                }}
                className="text-white cursor-pointer"
              >
                Logout Team
              </div>
              {/* <a href="/customer/login" className="text-white">
                Login
              </a>
              <a href="/customer/register" className="text-white">
                Register
              </a> */}
            </>
          )}

          {!customer && !currTeam && (
            <>
              <a href="/invest" className="text-white">
              What We Offer
              </a>
              <a href="/customer/login" className="text-white">
                Login
              </a>
              <a href="/customer/register" className="text-white">
                Register
              </a>
            </>
          )}

          {/* <button
            className="bg-primary btn text-white"
            onClick={() => {
              window.location.href = "/admin/login";
            }}
          >
            Portal Login
          </button> */}
        </div>

        <div className="md:hidden">
          <button onClick={() => setShowMenu(!showMenu)} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="flex flex-col gap-4 p-4">
          <a href="/" className="text-white">
            Home
          </a>
          {customer && !currTeam && (
            <>
              <a href="/customer/booking" className="text-white">
                Booking
              </a>
              <a href="/customer/match-requests" className="text-white">
                Match Requests
              </a>
              <a href="/teams" className="text-white">
                Teams
              </a>
              <a href="/player-profiles" className="text-white">
                Players
              </a>
              <a href="/contact" className="text-white">
                Contact
              </a>
              <a href="/invest" className="text-white">
              What We Offer
              </a>
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="text-white cursor-pointer"
              >
                Logout
              </div>
            </>
          )}

          {currTeam && customer && (
            <>
              <a href="/customer/booking" className="text-white">
                Booking
              </a>
              <a href="/teams" className="text-white">
                Teams
              </a>
              <a href="/customer/leagues" className="text-white">
                Leagues
              </a>
              <a href="/player-profiles" className="text-white">
                Players
              </a>
              <a href="/contact" className="text-white">
                Contact
              </a>
              <a href="/invest" className="text-white">
              What We Offer
              </a>
              <div
                onClick={() => {
                  localStorage.removeItem("teamToken");
                  window.location.href = "/customer/login";
                }}
                className="text-white cursor-pointer"
              >
                Logout Team
              </div>
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="text-white cursor-pointer"
              >
                Logout User
              </div>
            </>
          )}

          {currTeam && !customer && (
            <>
              <a href="/customer/booking" className="text-white">
                Booking
              </a>
              <a href="/teams" className="text-white">
                Teams
              </a>
              <a href="/customer/leagues" className="text-white">
                Leagues
              </a>
              <a href="/player-profiles" className="text-white">
                Players
              </a>
              <a href="/contact" className="text-white">
                Contact
              </a>
              <a href="/invest" className="text-white">
              What We Offer
              </a>
              <div
                onClick={() => {
                  localStorage.removeItem("teamToken");
                  window.location.href = "/customer/login";
                }}
                className="text-white cursor-pointer"
              >
                Logout Team
              </div>
              <a href="/customer/login" className="text-white">
                Login
              </a>
              <a href="/customer/register" className="text-white">
                Register
              </a>
            </>
          )}

          {!customer && !currTeam && (
            <>
              <a href="/invest" className="text-white">
              What We Offer
              </a>
              <a href="/customer/login" className="text-white">
                Login
              </a>
              <a href="/customer/register" className="text-white">
                Register
              </a>
            </>
          )}

          {/* <button
            className=" bg-primary btn text-white"
            onClick={() => {
              window.location.href = "/admin/login";
            }}
          >
            Portal Login
          </button> */}
        </div>
      )}
    </div>
  );
};

export default Navbar;
