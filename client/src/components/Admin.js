import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Admin.css";
export const Admin = () => {
  const history = useHistory();
  const [difficulty, setDifficulty] = useState();
  const [max, setMax] = useState();
  const [node, setNode] = useState(5);
  const [nodeVal, setNodeVal] = useState();
  useLayoutEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).isAdmin === false) {
      history.push("/");
    }
  }, []);
  const startVote = () => {
    console.log("hiii");
  };
  const endVote = () => {
    fetch("http://localhost:4001/broadcast/Forcemine")
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message, {
          position: "top-center",
        });
      });
  };

  const runConsensus = () => {
    if (!nodeVal) return;
    fetch(`http://localhost:${nodeVal}/consensus`)
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message, {
          position: "top-center",
        });
      });
  };

  const postNode = () => {
    if (!node) return;
    const networkNodes = [];
    for (let i = 1; i <= node; i++) {
      networkNodes.push(`http://localhost:${4000 + i}`);
    }
    for (let i = 0; i < node; i++) {
      fetch(`${networkNodes[i]}/register-bulk-nodes`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          networkNodes,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message, {
            position: "top-center",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const postData = () => {
    if (!difficulty || !max) {
      return;
    }
    // console.log(difficulty, " ", typeof difficulty);
    // console.log(max, " ", typeof max);

    fetch("http://localhost:4001/broadcast/Set-Parameters", {
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
        <div className="form-group">
          <span>No. of Nodes in Network</span>

          <input
            id="node"
            type="number"
            value={node}
            onChange={(e) => setNode(e.target.value)}
            autoComplete="off"
          />
        </div>
        <button
          style={{ margin: "10px auto", alignItems: "center" }}
          class="btn btn-primary btn-lg"
          onClick={() => postNode()}
        >
          Register Nodes
        </button>
        <div>
          <span>The Difficulty of Mining</span>
          <p>
            Note: The difficulty should be lower {`(<=4)`} for low processing
            machines
          </p>
        </div>

        <div className="form-group">
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
        <div className="form-group">
          <span>Run Consensus in case a Node fails</span>
          <p>
            Note: The values should be within the range of registered nodes.
          </p>

          <input
            id="consensus"
            type="number"
            value={nodeVal}
            onChange={(e) => setNodeVal(e.target.value)}
            autoComplete="off"
            placeholder="4001"
          />
        </div>
        <button
          style={{ margin: "10px auto", alignItems: "center" }}
          class="btn btn-primary btn-lg"
          onClick={() => runConsensus()}
        >
          Run Consensus
        </button>
        <div>
          <button
            style={{ margin: "10px auto", alignItems: "center" }}
            class="btn btn-primary btn-lg"
            onClick={() => endVote()}
          >
            End Voting
          </button>
          <button
            style={{ margin: "10px auto", alignItems: "center" }}
            class="btn btn-primary btn-lg"
            onClick={() => startVote()}
          >
            Start Voting
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
