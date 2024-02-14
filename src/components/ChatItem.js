import React, { useRef, useState } from "react";

const ChatItem = (props) => {
  const position = useRef("left");
  if (props.sender === 1) {
    position.current = "right";
  }
  return (
    <>
      <div className={`chatItem ${position.current}`}>
        <div className="message">{props.message}</div>
        <div className="bottomBar">
          <div className="time">{props.time}</div>
          <div className="seenStatus">
            <i className="fa-solid fa-check-double"></i>
            <i className="fa-solid fa-check-double"></i>
            <i className="fa-solid fa-check"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatItem;
