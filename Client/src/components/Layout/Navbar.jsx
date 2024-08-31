import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logout from "./Logout";
import logo from "./image.jpg";

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const button = {
    marginRight: "20px",
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.3rem 1.4rem",
  };

  return (
    <>
      <AppBar sx={{ bgcolor: "#333" }}>
        <Toolbar>
          <div className="flex items-center">
            <a
              href="https://agrasmartcity.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={logo} className="h-12 w-12 rounded-full" alt="Logo" />
              <span className="ml-3 text-white text-xl font-semibold">
                SMART CITY AGRA
              </span>
            </a>
          </div>
          <div className="flex items-center ml-auto">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="contained"
                  style={button}
                  color="error"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>

                <Button
                  variant="contained"
                  style={button}
                  color="success"
                  component={Link}
                  to="/Signup"
                >
                  SignUp
                </Button>
              </>
            ) : (
              <Logout setIsLoggedIn={setIsLoggedIn} />
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
