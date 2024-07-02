"use client";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function Home() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return !isAuthenticated ? redirect("/login") : redirect("/dashboard");
}
