import React, { useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import apiContext from "../Context/apiContext";

const Navbar = () => {
  const { homeRef, fetchAuthToken } = useContext(apiContext);

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
  return (
    <div className="navbar">
      <NavLink to="/" ref={homeRef} className="navbarLogo">
        Logo
      </NavLink>
      {/* <div className="searchbar">
        <input
          className="searchText"
          type="text"
          placeholder="search..."
          name="serachBox"
        />
        <div className="serachIcon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div> */}
      <div className="mobileSandwich">
        <div></div>
      </div>
      <div className="navigationLinks">
        <i className="fa-solid fa-xmark closeBtn"></i>
        <ul>
          <li>
            <NavLink to="/"> Profile </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
