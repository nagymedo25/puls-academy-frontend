// src/components/landing/Banner/Banner.jsx
import React from "react";
import { Box } from "@mui/material";
import BannerImage from "../../../assets/Banner.png";

const Banner = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: { xs: "auto", md: "400px" },
        overflow: "hidden",
        "& img": {
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover", // أو 'contain' حسب اللي عايزه
        },
      }}
    >
      <img src={BannerImage} alt="Pulse Academy Banner" />
    </Box>
  );
};

export default Banner;
