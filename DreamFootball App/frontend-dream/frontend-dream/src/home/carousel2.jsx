import React from "react";
import logo1 from "../assets/partnersLogos/1.png";
import logo2 from "../assets/partnersLogos/2.png";
import logo3 from "../assets/partnersLogos/3.jpeg";
import logo4 from "../assets/partnersLogos/4.png";
import logo5 from "../assets/partnersLogos/5.png";
import logo6 from "../assets/partnersLogos/6.png";
import logo7 from "../assets/partnersLogos/7.png";
import logo8 from "../assets/partnersLogos/8.png";
import logo9 from "../assets/partnersLogos/9.png";
import logo10 from "../assets/partnersLogos/10.png";

const PartnerGrid = () => {
  const logos = [
    { src: logo1, alt: "Logo 1" },
    { src: logo2, alt: "Logo 2" },
    { src: logo3, alt: "Logo 3" },
    { src: logo4, alt: "Logo 4" },
    { src: logo5, alt: "Logo 5" },
    { src: logo6, alt: "Logo 6" },
    { src: logo7, alt: "Logo 7" },
    { src: logo8, alt: "Logo 8" },
    { src: logo9, alt: "Logo 9" },
    { src: logo10, alt: "Logo 10" },
  ];

  return (
    <div className="w-full bg-transparent py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Our Partners
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-16 object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerGrid;