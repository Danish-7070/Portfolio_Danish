import React from "react";
import dfa1 from "../assets/dfa1.jpg";

const ProfileSection = () => {
  return (
    <div className="bg-gray-900 bg pt-14 pb-16 px-8">
      {/* Profile Header */}
      <div className="max-w-6xl  mx-auto">
        <h1 className="text-white text-6xl font-bold mb-6">PROFILE</h1>
        <div className="relative">
          {/* Green underline */}
          <div className="absolute -top-2 left-0 w-32 h-1 bg-green-500"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-3">
            <p className="text-gray-300 text-lg">
              Dream Football provides consultancy and development services for
              sports facilities including import laying and installation of
              artificial turf (specifically sports).
            </p>

            <p className="text-gray-300 text-lg">
              Dream Football builds and operates state-of-the-art Football
              facilities in Islamabad, Rawalpindi, Peshawar, Sialkot under the
              name:
            </p>

            {/* Company Names */}
            <div className="space-y-6 mt-8">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-500"></div>
                <div className="flex items-center space-x-4">
                  <span className="text-orange-500 text-2xl font-bold">
                    DREAM FOOTBALL ARENA
                  </span>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">DFA</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-500"></div>
                <div className="flex items-center space-x-4">
                  <span className="text-orange-500 text-2xl font-bold">
                    TOTAL FOOTBALL
                  </span>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">TF</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-xl mt-8">Dream Enterprises</p>
          </div>

          {/* <div className="grid grid-cols-2 bg-yellow-500 gap-4  "> */}
          <div className="flex w-full col-span-2 lg:-mt-20 gap-4 p-0 items-center justify-center ">
            <div
              style={{
                backgroundImage: `url(${dfa1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="relative clip-hex  w-3/4   "
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the required CSS for hexagonal clip path
const style = document.createElement("style");
style.textContent = `
  .clip-hex {
    clip-path: polygon(50% 5%, 100% 25%, 100% 75%, 50% 95%, 0% 75%, 0% 25%);
    height: 100%; 
  }
  @media (max-width: 1024px) {
    .clip-hex {
      clip-path: none; /* Removing clipping path */
      height: 350px;
      width: 100%;
    }
  }
`;
document.head.appendChild(style);

export default ProfileSection;
