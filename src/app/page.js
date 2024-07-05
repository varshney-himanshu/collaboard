"use client";
import { fetchBoards } from "@/redux/boards.slice";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  if (isAuthenticated) {
    dispatch(fetchBoards());
  }

  return !isAuthenticated ? redirect("/login") : redirect("/dashboard");
}
