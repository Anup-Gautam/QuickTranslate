import React from "react";
import SpeechBox from "./SpeechBox";
import Button from "@mui/material/Button";
function Table() {
  return (
    <div className="table">
      <div className="table-header">
        <div className="header-caption">Header Caption</div>
        <div className="header-button">
          <Button variant="contained">+ Add</Button>
        </div>
      </div>
      <div className="table-body">
        <SpeechBox />
      </div>
    </div>
  );
}

export default Table;
