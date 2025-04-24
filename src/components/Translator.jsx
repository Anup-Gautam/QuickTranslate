import React from "react";
import Button from "@mui/material/Button";

function Translator() {
  return (
    <div className="translator">
      <div className="translator-header">Real Time Translator</div>
      <div className="translator-body">
        <input type="textbox"></input>
        <Button>Reset</Button>
        <Button variant="contained">Translate</Button>
      </div>
    </div>
  );
}

export default Translator;
