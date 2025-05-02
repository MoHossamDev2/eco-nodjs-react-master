import { Link, useNavigate } from "react-router-dom";
import "./UserProfile.css";
import Signup from "./Signup";
import { useState, useEffect } from "react";

const UserProfile = ({ currentUser, setUser }) => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const activeUser = currentUser || storedUser;

  const { email, name: userName, image: userImage, phone: userPhone, address: userAddress } = activeUser?.user || {};

  const [name, setName] = useState(userName || "");
  const [image, setImage] = useState(userImage || "");
  const [phone, setPhone] = useState(userPhone || "");
  const [address, setAddress] = useState(userAddress || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem("currentUser", JSON.stringify(activeUser));
    }
  }, [activeUser]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleDeleteAccount = () => {
    setUser(null);
    localStorage.removeItem("currentUser");

    fetch("https://backend-kappa-seven-10.vercel.app/deleteUser", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err));

    navigate("/");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    fetch("https://backend-kappa-seven-10.vercel.app/updateUser", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        image,
        phone,
        address,
        password: newPassword,
        confirmPassword,
      }),
    })
      .then((res) => {
        console.log(res.json());
        console.log("Profile updated successfully!");
        setUser({
          ...activeUser,
          user: { ...activeUser.user, name, image, phone, address },
        });
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...activeUser,
            user: { ...activeUser.user, name, image, phone, address },
          })
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>

      {activeUser ? (
        <div className="ground">
          <div className="profile-container">
            <div style={{ display: "flex", justifyContent: "center", color: "#007bff;", backgroundColor: "#fff", padding: "10px", marginBottom: "10px" }}>
              <Link to="/" style={{ display: "block", width: "100%", textAlign: "center" }}>
                <i className="fas fa-home"></i> Home
              </Link>
            </div>
            <div className="profile-header">
              <img
                className="profile-image"
                src={userImage || "./default-profile-img.jpg"}
                alt="Profile"
                onError={(e) => {
                  e.target.src = "./default-profile-img.jpg";
                }}
              />
              <div>
                <div className="profile-name">{userName}</div>
                <div className="profile-email">{email}</div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" className="btn">
                Update Profile
              </button>
            </form>

            <div className="action-buttons">
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
              <button onClick={handleDeleteAccount} className="btn btn-delete">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Signup setUser={setUser} />
      )}
    </div>
  );
};

export default UserProfile;
