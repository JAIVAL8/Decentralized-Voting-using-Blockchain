import React, { useState } from "react";
import resetpic from "../images/password.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";

function Reset() {
  const history = useHistory();
  const [uId, setUID] = useState("");
  const postData = () => {
    if (!uId) {
      toast.warning("Please enter *Unique Id*", {
        position: "top-center",
      });
      return;
    }
    // console.log(uId);
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          toast.error(data.err, {
            position: "top-center",
          });
        } else {
          swal("🎉✨", "Check Your Email", "success");
          history.push("/login");
        }
        //console.log("=====>>>>>>", data);
      })
      .catch((error) => {
        console.log(error);
      });
    setUID("");
  };
  return (
    <>
      <section className="sign-in">
        <div className="container mt-5">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src={resetpic} alt="registration pic" />
              </figure>
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "black" }}
              >
                Create an account? <span style={{ color: "blue" }}>signup</span>
              </Link>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "black" }}
              >
                Already have an account?{" "}
                <span style={{ color: "blue" }}>login</span>
              </Link>
            </div>
            <div className="signin-form">
              <h2 className="form-title">Reset</h2>
              <form className="register-form" id="register-form">
                {/* <div id="sign-in-button"></div> */}
                <div className="form-group">
                  <label htmlFor="uId">
                    <i className="zmdi zmdi-account  material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    value={uId}
                    onChange={(e) => setUID(e.target.value)}
                    autoComplete="off"
                    placeholder="Your Unique ID"
                  />
                </div>
              </form>

              <button
                style={{ marginTop: "10px", fontSize: "1.2rem" }}
                className="btn btn-primary btn-lg"
                onClick={() => postData()}
              >
                Verify UID
              </button>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default Reset;
