import React from 'react';
import { FaLock } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white text-center py-3 px-4 w-full mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        {/* Logo with Icon */}
        <div className="flex items-center gap-1 text-xl font-bold">
          <FaLock className="text-green-500" />
          <span className="text-green-600">&lt;</span>Pass
          <span className="text-green-600">OP /&gt;</span>
        </div>

      
        <p className="text-sm text-green-400 font-medium">
          Created by Ansh Pal
        </p>
      </div>
    </footer>
  );
};

export default Footer;
