import React, { useContext, useEffect, useState } from "react";
import Chats from "./Chats";
import ChatInternal from "./ChatInternal";
import SenderProfile from "./SenderProfile";
import apiContext from "../Context/apiContext";
import ContactAdder from "./ContactAdder";

const Home = () => {
  const { auth_token, fetchContacts } = useContext(apiContext);
  const [chatData, setChatData] = useState();
  const [addContact, setAddContact] = useState(false);

  const [newContact, setNewContact] = useState({ name: "", phonenumber: "" });

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
  }, [fetchContacts, chatData]);
  return (
    <>
      <div className="homeMain">
        {addContact && (
          <ContactAdder
            newContact={newContact}
            setNewContact={setNewContact}
            setChatData={setChatData}
            setAddContact={setAddContact}
          />
        )}
        <Chats data={chatData} setAddContact={setAddContact} />
        <div className="contentWrapper">
          <ChatInternal />
          <SenderProfile />
        </div>
      </div>
    </>
  );
};

export default Home;
