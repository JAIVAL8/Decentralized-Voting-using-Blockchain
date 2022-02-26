import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Admin.css";
export const Admin = () => {
  const history = useHistory();
  const [difficulty, setDifficulty] = useState();
  const [max, setMax] = useState();
  const [node, setNode] = useState();
  const [nodeVal, setNodeVal] = useState();
  const [flag, setFlag] = useState();
  useLayoutEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).isAdmin === false) {
      history.push("/");
    }
    fetch("/flag", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFlag(data.message);
      });
  }, []);

  const startVote = () => {
    // fetch("http://localhost:4001/broadcast/reset", {
    //   method: "get",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + localStorage.getItem("jwt"),
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setFlag(data.message);
    //   });
    fetch("/set-flag", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        flag: true,
        chartFlag: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFlag(data.message);
      });
    window.setTimeout(() => {
      history.push("/");
    }, 1700);
  };

  const endVote = () => {
    fetch("http://localhost:4001/broadcast/Forcemine", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message, {
          position: "top-center",
        });
      });
    fetch("/set-flag", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        flag: false,
        chartFlag: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFlag(data.message);
      });
    fetch("/send-mail-all", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message, {
          position: "top-center",
        });
      });
    window.setTimeout(() => {
      history.push("/dashboard");
    }, 1700);
  };

  const runConsensus = () => {
    if (!nodeVal) return;
    fetch(`http://localhost:${nodeVal}/consensus`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
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
          Authorization: "Bearer " + localStorage.getItem("jwt"),
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
        Authorization: "Bearer " + localStorage.getItem("jwt"),
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
      <div className="container-adm">
        <div className="form-group form-adm">
          <span className="span-adm">No. of Nodes in Network</span>

          <input
            id="node"
            type="number"
            value={node}
            onChange={(e) => setNode(e.target.value)}
            autoComplete="off"
            placeholder="3"
            style={{ width: "40%", margin: "0 auto", textAlign: "center" }}
          />
        </div>
        <button
          style={{ margin: "3px auto", alignItems: "center" }}
          class="btn btn-outline-primary btn-md"
          onClick={() => postNode()}
        >
          Register Nodes
        </button>
        <div className="form-group form-adm">
          <span className="span-adm">The Difficulty of Mining</span>
          <p>
            Note: The difficulty should be lower {`(<=4)`} for low processing
            machines
          </p>

          <input
            id="diff"
            type="number"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            autoComplete="off"
            placeholder="1"
            style={{ width: "40%", margin: "0 auto", textAlign: "center" }}
          />
          <div style={{ marginTop: "13px" }}>
            <span className="span-adm">The No. of Votes per Block</span>
          </div>

          <input
            id="max"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            autoComplete="off"
            placeholder="10"
            style={{ width: "40%", margin: "0 auto", textAlign: "center" }}
          />
        </div>
        <button
          style={{ margin: "3px auto", alignItems: "center" }}
          class="btn btn-outline-primary btn-md"
          onClick={() => postData()}
        >
          Set Mining Limit
        </button>
        <div className="form-group form-adm">
          <span className="span-adm">Run Consensus in case a Node fails</span>
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
            style={{ width: "50%", margin: "0 auto", textAlign: "center" }}
          />
        </div>
        <button
          style={{ margin: "3px auto", alignItems: "center" }}
          class="btn btn-outline-primary btn-md"
          onClick={() => runConsensus()}
        >
          Run Consensus
        </button>
        <div>
          <button
            style={{
              marginTop: "15px",
              alignItems: "center",
            }}
            class="btn btn-outline-success btn-md"
            id="btn1"
            onClick={() => startVote()}
            disabled={flag}
          >
            Start Voting
          </button>
          <button
            style={{
              marginTop: "15px",
              marginLeft: "15px",
              alignItems: "center",
            }}
            class="btn btn-outline-secondary btn-md"
            id="btn1"
            disabled={!flag}
            onClick={() => endVote()}
          >
            End Voting
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
