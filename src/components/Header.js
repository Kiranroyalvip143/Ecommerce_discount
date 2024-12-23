import React from "react";
import logo from "../monk.png";
import "./Header.css";

const Header = () => {
  return (
    <div class="header">
      <img src={logo} alt="Header Icon" class="header-image" />
      <span class="header-text">Monk Upsell & Cross-sell</span>
    </div>
  );
};

export default Header;
