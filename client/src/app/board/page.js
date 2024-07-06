"use client";

import { useEffect, useRef, useState } from "react";
import Socket from "@/config/Socket";
import { useSearchParams } from "next/navigation";
import boardService from "@/services/board.service";
import io from "socket.io-client";
import keys from "@/config/keys";

function Board() {
  const params = useSearchParams();
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const isWritingRef = useRef(false);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const board_id = params.get("id");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeCanvasAndSockets = async () => {
      try {
        const board = await boardService.getBoardMetadataById(board_id);
        console.log("board data", board);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("Failed to get canvas context");
          return;
        }

        const socket = io(keys.socket_url, {
          query: { board_id },
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });

        ctx.canvas.height = board.size.height;
        ctx.canvas.width = board.size.width;

        const draw = (pX, pY, cX, cY) => {
          console.log("drawing");
          ctx.beginPath();
          ctx.moveTo(pX, pY);
          ctx.lineTo(cX, cY);
          ctx.stroke();
          ctx.closePath();
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
            socket.emit("write", { stroke, board_id });
            draw(prevX, prevY, currX, currY);
          }

          prevPosRef.current = { x: currX, y: currY };
        };

        socket.on("connect-success", () => {
          console.log("connected successfully");
          setLoading(true);
          socket.emit("join-board", { board_id });
        });

        socket.on("new-user-joined", () => {
          console.log("new user joined");
        });

        socket.on("join-board-success", ({ data }) => {
          console.log("join-board-success", data);
          strokesRef.current = data;
          setLoading(false);
          redraw();
        });

        socket.on("write-update", (stroke) => {
          console.log("write-update", stroke);
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
          socket.off("connect-success");
          socket.off("write-update");
          socket.off("new-user-joined");
          socket.off("join-board-success");

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
      } catch (error) {
        console.error("Failed to initialize canvas and sockets:", error);
        setLoading(false);
      }
    };

    initializeCanvasAndSockets();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {loading && <h5>Loading board...</h5>}
      <div
        style={{
          overflow: "auto",
          maxHeight: "100%",
          maxWidth: "100%",
          display: loading ? "none" : "block",
          boxShadow: "0 0 50px rgba(0,0,0,0.2)",
        }}
      >
        <canvas
          id="canvas"
          style={{
            backgroundColor: "white",
          }}
          ref={canvasRef}
        ></canvas>
      </div>
    </div>
  );
}

export default Board;
