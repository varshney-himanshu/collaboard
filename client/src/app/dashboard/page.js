"use client";
import useAuth from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/auth.slice";
import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
import axios from "axios";
import boardService from "@/services/board.service";
import { fetchBoards } from "@/redux/boards.slice";
import CreateBoard from "./CreateBoard";

function DashboardPage() {
  const dispatch = useDispatch();
  const isAuthenticated = useAuth();
  const { data: boards, loading, error } = useSelector((state) => state.boards);

  // const [boards, setBoards] = useState([]);

  function handleOnClickLogout() {
    dispatch(logout());
  }

  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleOnClickLogout}>Logout</button>

      {loading && <div>Loading boards....</div>}
      <div>
        {boards.map((board) => (
          <div key={`board_${board._id}`}>
            <a href={`/board?id=${board["_id"]}`}>{board.title}</a>
          </div>
        ))}
      </div>

      <div className="">
        <h3>Create Board</h3>
        <CreateBoard />
      </div>
    </div>
  );
}

export default DashboardPage;
