import boardService from "@/services/board.service";
import { redirect } from "next/navigation";
import React, { useState } from "react";

function CreateBoard() {
  const [values, setValues] = useState({
    title: "",
    width: "",
    height: "",
  });
  const [error, setError] = useState({});

  function handleValueChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleOnSubmit(e) {
    e.preventDefault();

    setError({});

    const { title, width, height } = values;

    const parsedWidth = parseInt(width);
    const parsedHeight = parseInt(height);

    if (isNaN(parsedWidth)) {
      setError({ message: "Please Enter valid width" });
      return;
    }

    if (isNaN(parsedHeight)) {
      setError({ message: "Please Enter valid height" });
      return;
    }

    try {
      const data = await boardService.createBoard(
        title,
        parsedWidth,
        parsedHeight
      );
      window.location.href = `/board?id=${data.board._id}`;
    } catch (error) {
      console.log(error);
    }

    console.log(values);
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        name="title"
        placeholder="Title"
        type="text"
        value={values.title}
        min={2}
        onChange={handleValueChange}
        required
      ></input>
      <label>Size</label>
      <input
        name="width"
        placeholder="Width"
        type="text"
        value={values.width}
        min={2}
        onChange={handleValueChange}
        required
      ></input>
      <input
        name="height"
        placeholder="Height"
        type="text"
        value={values.height}
        min={2}
        onChange={handleValueChange}
        required
      ></input>
      <button>Create</button>

      {error.message && (
        <div>
          <small style={{ color: "red" }}>{error.message}</small>
        </div>
      )}
    </form>
  );
}

export default CreateBoard;
