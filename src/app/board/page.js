"use client";

import { useEffect, useRef } from "react";
import Socket from "@/config/Socket";
import { useSearchParams } from "next/navigation";

/* const board_id = "6678588d428995f1192c5f16"; */

function Board() {
  const params = useSearchParams();
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const isWritingRef = useRef(false);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const board_id = params.get("id");
  const socket = useRef(Socket.getInstance(board_id));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.canvas.height = 600;
    ctx.canvas.width = 600;

    const draw = (pX, pY, cX, cY) => {
      ctx.beginPath();
      ctx.moveTo(pX, pY);
      ctx.lineTo(cX, cY);
      ctx.stroke();
      ctx.beginPath();
    };

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokesRef.current.forEach((pos) => {
        draw(pos.pX, pos.pY, pos.cX, pos.cY);
      });
    };

    const handleMousePosAndWrite = (e) => {
      const currX = e.clientX - canvas.offsetLeft;
      const currY = e.clientY - canvas.offsetTop;
      const prevX = prevPosRef.current.x;
      const prevY = prevPosRef.current.y;

      if (isWritingRef.current) {
        const stroke = { pX: prevX, pY: prevY, cX: currX, cY: currY };
        strokesRef.current.push(stroke);
        socket.current.emit("write", { stroke, board_id });
        draw(prevX, prevY, currX, currY);
      }

      prevPosRef.current = { x: currX, y: currY };
    };

    socket.current.on("connect-success", () => {
      console.log("connected successfully");
      socket.current.emit("join-board", { board_id });
    });

    socket.current.on("new-user-joined", () => {
      console.log("new-user-joinedd");
    });

    socket.current.on("join-board-success", ({ data }) => {
      strokesRef.current = data;
      redraw();
    });

    socket.current.on("write-update", (stroke) => {
      strokesRef.current.push(stroke);
      draw(stroke.pX, stroke.pY, stroke.cX, stroke.cY);
    });

    document.addEventListener("mousemove", handleMousePosAndWrite);
    document.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        isWritingRef.current = true;
      }
    });
    document.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        isWritingRef.current = false;
      }
    });

    return () => {
      socket.current.off("connect-success");
      socket.current.off("write-update");

      socket.current.off("new-user-joined", () => {
        console.log("new-user-joinedd");
      });

      socket.current.off("join-board-success", ({ data }) => {
        strokesRef.current = data;
        console.log("got data", data);
        redraw();
      });
      document.removeEventListener("mousemove", handleMousePosAndWrite);
      document.removeEventListener("mousedown", (e) => {
        if (e.button === 0) {
          isWritingRef.current = true;
        }
      });
      document.removeEventListener("mouseup", (e) => {
        if (e.button === 0) {
          isWritingRef.current = false;
        }
      });
    };
  }, [board_id]);

  return (
    <canvas
      id="canvas"
      style={{
        backgroundColor: "white",
        boxShadow: "0 0 50px rgba(0,0,0,0.2)",
      }}
      ref={canvasRef}
    ></canvas>
  );
}

export default Board;
