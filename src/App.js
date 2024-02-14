// import {  } from "react";
// import io from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

import Messanger from "./Context/Messanger";
import Signin from "./components/Signin";
function App() {
  // const socket = io("http://localhost:5000");
  // const hello = () => {
  //   socket.emit("hello", 1236654321);
  // };

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
