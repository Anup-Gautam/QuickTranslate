import { useState } from "react";
import Header from "./components/Header";
import Translator from "./components/Translator";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div>
        <Translator />
        <button>New Category</button>
      </div>
    </>
  );
}

export default App;
