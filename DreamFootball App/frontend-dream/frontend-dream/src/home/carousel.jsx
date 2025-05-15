import React from "react";
import logo1 from "../assets/homeLogos/1.png";
import logo2 from "../assets/homeLogos/2.png";
import logo3 from "../assets/homeLogos/3.png";
import logo4 from "../assets/homeLogos/4.png";
import logo5 from "../assets/homeLogos/5.png";
import logo6 from "../assets/homeLogos/6.png";
import logo7 from "../assets/homeLogos/7.png";
import logo8 from "../assets/homeLogos/8.png";
import logo9 from "../assets/homeLogos/9.png";

const LogoCarousel = () => {
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
    { src: logo1, alt: "Logo 1" },
    { src: logo2, alt: "Logo 2" },
    { src: logo3, alt: "Logo 3" },
    { src: logo4, alt: "Logo 4" },
    { src: logo5, alt: "Logo 5" },
    { src: logo6, alt: "Logo 6" },
    { src: logo7, alt: "Logo 7" },
    { src: logo8, alt: "Logo 8" },
    { src: logo9, alt: "Logo 9" },
    { src: logo1, alt: "Logo 1" },
    { src: logo2, alt: "Logo 2" },
    { src: logo3, alt: "Logo 3" },
    { src: logo4, alt: "Logo 4" },
    { src: logo5, alt: "Logo 5" },
    { src: logo6, alt: "Logo 6" },
    { src: logo7, alt: "Logo 7" },
    { src: logo8, alt: "Logo 8" },
    { src: logo9, alt: "Logo 9" },
    { src: logo1, alt: "Logo 1" },
    { src: logo2, alt: "Logo 2" },
    { src: logo3, alt: "Logo 3" },
    { src: logo4, alt: "Logo 4" },
    { src: logo5, alt: "Logo 5" },
    { src: logo6, alt: "Logo 6" },
    { src: logo7, alt: "Logo 7" },
    { src: logo8, alt: "Logo 8" },
    { src: logo9, alt: "Logo 9" },
    { src: logo1, alt: "Logo 1" },
    { src: logo2, alt: "Logo 2" },
    { src: logo3, alt: "Logo 3" },
    { src: logo4, alt: "Logo 4" },
    { src: logo5, alt: "Logo 5" },
    { src: logo6, alt: "Logo 6" },
    { src: logo7, alt: "Logo 7" },
    { src: logo8, alt: "Logo 8" },
    { src: logo9, alt: "Logo 9" },
  ];

  // Calculate the total width for one complete set of logos
  const logoWidth = 48; // w-48 = 12rem = 192px
  const logoMargin = 8; // mx-4 = 1rem = 16px (on both sides)
  const totalWidth = logos.length * (logoWidth + logoMargin * 2);

  return (
    <div className="w-full bg-transparent py-8 overflow-hidden">
      <div className="mx-auto px-4 max-sm:px-0">
        <div className="ticker-wrap relative overflow-hidden">
          {/* First logo set */}
          <div 
            className="ticker flex"
            style={{
              animation: `ticker ${logos.length * 2}s linear infinite`,
            }}
          >
            {/* Duplicate logos multiple times to ensure seamless loop */}
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 mx-4 max-sm:mx-2 flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add the keyframe animation to your component */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalWidth}px);
          }
        }
        
        .ticker-wrap {
          width: 100%;
        }
        
        .ticker {
          display: flex;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel;