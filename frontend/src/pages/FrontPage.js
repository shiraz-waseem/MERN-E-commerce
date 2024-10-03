import React from "react";
import Announcement from "../components/Announcement";
import HomeNav from "../components/HomeNav";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import Products from "../components/Products";
import styled from "styled-components";
import Footer from "../components/Footer";
// import Footer from "../features/common/Footer";

const MainContainer = styled.div`
  background-color: white;
`;

const FrontPage = () => {
  return (
    <MainContainer>
      <Announcement />
      <HomeNav />
      <Slider />
      <Categories />
      <Products />
      <Footer />
    </MainContainer>
  );
};

export default FrontPage;
