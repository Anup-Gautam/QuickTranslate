import React from "react";
import Button from "@mui/material/Button";

function SpeechBox() {
  return (
    <div>
      <div>
        From Language
        <Button>Copy</Button>
        <Button>Speak</Button>
      </div>
      <div>To Language</div>
    </div>
  );
}

export default SpeechBox;
