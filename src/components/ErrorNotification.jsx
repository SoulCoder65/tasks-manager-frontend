import React from "react";
import { Typography } from "@mui/material";

const ErrorNotification = ({ error }) => {
  if (!error) return null;

  return (
    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
      {error}
    </Typography>
  );
};

export default ErrorNotification;
