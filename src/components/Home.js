import React, { useContext, useEffect } from "react";
import Chats from "./Chats";
import ChatInternal from "./ChatInternal";
import SenderProfile from "./SenderProfile";
import apiContext from "../Context/apiContext";

const Home = () => {
  const { auth_token } = useContext(apiContext);
  useEffect(() => {
    if (auth_token === "") {
      window.location.pathname = "/signin";
    }
  }, []);
  console.log(auth_token.current);
  return (
    auth_token !== "" && (
      <>
        <div className="homeMain">
          <Chats />
          <div className="contentWrapper">
            <ChatInternal />
            <SenderProfile />
          </div>
        </div>
      </>
    )
  );
};

export default Home;
