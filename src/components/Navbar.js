import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import apiContext from "../Context/apiContext";

const Navbar = () => {
  const {
    auth_token,
    homeRef,
    fetchAuthToken,
    setProfileOpener,
    profileOpener,
    profileData,
    setProfileData,
    fetchProfileData,
    updateUserData,
  } = useContext(apiContext);

  const nameRef = useRef();
  const fileSelector = useRef();
  const emailRef = useRef();
  const [changable, setChangable] = useState(true);
  const [profileImage, setProfileImage] = useState();
  const [oldProfileImg, setOldProfileImg] = useState(true);
  const [newImgUrl, setNewImgUrl] = useState();
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

  const editFunction = () => {
    setChangable(true);
  };

  const onInputChange = (e) => {
    if (changable) {
      setProfileData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
  };
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
              <div
                className="profileImage"
                onClick={() => {
                  fileSelector.current.click();
                }}
              >
                <div className="editHighlighter">
                  <i className="fa-solid fa-pen"></i>
                </div>
                {oldProfileImg && (
                  <img
                    src={`http://localhost:5000/profileImage/${profileData?.profileimage}`}
                    alt=""
                  />
                )}
                {!oldProfileImg && <img src={newImgUrl} />}
                <input
                  type="file"
                  style={{ display: "none" }}
                  name="profileImage"
                  ref={fileSelector}
                  onChange={(e) => {
                    setProfileImage(e.target.files[0]);
                    const url = URL.createObjectURL(e.target.files[0]);
                    setNewImgUrl(url);
                    setOldProfileImg(false);
                  }}
                />
              </div>
              <div className="inputCover">
                <input
                  className="profileName"
                  name="name"
                  value={profileData?.name}
                  ref={nameRef}
                  onChange={onInputChange}
                  readOnly={!changable}
                />
                <i
                  className="fa-solid fa-pen"
                  onClick={() => {
                    nameRef.current.focus();
                    editFunction();
                  }}
                ></i>
              </div>
              <div className="inputCover">
                <input
                  className="profilePhone"
                  value={profileData?.phonenumber}
                  readOnly
                />
              </div>
              <div className="inputCover">
                <input
                  className="profileEmail"
                  name="emailaddress"
                  value={profileData?.emailaddress}
                  ref={emailRef}
                  onChange={onInputChange}
                  readOnly={!changable}
                />
                <i
                  className="fa-solid fa-pen"
                  onClick={() => {
                    emailRef.current.focus();
                    editFunction();
                  }}
                ></i>
              </div>
              {changable && (
                <button
                  className="saveChangesBtn"
                  onClick={async () => {
                    const Data = new FormData();

                    Data.append("name", profileData.name);
                    Data.append("email", profileData.emailaddress);
                    Data.append("profileImage", profileImage);
                    await updateUserData(Data);
                    setChangable(false);
                  }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
