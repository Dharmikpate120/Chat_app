import io from "socket.io-client";
import { useRef, useState } from "react";
import apiContext from "./apiContext";

const socket = io("http://localhost:5000/");

const Messanger = (props) => {
  const auth_token = useRef("");
  const homeRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [profileOpener, setProfileOpener] = useState(false);
  const [profileData, setProfileData] = useState();
  const chatPhone = useRef("");

  // socket functions

  const sendMessage = (msg) => {
    var data = { message: msg, time: Date.now(), sender: true, class: "right" };
    setMessages((e) => {
      e.push(data);
      return e;
    });

    socket.emit("message", JSON.stringify({ message: msg }));
  };

  const chatOpen = (receiver) => {
    socket.emit(
      "chatOpen",
      JSON.stringify({ receiver: receiver, sender: auth_token.current })
    );
  };
  // chatOpen({ sender: "9723361611", receiver: "9723361612" });
  const chatClose = () => {
    socket.emit("chatClose");
  };

  //data variables
  //functions
  const fetchAuthToken = () => {
    document.cookie.split(";").forEach((element) => {
      element = element.split("=");
      if (element[0].trim() === "auth_token") {
        auth_token.current = element[1];
      }
    });
  };

  //api functions
  const userSignin = async (data) => {
    try {
      var response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      response = await response.json();
      if (!response.error) {
        auth_token.current = response.auth_token;
        document.cookie = `auth_token=${response.auth_token};max-age=${
          60 * 60 * 24 * 10
        }`;
        homeRef.current.click();
      } else {
        console.log(response.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // userSignin({
  //   phone: "9723361611",
  //   password: "abcdefg",
  // });

  const userSignup = async (data) => {
    try {
      var response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      response = await response.json();
      console.log(response);
      if (!response.error) {
        auth_token.current = response.auth_token;
        document.cookie = `auth_token=${response.auth_token};max-age=${
          60 * 60 * 24 * 10
        }`;
        homeRef.current.click();
      } else {
        console.log(response?.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async () => {
    if (auth_token.current !== "") {
      var data = await fetch("http://localhost:5000/fetchUserdata", {
        method: "POST",
        headers: {
          auth_token: auth_token.current,
        },
      });
      data = await data.json();
      console.log(data);
      return data;
    } else {
      console.log("please sign in!");
    }
  };

  const addUserData = async (UserFormData) => {
    if (auth_token.current !== "") {
      var data = await fetch("http://localhost:5000/addUserdata", {
        method: "POST",
        headers: { auth_token: auth_token.current },
        body: UserFormData,
      });
      console.log(await data.json());
    }
  };

  const fetchContacts = async () => {
    if (auth_token.current !== "") {
      var data = await fetch("http://localhost:5000/fetchContacts", {
        method: "POST",
        headers: { auth_token: auth_token.current },
      });
      data = await data.json();
      return data;
    }
  };

  const addContact = async (newContact) => {
    if (auth_token.current !== "") {
      var data = await fetch("http://localhost:5000/addContact", {
        method: "POST",
        headers: {
          auth_token: auth_token.current,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });
      data = await data.json();
      return data;
    }
  };

  const fetchChats = async (contactPhone) => {
    if (auth_token.current !== "") {
      var data = await fetch("http://localhost:5000/fetchChats", {
        method: "POST",
        headers: {
          auth_token: auth_token.current,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactPhone }),
      });
    }
    try {
      data = await data.json();
      setChatVisible(true);
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfileData = async () => {
    if (auth_token.current !== "") {
      var data = await fetch("http://localhost:5000/fetchUserdata", {
        method: "POST",
        headers: {
          auth_token: auth_token.current,
          "Content-Type": "application/json",
        },
      });
      data = await data.json();
      console.log(data);
      setProfileData(data);
    }
  };

  const updateUserData = async (formData) => {
    var data = fetch("http://localhost:5000/addUserdata", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
      },
      body: formData,
    });

    console.log(data);
  };

  return (
    <apiContext.Provider
      value={{
        sendMessage,
        chatOpen,
        chatClose,
        homeRef,
        auth_token,
        fetchAuthToken,
        userSignin,
        userSignup,
        fetchContacts,
        addContact,
        messages,
        setMessages,
        chatVisible,
        fetchChats,
        socket,
        chatPhone,
        profileOpener,
        setProfileOpener,
        setProfileData,
        profileData,
        fetchProfileData,
        updateUserData,
      }}
    >
      {props.children}
    </apiContext.Provider>
  );
};

export default Messanger;
