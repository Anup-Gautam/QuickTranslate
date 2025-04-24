import { useState } from "react";
import Header from "./components/Header";
import Translator from "./components/Translator";
import "./App.css";
import Table from "./components/Table";
import Button from "@mui/material/Button";

function App() {
  return (
    <>
      <Header />
      <div className="app-header">
        <Translator />
        <div className="header-button">
          <Button variant="contained"> + New Category</Button>
        </div>
      </div>
      <Table />
    </>
  );
}

export default App;
