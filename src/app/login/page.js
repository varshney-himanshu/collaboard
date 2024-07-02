"use client";

import { login } from "@/redux/auth.slice";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

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
    <div>
      <h1>Login page</h1>
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
        <input disabled={loading} type="submit" value={"Submit"} />
        {loading && <div>Processing... please wait.</div>}
        {isAuthenticated && <div>you are now authenticated.</div>}
        {error && error.message && (
          <div style={{ color: "red" }}>{error.message}</div>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
