import { useRef, useState } from "react";
import apiContext from "./apiContext";

const Messanger = (props) => {
  //data variables
  const [auth_token, setAuth_token] = useState("");
  const homeRef = useRef(null);

  //functions
  const fetchAuthToken = () => {
    document.cookie.split(";").forEach((element) => {
      element = element.split("=");
      if (element[0].trim() === "auth_token") {
        setAuth_token(element[1]);
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
        setAuth_token(response.auth_token);
        document.cookie = `auth_token=${response.auth_token}`;
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
        setAuth_token(response.auth_token);
        document.cookie = `auth_token=${response.auth_token}`;
        homeRef.current.click();
      } else {
        console.log(response?.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async () => {
    if (auth_token !== "") {
      console.log(typeof auth_token);
      var data = await fetch("http://localhost:5000/fetchUserdata", {
        method: "POST",
        headers: {
          auth_token: auth_token,
        },
      });
      data = await data.json();
      console.log(data);
      return data;
    } else {
      console.log("please sign in!");
    }
  };
  // fetchUserData();

  const addUserData = async (UserFormData) => {
    if (auth_token !== "") {
      var data = await fetch("http://localhost:5000/addUserdata", {
        method: "POST",
        headers: { auth_token: auth_token },
        body: UserFormData,
      });
    }
  };

  return (
    <apiContext.Provider
      value={{ homeRef, auth_token, fetchAuthToken, userSignin, userSignup }}
    >
      {props.children}
    </apiContext.Provider>
  );
};

export default Messanger;
