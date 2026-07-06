import React from 'react';
import './TopBar.css';


import { FiHome, FiSearch, FiBell, FiUsers, FiUser, FiUpload } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';

export const TopBar = ({ onOpenUpload }) => {
  return (
    <div className="topbar">
       <div className="topbar-navigation">
          {/* Back/Forward buttons could go here */}
       </div>
       <div className="topbar-search-container">
          <button className="topbar-home-btn"><FiHome /></button>
          <div className="topbar-search">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="What do you want to play?" />
          </div>
       </div>
       <div className="topbar-profile">
          <button className="icon-btn" onClick={onOpenUpload} title="Upload Custom Song"><FiUpload /></button>
          <button className="icon-btn"><FiBell /></button>
          <button className="icon-btn"><FiUsers /></button>
          <button className="icon-btn profile-btn"><FiUser /></button>
       </div>
    </div>
  );
};
