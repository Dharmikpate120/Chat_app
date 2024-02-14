// import {  } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

import Messanger from "./Context/Messanger";
import Signin from "./components/Signin";
function App() {

  return (
    <>
      <Messanger>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </BrowserRouter>
      </Messanger>
    </>
  );
}

export default App;
