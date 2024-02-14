import React, { useContext, useEffect, useRef, useState } from "react";
import apiContext from "../Context/apiContext";

const ChatInternal = () => {
  const [refresher, setRefresher] = useState(false);
  const { messages, setMessages, sendMessage, chatVisible, socket } =
    useContext(apiContext);
  const scroller = useRef();

  socket.on("receive", (data) => {
    console.log(data);
    setMessages((e) => {
      if (e[e.length - 1].time === data.time) {
        return e;
      }
      e.push(data);
      return e;
    });
    setRefresher((e) => !e);
  });

  const onclick = () => {
    sendMessage("hello! how are you?");
    setRefresher((e) => !e);
  };
  useEffect(() => {
    scroller.current.scrollTo(0, scroller.current.scrollHeight);
  }, [refresher]);
  return (
    <div
      className="internalChat Internal"
      style={{ display: chatVisible ? "inline" : "none" }}
    >
      {/* <div className="title">Chat Internal</div> */}
      <div className="receiverInformation">
        <div className="profileInformation">
          <img
            className="profileImage"
            src="https://th.bing.com/th?id=OIP.jG20xZ4rIJfvN9q5oN2OBwHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
            alt=""
          />
          <div className="profileName">Dharmik Patel</div>
        </div>
        <div className="profileOptions">
          <i className="fa-solid fa-phone"></i>
          <i className="fa-solid fa-video"></i>

          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
      </div>
      <div className="chatContainer" ref={scroller}>
        {messages.map((item, index) => {
          return (
            <div className={`chatItem`} key={index}>
              class:left OR right
              <div className="message">{item.message}</div>
              {/* <div className="bottomBar">
          <div className="time">{props.time}</div>
          <div className="seenStatus">
            <i className="fa-solid fa-check-double"></i>
            <i className="fa-solid fa-check-double"></i>
            <i className="fa-solid fa-check"></i>
          </div>
        </div> */}
            </div>
          );
        })}
      </div>
      <div className="chatInputBoxMain">
        <i className="fa-regular fa-face-smile"></i>
        <input type="text" className="textbox" placeholder="Text Message..." />
        <button className="sendButton" onClick={onclick}>
          send
        </button>
      </div>
    </div>
  );
};

export default ChatInternal;
