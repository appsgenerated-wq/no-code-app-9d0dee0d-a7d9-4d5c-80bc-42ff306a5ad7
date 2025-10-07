import React from 'react';
import config from '../constants.js';
import { RocketLaunchIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')"}}></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="text-center">
          <RocketLaunchIcon className="mx-auto h-16 w-16 text-cyan-400" />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            LunarEats
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
            Cosmic Cravings, Delivered at Lightspeed. The #1 Food Delivery Service on the Moon.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <button
              onClick={() => onLogin('customer@lunareats.io', 'password')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              Login as Demo Customer
            </button>
            <a
              href={`${config.BACKEND_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
            >
              Admin Panel
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">Admin: admin@manifest.build / admin</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
