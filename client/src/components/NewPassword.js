import React, { useState } from "react";
import resetpic from "../images/login.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";

function NewPassword() {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const { token } = useParams();
  // console.log("====>", token);
  const postData = () => {
    if (!password || !confirmpass) {
      toast.warning("Please enter all the fields!", {
        position: "top-center",
      });
      return;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
        password
      )
    ) {
      toast.error(
        "*Password* must contain atleast 1 lowercase, 1 uppercase, 1 numeric, 1 special character & must be 8 characters or longer",
        {
          position: "top-center",
        }
      );
      return;
    } else if (password !== confirmpass) {
      toast.error("Password does not match!", {
        position: "top-center",
      });
      return;
    }

    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          toast.error(data.err, {
            position: "top-center",
          });
        } else {
          swal(
            "Successfully Changed!!! 🎉✨",
            "Kindly Check your Email",
            "success"
          );
          history.push("/login");
        }
        console.log("123334348943872782387");
      })
      .catch((error) => {
        console.log(error);
      });
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
            </div>
            <div className="signin-form">
              <h2 className="form-title">Reset</h2>
              <form className="register-form" id="register-form">
                {/* <div id="sign-in-button"></div> */}
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter New Password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cpassword">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="password"
                    value={confirmpass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    autoComplete="off"
                    placeholder="Confirm Your Password"
                  />
                </div>
              </form>

              <button
                style={{ marginTop: "10px", fontSize: "1.2rem" }}
                className="btn btn-primary btn-lg"
                onClick={() => postData()}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default NewPassword;
