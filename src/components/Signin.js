import { useState, useRef, useContext } from "react";
import apiContext from "../Context/apiContext";

export default function Signin() {
  const { userSignin, userSignup } = useContext(apiContext);
  //backend variables
  const [signinData, setSigninData] = useState({
    phone: "9723361611",
    password: "abcdefg",
  });

  const [signupData, setSignupData] = useState({
    phone: "",
    username: "",
    password: "",
  });

  //frontend variables
  const [signin, setSignin] = useState(true);
  const [signinCover, setSigninCover] = useState(false);
  const [coverOpacity, setCoverOpacity] = useState(1);
  const [coverPosition, setCoverPosition] = useState(0);

  //functions - frontend
  const onClick = () => {
    if (coverPosition === 0) {
      setCoverPosition(50);
      setTimeout(() => {
        setSignin(false);
        setCoverOpacity(0);
      }, 750);
      setTimeout(() => {
        setSigninCover(true);
        setCoverOpacity(1);
      }, 1500);
    } else {
      setCoverPosition(0);
      setTimeout(() => {
        setSignin(true);
        setCoverOpacity(0);
      }, 750);
      setTimeout(() => {
        setSigninCover(false);
        setCoverOpacity(1);
      }, 1500);
    }
  };

  //functions - backend
  const ChangeSigninData = (e) => {
    setSigninData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const ChangeSignupData = (e) => {
    console.log(signupData);
    setSignupData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const SigninSubmit = (e) => {
    e.preventDefault();
    userSignin(signinData);
  };
  const SignupSubmit = (e) => {
    e.preventDefault();
    userSignup(signupData);
  };
  return (
    <>
      <div className="SigninBackground">
        <div className="internal">
          {!signinCover ? (
            <div
              className="hiddenFormCover"
              style={{ opacity: coverOpacity, right: 0 }}
            >
              sign up
            </div>
          ) : (
            <div
              className="hiddenFormCover"
              style={{ opacity: coverOpacity, left: 0 }}
            >
              sign in
            </div>
          )}
          {signin ? (
            <>
              <form className="signinForm">
                <div className="header">Sign in</div>
                <div className="socialLinks">
                  <div className="facebook">
                    <i className="fa-brands fa-facebook-f"></i>
                  </div>
                  <div className="google">
                    <i className="fa-brands fa-google"></i>
                  </div>
                  <div className="linkedIn">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </div>
                </div>
                <span className="optionTitle">or use your account</span>
                <input
                  type="number"
                  className="userName"
                  placeholder="Phone"
                  name="phone"
                  value={signinData.phone}
                  onChange={ChangeSigninData}
                  required
                />
                <input
                  type="password"
                  className="password"
                  placeholder="password"
                  name="password"
                  value={signinData.password}
                  onChange={ChangeSigninData}
                  required
                />
                <span className="optionTitle">Forgot your password? </span>
                <input
                  type="submit"
                  className="submitButton"
                  value="Sign in"
                  onClick={SigninSubmit}
                />
              </form>
              <div></div>
            </>
          ) : (
            <form className="signinForm signupForm">
              <div className="header">Sign up</div>
              <span className="optionTitle"></span>
              <input
                type="text"
                className="userName"
                placeholder="Username"
                name="username"
                value={signupData.username}
                onChange={ChangeSignupData}
                required
              />
              <input
                type="number"
                className="userName"
                placeholder="Phone"
                name="phone"
                value={signupData.phone}
                onChange={ChangeSignupData}
                required
              />
              <input
                type="password"
                className="password"
                placeholder="password"
                name="password"
                value={signupData.password}
                onChange={ChangeSignupData}
                required
              />
              <span className="optionTitle">Forgot your password? </span>
              <input
                type="submit"
                className="submitButton"
                value="Sign up"
                onClick={SignupSubmit}
              />
              <div className="optionTitle">Use Another Method</div>
              <div className="socialLinks">
                <div className="facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
                <div className="google">
                  <i className="fa-brands fa-google"></i>
                </div>
                <div className="linkedIn">
                  <i className="fa-brands fa-linkedin-in"></i>
                </div>
              </div>
            </form>
          )}
          <div className="formCover" style={{ right: `${coverPosition}%` }}>
            {signin ? (
              <div className="coverInternal">
                <div className="header">Sign up</div>
                <div className="textCover">
                  <div className="text">
                    Login now with your personal details to start a chat with
                    your contacts
                  </div>
                </div>
                <div className="textCover">
                  <div className="text">Don't have an Account?</div>
                </div>
                <button className="signupButton" onClick={onClick}>
                  Sign up
                </button>
              </div>
            ) : (
              <div className="coverInternal">
                <div className="header">Sign in</div>
                <div className="textCover">
                  <div className="text">
                    Sign up with your personal Information and start the
                    imersive chat experience now!
                  </div>
                </div>
                <div className="textCover">
                  <div className="text">Already have an Account?</div>
                </div>
                <button className="signupButton" onClick={onClick}>
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
