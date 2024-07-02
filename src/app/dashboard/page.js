"use client";
import useAuth from "@/hooks/useAuth";
import DrawingCanvas from "@/components/DrawingCanvas/DrawingCanvas";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/auth.slice";
import Socket from "@/config/Socket";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";

function DashboardPage() {
  const dispatch = useDispatch();
  const isAuthenticated = useAuth();
  const auth = useSelector((state) => state.auth);

  const [boards, setBoards] = useState([]);

  function handleOnClickLogout() {
    dispatch(logout());
  }

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/board", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        console.log(response.data.data);
        setBoards(response.data.data); // handle response data
      } catch (error) {
        console.error("Error fetching board data", error);
      }
    };
    if (isAuthenticated) {
      fetchBoardData();
    }
  }, []);

  if (!isAuthenticated) {
    return <p>Loading...</p>; // Or a redirect/loading indicator
  }

  console.log("boards", boards);
  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleOnClickLogout}>Logout</button>
      <Link href={"/board"}>
        <div>
          {boards.map((board) => (
            <div key={`board_${board._id}`}>
              <Link href={`/board?id=${board["_id"]}`}>{board.title}</Link>
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}

export default DashboardPage;
