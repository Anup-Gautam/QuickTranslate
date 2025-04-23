import { useState } from "react";
import Header from "./components/Header";
import Translator from "./components/Translator";
import "./App.css";
import Table from "./components/Table";

function App() {
  return (
    <>
      <Header />
      <div>
        <Translator />
        <button>New Category</button>
      </div>
      <Table />
    </>
  );
}

export default App;
