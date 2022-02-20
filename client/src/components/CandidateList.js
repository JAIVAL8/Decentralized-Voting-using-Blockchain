import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import "./CandidateList.css";
import AAP from "../images/aap.png";
import Congress from "../images/Congress.jpg";
import Nota from "../images/Nota.jpg";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../firebase";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { SECRET_KEY } from "./keys";
const CryptoJS = require("crypto-js");

function decrypt(ciphertext, secret) {
  let bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

function CandidateList() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [disable, setDisable] = useState(false);
  const [flag, setFlag] = useState();

  useLayoutEffect(() => {
    fetch("/flag", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFlag(!data.message);
      });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const uId = user.uId;

    fetch("http://localhost:4001/checkuid", {
      method: "post",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, {
            position: "top-center",
          });
          setDisable(true);
        }
      });

    // fetch("/flag", {
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
    // console.log("----->>>>", flag);
  }, []);

  const postData = (candidateName) => {
    //console.log(candidateName);
    const user = JSON.parse(localStorage.getItem("user"));

    swal({
      content: {
        element: "input",
        attributes: {
          placeholder: "Enter your password",
          type: "password",
        },
      },
      closeOnEsc: false,
      closeOnClickOutside: false,
    }).then((value) => {
      if (!value) {
        // toast.warning("Please enter password", {
        //   position: "top-center",
        // });
        return;
      }
      //console.log(state);

      fetch("/verify-password", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          value,
          phoneNo: state.phoneNo,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if (data.error) {
            toast.error(data.error, {
              position: "top-center",
            });
            return;
          } else {
            // toast.success(data.phone, {
            //   position: "top-center",
            // });
            //firebase.auth().settings.appVerificationDisabledForTesting = true;

            const recaptcha = new firebase.auth.RecaptchaVerifier(
              "recaptcha-container",
              {
                size: "invisible",
              }
            );
            // console.log(recaptcha, "<<------");
            // const number = "+91" + data.phone;
            //console.log(number);
            const number = "+911234567890";
            var n1 = number.substr(0, 5);
            var n2 = number.substr(10);
            var n = n1 + "*****" + n2;
            // console.log("++++++++>>>>", number);
            firebase
              .auth()
              .signInWithPhoneNumber(number, recaptcha)
              .then((e) => {
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
                      //console.log("===>>>", res);

                      fetch("/send-mail", {
                        method: "post",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            "Bearer " + localStorage.getItem("jwt"),
                        },
                        body: JSON.stringify({
                          email: user.email,
                          uid: user.uId,
                          candidateName,
                        }),
                      });
                      //dispatch({ type: "VOTE", payload: { voted: true } });
                      // console.log(state);

                      const { uId, city, gender, age } = user;
                      const decryptedCity = decrypt(city, SECRET_KEY);
                      const decryptedGender = decrypt(gender, SECRET_KEY);
                      const decryptedAge = decrypt(age, SECRET_KEY);
                      const receiver = candidateName;
                      // console.log(uId);
                      fetch("http://localhost:4001/broadcast/Pending-votes", {
                        method: "post",

                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          uid: uId,
                          receiver: candidateName,
                          location: decryptedCity,
                          age: decryptedAge,
                          gender: decryptedGender,
                        }),
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.error) {
                            toast.error(data.error, {
                              position: "top-center",
                            });

                            return;
                          } else {
                            // console.log(data);
                            swal(
                              "🎉✨",
                              "Voted to " +
                                candidateName +
                                " successully. Check your email",
                              "success"
                            );
                            window.setTimeout(() => {
                              history.push("/dashboard");
                            }, 1700);
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
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
                // window.setTimeout(() => {
                //   history.go(0);
                // }, 2000);
                return;
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
    //console.log("======>>>> ", state);
    //console.log("======>>>> ", state.voted);
  };

  return (
    <>
      <section id="facilities">
        <div className="title">
          <h1> Candidate's List</h1>
        </div>
        <div id="recaptcha-container"></div>
        <div className="containers">
          <div
            className="row gy-3"
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "1.3rem",
              paddingBottom: "1.3rem",
            }}
          >
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div
                className="card"
                style={{
                  width: "18rem",
                }}
              >
                <div className="inner">
                  <img className="card-img-top" src={Congress} alt="Card"></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title"> CONGRESS </h5>
                  <p className="card-text">
                    Rahul Gandhi is an Indian politician and a member of the
                    Indian Parliament, constituency of Wayanad, Kerala in 17 th
                    Lok Sabha.
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={disable || flag}
                    onClick={() => postData("CONGRESS")}
                  >
                    Click to Vote
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div
                className="card"
                style={{
                  width: "18rem",
                }}
              >
                <div className="inner">
                  <img className="card-img-top" src={AAP} alt="Card"></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title"> AAP </h5>
                  <p className="card-text">
                    Arvind Kejriwal is an Indian politician and a former
                    bureaucrat who is the current and 7 th Chief Minister of
                    Delhi since February 2015.
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={disable || flag}
                    onClick={() => postData("AAP")}
                  >
                    Click to Vote
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div
                className="card"
                style={{
                  width: "18rem",
                }}
              >
                <div className="inner">
                  <img
                    className="card-img-top"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/1200px-Bharatiya_Janata_Party_logo.svg.png"
                    alt="Card"
                  ></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title"> BJP </h5>
                  <p className="card-text">
                    Narendra Damodardas Modi is an Indian politician serving as
                    the 14 th and current prime minister of India since 2014.
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={disable || flag}
                    onClick={() => postData("BJP")}
                  >
                    Click to Vote
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div
                className="card"
                style={{
                  width: "18rem",
                }}
              >
                <div className="inner">
                  <img
                    className="card-img-top"
                    src="https://timesofindia.indiatimes.com/thumb/msid-80876920,imgsize-57317,width-400,resizemode-4/80876920.jpg"
                    alt="Card"
                  ></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title"> A.I.M.I.M </h5>
                  <p className="card-text">
                    Asaduddin Owaisi is an Indian politician, who is the
                    President of the All India Majlis - e - Ittehadul Muslimeen.
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={disable || flag}
                    style={{ marginTop: "2.5rem" }}
                    onClick={() => postData("A.I.M.I.M")}
                  >
                    Click to Vote
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div
                className="card"
                style={{
                  width: "18rem",
                }}
              >
                <div className="inner">
                  <img className="card-img-top" src={Nota} alt="Card"></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title"> NOTA </h5>
                  <p className="card-text">
                    "None of the above", or NOTA for short, also known as
                    "against all" or a "scratch" vote, is a ballot option in
                    some jurisdictions or organizations.
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={disable || flag}
                    style={{ marginTop: "2.5rem" }}
                    onClick={() => postData("NOTA")}
                  >
                    Click to Vote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default CandidateList;
