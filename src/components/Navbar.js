import React, { useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import apiContext from "../Context/apiContext";

const Navbar = () => {
  const {
    auth_token,
    homeRef,
    fetchAuthToken,
    setProfileOpener,
    profileOpener,
    profileData,
    fetchProfileData,
  } = useContext(apiContext);

  useEffect(() => {
    const navigation = document.querySelector(".mobileSandwich");
    var links = document.querySelector(".navigationLinks");

    navigation.addEventListener("click", () => {
      links.style.display = "flex";
    });
    document.querySelector(".closeBtn").addEventListener("click", () => {
      links.style.display = "none";
    });
    fetchAuthToken();
  }, []);
  useEffect(() => {
    fetchProfileData();
  }, [auth_token]);
  return (
    <div className="navbar">
      <NavLink to="/" ref={homeRef} className="navbarLogo">
        Logo
      </NavLink>
      <div className="mobileSandwich">
        <div></div>
      </div>
      <div className="navigationLinks">
        <i className="fa-solid fa-xmark closeBtn"></i>
        <ul>
          <li>
            {
              <div
                className="profileButton"
                onClick={() => {
                  if (auth_token.current === "") {
                    console.log("please Signin First");
                    return;
                  }
                  setProfileOpener(true);
                }}
              >
                {profileData?.name}
              </div>
            }
          </li>
        </ul>
        {profileOpener && (
          <div className="profileMenuMain">
            <div
              className="closeButton"
              onClick={() => {
                setProfileOpener(false);
              }}
            >
              &times;
            </div>
            <div className="profileMenu">
              <div className="profileImage">
                <img
                  src={`http://localhost:5000/profileImage/${profileData?.profileimage}`}
                  alt=""
                />
              </div>
              <div className="inputCover">
                <input className="profileName" value={profileData?.name} />
                <i className="fa-solid fa-pen"></i>
              </div>
              <div className="inputCover">
                <input
                  className="profilePhone"
                  value={profileData?.phonenumber}
                />
                <i className="fa-solid fa-pen"></i>
              </div>
              <div className="inputCover">
                <input className="profileEmail" value={profileData?.emailaddress} />
                <i className="fa-solid fa-pen"></i>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
