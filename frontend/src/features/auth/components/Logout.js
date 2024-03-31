import React, { useEffect } from "react";
import { selectLoggedInUser, signOutAsync } from "../authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    dispatch(signOutAsync());
  });

  // but useEffect runs after render, so we have to delay navigate part
  // Inshort we have to delay because useEffect render huna ke baad chalta ab yahan tw phely hi navigate krwa rhy foran sy then useEffect hi nahi chala ga.
  // For that we used !user
  return <>{!user && <Navigate to="/login" replace={true}></Navigate>}</>;
};

export default Logout;
