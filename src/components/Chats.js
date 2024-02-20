import React, { useContext } from "react";
import apiContext from "../Context/apiContext";

const Chats = ({ data, setAddContact }) => {
  const { fetchChats, chatOpen, chatPhone, scroller } = useContext(apiContext);
  const onClick = async (phone) => {
    chatPhone.current = data.phone;
    await chatOpen(phone);
    await fetchChats(phone);
  };
  return (
    <div className="chatsMain Internal">
      <div
        className="addContactCover"
        onClick={() => {
          setAddContact(true);
        }}
      >
        <div className="addContact">
          <i className="fa-solid fa-plus" style={{ padding: "0 10px 0 0" }} />
          Add Contact
        </div>
      </div>
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
