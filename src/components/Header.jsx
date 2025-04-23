import React from "react";

function Header() {
  return (
    <div>
      <div>
        <h1>QuickChat</h1>
      </div>
      <div>
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
