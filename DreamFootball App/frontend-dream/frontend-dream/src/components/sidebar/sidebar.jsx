import React, { useState } from "react";
import LogoBG from "../../assets/logoWhite.png";
import { NavLink } from "react-router-dom";
import { RiFootballFill } from "react-icons/ri";
import { CiCalendar, CiUser, CiMoneyBill, CiMail } from "react-icons/ci";
import { AiOutlineTeam } from "react-icons/ai";
import logo from "../../assets/logo.png";
import { BiMenu } from "react-icons/bi";
import { FaFutbol, FaNewspaper, FaRegClipboard } from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { BiLogOut } from "react-icons/bi";

const AdminSiderbar = () => {
  const [show, handleShow] = useState(false);

  const onClickLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={`{show ? "overflow-hidden" : ""}`}>
      <a
        className=" bg-transparent text-black btn-primary btn border-0 font-medium text-sm px-3  cursor-pointer absolute top-1 left-1"
        type="button"
        data-drawer-target="drawer-navigation"
        data-drawer-show="drawer-navigation"
        aria-controls="drawer-navigation"
        onClick={() => handleShow(!show)}
      >
        <BiMenu className="w-10 h-10" />
      </a>
      <img
        src={logo}
        alt="logo"
        className="w-20 h-20 rounded-full absolute top-2 right-2 cursor-pointer"
        onClick={() => (window.location.href = "/")}
      />
      <div
        id="drawer-navigation"
        className="fixed z-50 top-0 left-0 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full shadow-2xl border-r-4 border-gray-600 bg-secondary"
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
        data-drawer="drawer-navigation"
        style={{
          transform: show ? "translateX(0)" : "translate(-100%)",
        }}
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-white uppercase"
        >
          Menu
        </h5>
        <div className="mt-10 mb-4 flex justify-center">
          <img src={LogoBG} alt="logo" className="w-20 h-20 rounded-full" />
        </div>
        <button
          onClick={() => handleShow(!show)}
          type="button"
          aria-controls="drawer-navigation"
          className="text-white bg-transparent hover:bg-gray-200  hover:text-gray-500 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/admin/dashboard/"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <GrDashboard className="w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/ground"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <RiFootballFill className="w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Grounds</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/booking"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <CiCalendar className="w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Booking</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/users"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <CiUser className="w-5 h-5 transition duration-75" />
                <span className="ms-3">Manage Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/newsletter-subscriptions"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <FaNewspaper className="w-5 h-5 transition duration-75" />
                <span className="ms-3">Newsletter Subscriptions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/contact-forms"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <FaNewspaper className="w-5 h-5 transition duration-75" />
                <span className="ms-3">Contact Forms</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/teams"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <AiOutlineTeam className="w-5 h-5 transition duration-75" />
                <span className="ms-3">Teams</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/leagues"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <FaFutbol className="w-5 h-5 transition duration-75" />
                <span className="ms-3">Leagues</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/financial-report"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <FaRegClipboard className="w-5 h-5 transition duration-75" />
                <span className="ms-3">Financial Report</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/news"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <FaNewspaper className="w-5 h-5 transition duration-75" />
                <span className="ms-3">News</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/login"
                onClick={onClickLogout}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-2 bg-gray-700 text-white rounded-lg dark:text-white group"
                    : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                }
              >
                <BiLogOut className="w-5 h-5 transition duration-75" />
                <span className="ms-3">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSiderbar;
