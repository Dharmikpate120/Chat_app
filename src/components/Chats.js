import React, { useContext } from "react";
import apiContext from "../Context/apiContext";

const Chats = ({ data }) => {
  const { fetchChats, chatOpen } = useContext(apiContext);
  const onClick = (phone) => {
    chatOpen(phone);
    fetchChats(phone);
  };
  return (
    <div className="chatsMain Internal">
      <div className="title">Chats</div>
      <div className="chats">
        {data?.contacts.map((person, index) => {
          return (
            <div
              className="chatProfileMain"
              key={index}
              onClick={() => {
                onClick(person.phone);
              }}
            >
              <div className="chatProfileImage">
                <img src={`${person.profileimage}`} alt="" />
              </div>
              <div className="text">
                <div className="chatProfileName">{person.name}</div>
                <div className="lastMessage"> {person.phone} </div>
                {/* <div className="activeTime">{lastOnline}</div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chats;
