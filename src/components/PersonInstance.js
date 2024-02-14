import React from "react";

const PersonInstance = ({ name, profileImage, phoneNumber, lastOnline }) => {
  return (
    <div className="chatProfileMain">
      <div className="chatProfileImage">
        <img src={`${profileImage}`} alt="" />
      </div>
      <div className="text">
        <div className="chatProfileName">{name}</div>
        <div className="lastMessage"> {phoneNumber} </div>
        <div className="activeTime">{lastOnline}</div>
      </div>
    </div>
  );
};

export default PersonInstance;
