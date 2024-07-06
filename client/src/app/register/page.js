"use client";

import { login } from "@/redux/auth.slice";
import authService from "@/services/auth.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles.module.scss";
import logoImg from "@/assets/logo.png";
import Image from "next/image";

function RegisterPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});
  const [loading, setLoading] = useState(false);

  function handleValueChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError({});
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    setError({});
    setSuccess({});
    setLoading(true);
    const { username, password, confirmPassword, fullName } = values;
    console.log({ username, password, fullName, confirmPassword });

    if (password.length < 8) {
      console.log("Password should have minimum 8 letters");
      setError({ message: "password should have minimum 8 letters" });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      console.log("password didn't match");
      setError({ message: "Passwords didn't match. Please enter again." });
      setLoading(false);
      return;
    }

    try {
      await authService.register(fullName, username, password);
      setSuccess({ message: "User created successfully. Please login." });
      setLoading(false);
    } catch (e) {
      if (e.response) {
        setError(e.response.data);
      } else {
        console.log(e);
        setError({ message: "Network Error! Please retry later." });
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <main className={styles["register"]}>
      <Image
        alt="Collaboard Logo"
        className={styles["register__logo"]}
        src={logoImg}
      />
      <h1 className="heading">Register</h1>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          name="fullName"
          value={values.fullName}
          onChange={handleValueChange}
          placeholder="Enter you full name"
          required
        ></input>
        <input
          name="username"
          value={values.username}
          onChange={handleValueChange}
          minLength={4}
          placeholder="Enter username"
          required
        ></input>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleValueChange}
          minLength={4}
          placeholder="Enter password"
          required
        ></input>
        <input
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleValueChange}
          minLength={4}
          placeholder="Confirm password"
          required
        ></input>
        <button
          role="submit"
          className="button-primary"
          disabled={loading}
          type="submit"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        <Link className="button-secondary" href="/login">
          Login
        </Link>
        <br />
        {error && error.message && (
          <div style={{ color: "red" }}>{error.message}</div>
        )}
        {success && success.message && (
          <div style={{ color: "green" }}>{success.message}</div>
        )}
      </form>
    </main>
  );
}

export default RegisterPage;
