import axios from "axios";

const API_URL = "http://localhost:5000/board";

export async function getAllBoards() {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
}

export async function getBoardMetadataById(id) {
  const token = localStorage.getItem("token");

  const metadata = await axios.get(`${API_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return metadata.data.data;
}

export async function createBoard(title, width, height) {
  const token = localStorage.getItem("token");

  console.log({ title, size: { width, height } });
  const response = await axios.post(
    API_URL,
    { title, size: { width, height } },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
}

const boardService = {
  getAllBoards,
  getBoardMetadataById,
  createBoard,
};

export default boardService;
