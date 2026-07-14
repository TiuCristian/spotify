import React from "react";
import "../Styles/LeftMenu.css";
import { FaSpotify, FaEllipsisH } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { Menu } from "./Menu";
import { MenuList } from "./MenuList";
import { MenuPlayList } from "./MenuPlayList";
import { TrackList } from "./TrackList";
// import * as Fa from 'react-icons/fa';

function LeftMenu() {
  return (
    <div className="leftMenu">
      <div className="logoContainer">
        <i>
          <img src="/stainify-logo.png" alt="Stainify Logo" style={{width: '28px', height: '28px', objectFit: 'contain'}} />
        </i>
        <h2>Stainify</h2>
        <i>
          <FaEllipsisH />
        </i>
      </div>
      <div className="searchBox">
        <input type="text" placeholder="Search..." />
        <i className="searchIcon">
          <BiSearchAlt />
        </i>
      </div>

      <Menu title={"Menu"} menuObject={MenuList} />
      <MenuPlayList />
      <TrackList />
    </div>
  );
}

// export { LeftMenu }
export { LeftMenu };
