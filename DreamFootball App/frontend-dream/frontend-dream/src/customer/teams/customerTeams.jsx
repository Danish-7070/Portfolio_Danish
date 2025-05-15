import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import ViewCustomerTeams from "./viewCustomerTeams";
import { useTeam } from "../../context/teamContext";
import { Link } from "react-router-dom";
import TeamTabs from "./TeamTabs";

const CustomerTeams = () => {
  const { currTeam } = useTeam();

  return (
    <div className="bg-custom text-white min-h-screen">
    {/* <div className="bg-gray-900 text-white min-h-screen"> */}
      <Navbar />
      <div className="p-10 max-sm:p-5 mt-14">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-5">
          Football Teams
        </h1>
        {currTeam ? (
          <div className="flex flex-col">
            <p className="text-center mb-5 text-primary font-semibold">
              <strong>Logged In: </strong>
              {currTeam.teamName}
            </p>

            {/* <ViewCustomerTeams /> */}
            <TeamTabs/>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-center font-bold">You are not logged in...</p>
            <p className="text-center">Take actions</p>
            <div className="flex items-center justify-center gap-2">
              <Link to={"/customer/login?role=team"}>
                <button className="btn btn-secondary py-0 mt-1 bg-primary hover:text-black">
                  Login As Team
                </button>
              </Link>

              {/* <Link to={"/teams/register"}>
                <button className="btn btn-secondary py-0 mt-1 hover:bg-primary hover:text-black">
                  Register Team
                </button>
              </Link> */}
            </div>
          </div>
        )}
        {/* <ViewCustomerTeams  /> */}
      </div>
    </div>
  );
};

export default CustomerTeams;
