import React from "react";
// import "./Hero.css"; // Optional if you want to add custom styles
import { Link } from "react-router-dom";
export const Hero = () => {
  return (
    <div
      className="hero bg-cover bg-center h-[570px] flex items-center justify-center mt-16"
      style={{
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq4gIcO3CoQRTvV6-2foWDp0-SkfGI_KcicklLCYdQw7eyKhYTNVu8WLQNFQ&s')`,
      }}
    >
      <div className="text-center text-white p-4 bg-black bg-opacity-50 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          Admin Dashboard - Software License Management
        </h1>
        <p className="text-lg mb-6">
          Ensure your organization stays compliant by keeping track of all your
          software licenses and their expiration dates. This admin panel
          provides you with a comprehensive overview, enabling you to: Monitor
          Expiration Dates: View all your licenses in one place with color-coded
          expiration alerts. Update License Information: Easily update details
          as your software portfolio grows or changes. Generate Reports: Get
          insights and generate reports on license status to help make informed
          decisions. Stay ahead of the curve and manage your software licenses
          efficiently!
        </p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Hero;
