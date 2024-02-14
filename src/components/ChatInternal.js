import React, { useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";

const ChatInternal = () => {
  const scroller = useRef();
  console.log(scroller);
  const [Chats, setChats] = useState([
    {
      message:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, deleniti accusantium sint eaque enim, exercitationem corporis eos distinctio reiciendis nesciunt, nemo ipsam saepe?",
      sender: 1,
      time: "11:33",
      seen: 2,
    },
    {
      message:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, deleniti accusantium sint eaque enim, exercitationem corpor  is eos distinctio reiciendis nesciunt, nemo ipsam saepe?",
      sender: 3,
      time: "11:33",
      seen: 2,
    },
    {
      message:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, deleniti accusantium sint eaque enim, exercitationem corporis eos distinctio reiciendis nesciunt, nemo ipsam saepe?",
      sender: 1,
      time: "11:33",
      seen: 2,
    },
    {
      message:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, deleniti accusantium sint eaque enim, exercitationem corporis eos distinctio reiciendis nesciunt, nemo ipsam saepe?",
      sender: 0,
      time: "11:33",
      seen: 2,
    },
  ]);
  const onclick = () => {
    setChats([
      ...Chats,
      { message: "dharmik patel", sender: 1, time: "11:33", seen: 1 },
    ]);
  };
  useEffect(() => {
    console.log(scroller.current.scrollHeight);
    scroller.current.scrollTo(0, scroller.current.scrollHeight);
  }, [Chats]);
  return (
    <div className="internalChat Internal">
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
        {Chats.map((item, index) => {
          return (
            <ChatItem
              key={index}
              sender={item.sender}
              message={item.message}
              time={item.time}
              seen={item.seen}
            />
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
