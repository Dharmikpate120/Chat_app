import React, { useContext } from "react";
import PersonInstance from "./PersonInstance";
import apiContext from "../Context/apiContext";

const Chats = () => {
  const context= useContext(apiContext);
  const contacts = [
    {
      name: "dharmik patel",
      phoneNumber: 12121212,
      profile: "hello world",
      lastOnline: "3:23",
    },
    {
      name: " patel",
      phoneNumber: 12121212,
      profile: "hello world",
      lastOnline: "10:00",
    },
    {
      name: "dhvani patel",
      phoneNumber: 12121212,
      profile: "hello world",
      lastOnline: "13:11",
    },
    {
      name: "vraj patel",
      phoneNumber: 12121212,
      profile: "hello world",
      lastOnline: "7:77",
    },
  ];
  console.log(context.hello);
  return (
    <div className="chatsMain Internal">
      <div className="title">Chats</div>
      <div className="chats">
        {contacts.map((person) => {
          return (
            <PersonInstance
              name={person.name}
              profileImage={person.profile}
              phoneNumber={person.phoneNumber}
              lastOnline={person.lastOnline}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Chats;
