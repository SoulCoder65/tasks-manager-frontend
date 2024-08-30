import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { login, loginWithGoogle } from "../../store/slices/authSlice";
import ErrorNotification from "../../components/ErrorNotification";
import Loader from "../../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiError = useSelector((state) => state.auth.error);
  const isLoading = useSelector((state) => state.auth.isLoading);

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate fields
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await dispatch(login({ email, password }));
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("An error occurred during login:", error.message);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await dispatch(loginWithGoogle(idToken));
      const token = localStorage.getItem("token");

      if (token) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.error("User canceled the sign-in process.");
      } else {
        console.error("An error occurred during sign-in:", error.message);
      }

      alert("Failed to sign in. Please try again.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        maxWidth: "500px",
        mx: "auto",
        mt: 2,
        p: 3,
        borderRadius: "4px",
        textAlign: "center",
      }}
    >
      <Typography
        variant=""
        component="h1"
        gutterBottom
        color="#1976d2"
        align="left"
      >
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          maxWidth: "500px",
          mx: "auto",
          display: "flex",
          flexFlow: "column nowrap",
          mt: 1,
          p: 3,
          border: "2px solid #1976d2",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <ErrorNotification error={apiError} />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: "#1976d2" }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/signup")}
            sx={{ color: "#1976d2" }}
          >
            Sign up
          </Link>
        </Typography>
        <Button
          variant="contained"
          bgcolor="#1976d2"
          sx={{
            mt: 2,
            width: "45%",
            mx: "auto",
            display: "block",
          }}
          onClick={handleGoogleLogin}
        >
          Login with <b>Google</b>
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
