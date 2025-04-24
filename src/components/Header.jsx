import React from "react";

function Header() {
  return (
    <div className="header">
      <div className="logo">
        <h1>QuickChat</h1>
      </div>
      <div className="language-selector">
        Languages
        <select>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
        arrow img
        <select>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
}

export default Header;
