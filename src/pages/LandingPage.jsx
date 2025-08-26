// src/pages/LandingPage.jsx
import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/common/Header/Header';
import Banner from '../components/landing/Banner/Banner';
import HeroSection from '../components/landing/HeroSection/HeroSection';
import AboutUsSection from '../components/landing/AboutUsSection/AboutUsSection';
import FeaturesSection from '../components/landing/FeaturesSection/FeaturesSection';
import ContactFormSection from '../components/landing/ContactFormSection/ContactFormSection';
import Footer from '../components/common/Footer/Footer';

const LandingPage = () => {
  return (
    <Box>
      <Header />
      <Banner />
      <main>
        <HeroSection />
        <AboutUsSection />
        <FeaturesSection />
        <ContactFormSection />
      </main>
      <Footer />
    </Box>
  );
};

export default LandingPage;