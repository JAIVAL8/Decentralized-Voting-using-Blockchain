import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import loginpic from "../images/login.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import firebase from "../firebase";
// import Modal from "react-modal";
import { UserContext } from "../App";
import swal from "sweetalert";

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//   },
// };

// Modal.setAppElement("#root");
function Login() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [aadharNo, setAadharNo] = useState("");
  const [password, setPassword] = useState("");
  // const [modal, setModal] = useState(false);
  // const [code, setCode] = useState("");

  // const obj = {
  //   // containerForRecaptch: null,
  //   // openModal: function () {
  //   //   this.containerForRecaptch = recaptcha;
  //   // },
  //   // getCodeFromUser2: function () {
  //   //   this.containerForRecaptch.confirm();
  //   // },
  //   number: null,
  //   token: null,
  //   user: {},
  //   giveNumber: function (number1) {
  //     this.number = number1;
  //   },
  //   giveToken: function (token1) {
  //     this.token = token1;
  //   },
  //   giveUser: function (user1) {
  //     this.user = user1;
  //   },
  // };

  // const getCodeFromUser = (code) => {
  //   setModal(false);

  //   // console.log(modal);
  //   // console.log(">>>>>>>>>", code);
  //   // // const element = "123654";
  //   // // return element;

  //   // console.log(typeof data.mobileNo);
  //   // const recaptcha = new firebase.auth.RecaptchaVerifier(
  //   //   "recaptcha-container"
  //   // );
  //   // const number = "+91" + obj.number;
  //   const number = "+911234567890";

  //   firebase
  //     .auth()
  //     .signInWithPhoneNumber(number, recaptcha)
  //     .then((e) => {
  //       // const code = prompt(
  //       //   "Enter the OTP sent to your registered Mobile no +91" +
  //       //     data.mobileNo
  //       // );

  //       // const otp = getCodeFromUser();
  //       if (!code) {
  //         return;
  //       }
  //       e.confirm(code)
  //         .then((res) => {
  //           console.log("---->", obj.number);
  //           console.log("---->", obj.user);
  //           console.log("---->", obj.token);
  //           localStorage.setItem("jwt", obj.token);
  //           localStorage.setItem("user", JSON.stringify(obj.user));
  //           dispatch({ type: "USER", payload: obj.user });
  //           toast.success("sucessfully signed in", {
  //             position: "top-center",
  //           });
  //           window.setTimeout(() => {
  //             history.push("/");
  //           }, 1700);
  //         })
  //         .catch((err) => {
  //           toast.error("*OTP* does not match!", {
  //             position: "top-center",
  //           });
  //           window.setTimeout(() => {
  //             history.go(0);
  //           }, 2000);
  //           return;
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const postData = () => {
    if (!aadharNo || !password) {
      toast.warning("Please enter all the fields!", {
        position: "top-center",
      });
      return;
    }
    if (!/^[01]\d{3}[\s-]?\d{4}[\s-]?\d{4}$/.test(aadharNo)) {
      toast.error("*Adhar No* should be of 12 digit", {
        position: "top-center",
      });
      return;
    }

    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aadharNo,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, {
            position: "top-center",
          });
        } else {
          const recaptcha = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container"
          );
          // // obj.openModal = recaptcha;

          // obj.giveNumber(data.mobileNo);
          // obj.giveUser(data.user);
          // obj.giveToken(data.token);
          // console.log("---->", obj.number);
          // console.log("---->", obj.user);
          // console.log("---->", obj.token);
          // setModal(true);
          // const recaptcha = new firebase.auth.RecaptchaVerifier(
          //   "recaptcha-container"
          // );
          const number = "+91" + data.mobileNo;
          //const number = "+911234567890";
          var n1 = number.substr(0, 5);
          var n2 = number.substr(10);
          var n = n1 + "*****" + n2;
          // console.log("++++++++>>>>", number);
          firebase
            .auth()
            .signInWithPhoneNumber(number, recaptcha)
            .then((e) => {
              // const code = prompt(
              //   "Enter the OTP sent to your registered Mobile no +91" +
              //     data.mobileNo
              // );

              // const otp = getCodeFromUser();
              swal(
                "Enter 6 digit OTP sent to your registered Mobile No. " + n,
                {
                  content: "input",
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                }
              ).then((value) => {
                if (!value) {
                  toast.error("*OTP* does not match!", {
                    position: "top-center",
                  });
                  window.setTimeout(() => {
                    history.go(0);
                  }, 2000);
                  return;
                }
                e.confirm(value)
                  .then((res) => {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user });
                    // toast.success("successfully signed in", {
                    //   position: "top-center",
                    // });

                    swal("🎉✨", "Signed in successfully!", "success");
                    // window.setTimeout(() => {
                    history.push("/");
                    // }, 1700);
                  })
                  .catch((err) => {
                    toast.error("*OTP* does not match!", {
                      position: "top-center",
                    });
                    window.setTimeout(() => {
                      history.go(0);
                    }, 2000);
                    return;
                  });
              });
            })
            .catch((err) => {
              toast.error("*Mobile No.* is Invalid!", {
                position: "top-center",
              });
              console.log(err);
              window.setTimeout(() => {
                history.go(0);
              }, 2000);
              return;
            });
        }
      })
      .catch((err) => {
        toast.error("reCAPTCHA is not verified correctly!", {
          position: "top-center",
        });
        console.log(err);
        window.setTimeout(() => {
          history.go(0);
        }, 2000);
        return;
      });
  };

  return (
    <>
      <section className="sign-in">
        <div className="container mt-5">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src={loginpic} alt="registration pic" />
              </figure>
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "black" }}
              >
                Create an account? <span style={{ color: "blue" }}>signup</span>
              </Link>
              <Link
                to="/reset-password"
                style={{ textDecoration: "none", color: "black" }}
              >
                Forgot <span style={{ color: "blue" }}>password?</span>
              </Link>
            </div>
            <div className="signin-form">
              <h2 className="form-title">Login</h2>
              <form className="register-form" id="register-form">
                {/* <div id="sign-in-button"></div> */}
                <div className="form-group">
                  <label htmlFor="aadharNo">
                    <i className="zmdi zmdi-account  material-icons-name"></i>
                  </label>
                  <input
                    id="aadharNo"
                    type="number"
                    value={aadharNo}
                    onChange={(e) => setAadharNo(e.target.value)}
                    autoComplete="off"
                    placeholder="Your AadharNo"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    placeholder="Your Password"
                  />
                </div>
              </form>
              <div style={{ marginTop: "10px" }} id="recaptcha-container"></div>
              <button
                style={{ marginTop: "10px" }}
                className="btn btn-primary btn-lg"
                onClick={() => postData()}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
      {/* 
      <Modal
        style={customStyles}
        isOpen={modal}
        shouldCloseOnOverlayClick={false}
        // onRequestClose={() => setModal(false)}
      >
        <div class="form-group">
          <h5> OTP is sent to your registered Mobile No.</h5>

          <input
            type="number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            placeholder="Enter 6 digit OTP"
          />

          <button
            className="btn btn-primary btn-sm"
            style={{
              marginTop: "10px",
              marginRight: "40%",
              marginLeft: "40%",
            }}
            // onClick={() => getCodeFromUser(code)}
          >
            Submit
          </button>
        </div>
      </Modal> */}
    </>
  );
}

export default Login;
