import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      setErrorMessage("Name cannot be empty");
      setIsValid(false);
      return;
    }
    if (email.trim() === "") {
      setErrorMessage("Email cannot be empty");
      setIsValid(false);
      return;
    }
    if (password.trim() === "") {
      setErrorMessage("password cannot be empty");
      setIsValid(false);
      return;
    }
    if (address.trim() === "") {
      setErrorMessage("address cannot be empty");
      setIsValid(false);
      return;
    }
    const user = { name, email, password, address };
    fetch("https://backend-kappa-seven-10.vercel.app/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          localStorage.setItem("currentUser", JSON.stringify(data));
          setUser(data);
          setIsValid(true);
          navigate('/');
        } else {
          setIsValid(false);
          setErrorMessage("this email already taken")
        }
      })
      .catch((error) => {
        setErrorMessage("failed to signup")
        setIsValid(false);
      });
  };

  return (
    <div className="ground">
      <div className="login-container">
        <h2>Sign up</h2>
        <form>
          <div className="login-box">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Name</label>
          </div>
          <div className="login-box">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className="login-box">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            <div className="login-box">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label>Address</label>
            </div>
          </div>
          <div>
            <button onClick={handleSignup}>
              <span className="position-absolute d-block"></span>
              <span className="position-absolute d-block"></span>
              <span className="position-absolute d-block"></span>
              <span className="position-absolute d-block"></span>
              Sign up
            </button>
            {!isValid && (
              <p className="error-message" style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}
            <p>
              already have account
              <Link to="/login">
                <br />
                <button>Sign in</button>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
