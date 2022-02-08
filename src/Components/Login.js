import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
import GoogleLogin from "react-google-login";
import logo from "./logo1.png";
const Login = () => {
  const recaptchaRef = useRef(null);
  let token;
  let navigate = useNavigate();

  const [final, setFinal] = useState({
    email: "",
    password: "",
    reCaptchaToken: "",
  });
  const [final1, setFinal1] = useState({
    idToken: "",
    reCaptchaToken: "",
  });

  const handleSubmit = async () => {
    token = await recaptchaRef.current.executeAsync();
    final.reCaptchaToken = token;
    console.log(final);
    axios
      .post(`http://admin.liveexamcenter.in/api/auth/login`, final)
      .then((res) => {
        navigate(`./api`, { state: res.data.token });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loginwithgoogle = async (data) => {
    token = await recaptchaRef.current.executeAsync();
    final1.reCaptchaToken = token;
    final1.idToken = data.tokenId;
    console.log(data, data.tokenId);
    axios
      .post(`http://admin.liveexamcenter.in/api/auth/google`, final1)
      .then((res) => {
        navigate(`./api`, { state: res.data.token });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <link rel="stylesheet" href="./style.css"></link>
      <ReCAPTCHA
        sitekey="6Ld3COIZAAAAAC3A_RbO1waRz6QhrhdObYOk7b_5"
        ref={recaptchaRef}
        size="invisible"
      />
      <div className="parent clearfix">
        <div className="bg-illustration">
          <img src={logo} alt="logo" />

          <div className="burger-btn">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="login">
          <div className="container">
            <h1>
              Login to
              <br />
              your account
            </h1>
            <div className="login-form">
              <input
                type="email"
                placeholder="E-mail Address"
                onChange={(e) => (final.email = e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => (final.password = e.target.value)}
              />
              <div className="forget-pass">
                <a href="#">Forgot Password ?</a>
              </div>
              <button type="submit" onClick={handleSubmit}>
                Login
              </button>
              <div>
                <GoogleLogin
                  clientId={
                    "971623344603-0qquan9pcdb9iu7oq9genvpnel77i7oa.apps.googleusercontent.com"
                  }
                  onSuccess={loginwithgoogle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
