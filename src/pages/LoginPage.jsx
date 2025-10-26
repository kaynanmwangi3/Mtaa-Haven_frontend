// src/pages/LoginPage.jsx
import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({email: "",first_name: "",last_name: "",password: "",});
  const [registerData, setRegisterData] = useState({email: "",first_name: "",last_name: "",phone: "",user_type: "",password: "",});
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(" http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        setIsActive(false);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error during registration.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(" http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Login successful!");
        navigate("/");
        console.log(data.user);
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Server error during login.");
    }
  };

  return (
    <div className="haha">
      <div className={`container ${isActive ? "active" : ""}`}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#">
                <i className="bx bxl-google"></i>
              </a>
              <a href="#">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="#">
                <i className="bx bxl-github"></i>
              </a>
              <a href="#">
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="First Name"
                value={registerData.first_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    first_name: e.target.value,
                  })
                }
                required
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Last Name"
                value={registerData.last_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    last_name: e.target.value,
                  })
                }
                required
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Phone (optional)"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
              />
              <i className="bx bxs-phone"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="User Type"
                value={registerData.user_type}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    user_type: e.target.value,
                  })
                }
                required
              />
              <i className="bx bxs-id-card"></i>
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="#">
                <i className="bx bxl-google"></i>
              </a>
              <a href="#">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="#">
                <i className="bx bxl-github"></i>
              </a>
              <a href="#">
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              className="btn register-btn"
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
