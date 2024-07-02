"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkToken } from "../redux/auth.slice";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("dispatching check token");
    dispatch(checkToken());
  }, [dispatch]);

  return <div>{children}</div>;
}

export default AuthProvider;
