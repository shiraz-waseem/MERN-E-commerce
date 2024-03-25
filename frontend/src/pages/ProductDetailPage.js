import React from "react";
import ProductDetail from "../features/product/components/ProductDetail";
import NavBar from "../features/navbar/Navbar";

const ProductDetailPage = () => {
  return (
    <NavBar>
      <ProductDetail></ProductDetail>
    </NavBar>
  );
};

export default ProductDetailPage;
