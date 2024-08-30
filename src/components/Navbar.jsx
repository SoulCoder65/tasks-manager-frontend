import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EventNoteSharpIcon from "@mui/icons-material/EventNoteSharp";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../config/firebase";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }


   dispatch(logout());
   dispatch({ type: 'RESET_ALL' });
    navigate("/login", { replace: true });
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const buttonStyle = (isFocused) => ({
    backgroundColor: isFocused ? "#fff" : "transparent",
    color: isFocused ? "#1976d2" : "#fff",
  });

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>
          <EventNoteSharpIcon width="2.5em" height="4em" />
        </Typography>

        {!token ? (
          <>
            <Button
              color="inherit"
              onClick={() => navigate("/login", { replace: true })}
              sx={buttonStyle(isLoginPage)}
            >
              Login
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              color="inherit"
              onClick={() => navigate("/signup")}
              sx={buttonStyle(isSignupPage)}
            >
              Signup
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
