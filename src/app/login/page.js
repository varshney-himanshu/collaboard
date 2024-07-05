"use client";
import { login } from "@/redux/auth.slice";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logoImg from "@/assets/logo.png";
import Image from "next/image";
import styles from "./styles.module.scss";

function LoginPage() {
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const [values, setValues] = useState({ username: "", password: "" });

  function handleValueChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    const { username, password } = values;
    console.log({ username, password });
    dispatch(login({ username, password }));
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  return (
    <main className={styles["login"]}>
      <Image
        alt="Collaboard Logo"
        className={styles["login__logo"]}
        src={logoImg}
      />
      <h1 className="heading">Login</h1>
      <form onSubmit={handleOnSubmit}>
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
        <button
          role="submit"
          className="button-primary"
          disabled={loading}
          type="submit"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        <Link className="button-secondary" href="/register">
          Register
        </Link>
        {error && error.message && (
          <div style={{ color: "red" }}>{error.message}</div>
        )}
      </form>
    </main>
  );
}

export default LoginPage;
