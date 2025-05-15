import React from "react";
import { ArrowRight } from "lucide-react";
import { Activity } from "lucide-react";
import { BarChart } from "lucide-react";
import { BiFootball } from "react-icons/bi";
import { MapPin } from "lucide-react";
import { Trophy } from "lucide-react";
import { Users } from "lucide-react";
import pdf from "../assets/1.pdf";
import Navbar from "../components/navbar/navbar";
import LogoCarousel from "../home/carousel";
import PartnerGrid from "../home/carousel2";

const DreamInvestment = () => {
  const handleLearnMore = () => {
    // Open PDF in a new tab
    window.open(pdf, "_blank");
  };
  const stats = [
    {
      label: "Total Population",
      value: "241.49M",
      subtext: "Pakistan's Population",
    },
    { label: "Youth Population", value: "58.7M", subtext: "Ages 15-29 years" },
    { label: "Sports Following", value: "40M", subtext: "Active Followers" },
    {
      label: "Total Players",
      value: "100K+",
      subtext: "Active Football Players",
    },
  ];

  const facilities = [
    { location: "Rawalpindi", count: "4 Grounds" },
    { location: "Peshawar", count: "4 Grounds" },
    { location: "Lahore", count: "1 Ground" },
    { location: "Sialkot", count: "1 Ground" },
  ];

  const metrics = [
    { label: "Total Players", value: "5,280", icon: Users },
    { label: "Total Fields", value: "11", icon: BiFootball },
    { label: "Total Management", value: "25+", icon: Users },
    { label: "Total Leagues", value: "11+", icon: Trophy },
    { label: "Digital Media Reach", value: "100K/Monthly", icon: Activity },
    { label: "Live Broadcast", value: "150K/Monthly", icon: BarChart },
  ];

  return (
    <div className=" bg-gray-800">
      <Navbar />
      {/* Hero Section */}
      <div className=" bg-gradient-to-r from-custom to-secondary text-white py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Invest with Dream
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8">
            Pakistan's leading sports facility management and development
            company, specializing in football infrastructure since 2014.
          </p>
          <button
            className="bg-white text-primary px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors"
            onClick={handleLearnMore}
          >
            Learn More <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl font-bold text-secondary mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">{stat.subtext}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Our Facilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <MapPin className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">
                {facility.location}
              </h3>
              <p className="text-gray-600 mt-2">{facility.count}</p>
            </div>
          ))}
        </div>
        <LogoCarousel />
      </div>

      {/* Metrics Section */}
      <div className="bg-custom py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Current Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm"
              >
                <metric.icon className="w-12 h-12 text-secondary" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-gray-600">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-custom py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Our Partners
          </h2> */}
          <PartnerGrid />
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
        <p className="text-xl text-gray-200 mb-8">
          Ready to be part of Pakistan's growing sports infrastructure?
        </p>
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Contact Details:</span> 03455009201
            (Total) & 03331114010 (Dream Enterprises)
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span>{" "}
            info@dream-enterprises.com
          </p>
          <p className="text-lg">
            <span className="font-semibold">CEO:</span> Arslan Mushtaq
          </p>
        </div>
      </div>
    </div>
  );
};

export default DreamInvestment;
