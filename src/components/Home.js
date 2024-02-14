import React, { useContext, useEffect, useState } from "react";
import Chats from "./Chats";
import ChatInternal from "./ChatInternal";
import SenderProfile from "./SenderProfile";
import apiContext from "../Context/apiContext";

const Home = () => {
  const { auth_token, fetchContacts } = useContext(apiContext);
  const [chatData, setChatData] = useState();
  useEffect(() => {
    if (auth_token.current === "") {
      window.location.pathname = "/signin";
    }
  }, [auth_token]);

  useEffect(() => {
    async function dataFetcher() {
      setChatData(await fetchContacts());
    }
    dataFetcher();
  }, [fetchContacts]);
  return (
    <>
      <div className="homeMain">
        <Chats data={chatData} />
        <div className="contentWrapper">
          <ChatInternal />
          <SenderProfile />
        </div>
      </div>
    </>
  );
};

export default Home;
