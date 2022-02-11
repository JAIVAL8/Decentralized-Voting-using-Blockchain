import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Admin.css";
export const Admin = () => {
  const history = useHistory();
  const [difficulty, setDifficulty] = useState();
  const [max, setMax] = useState();
  useLayoutEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).isAdmin === false) {
      history.push("/");
    }
  }, []);

  const postData = () => {
    if (!difficulty || !max) {
      return;
    }
    console.log(difficulty, " ", typeof difficulty);
    console.log(max, " ", typeof max);

    fetch("http://localhost:4001/broadcast-node-mininglimit", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diff: difficulty,
        max,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, {
            position: "top-center",
          });
        } else {
          toast.success(data.message, {
            position: "top-center",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="input-fild">
        <span>The Difficulty of Mining</span>
        <p>
          Note: The difficulty should be lower {`(<=4)`} for low processing
          machines
        </p>
        <div className="form-group">
          <label htmlFor="diff">
            <i className="zmdi zmdi-walk material-icons-name"></i>
          </label>
          <input
            id="diff"
            type="number"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            autoComplete="off"
            placeholder="1"
          />
        </div>
        <div className="form-group">
          <span>The No. of Votes per Block</span>
          <label htmlFor="max">
            <i className="zmdi zmdi-walk material-icons-name"></i>
          </label>
          <input
            id="max"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            autoComplete="off"
            placeholder="10"
          />
        </div>
        <button
          style={{ margin: "10px auto", alignItems: "center" }}
          class="btn btn-primary btn-lg"
          onClick={() => postData()}
        >
          Set Mining Limit
        </button>
      </div>
      <ToastContainer />
    </>
  );
};
