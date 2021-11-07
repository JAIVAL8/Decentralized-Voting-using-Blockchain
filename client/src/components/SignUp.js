import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import signpic from "../images/signup.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

function SignUp() {
  const history = useHistory();
  const form1 = useRef(null);
  const form2 = useRef(null);
  const [aadharNo, setAadharNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");

  const postData = () => {
    if (
      !aadharNo ||
      !password ||
      !confirmpass ||
      !email ||
      !gender ||
      !city ||
      !phone ||
      !age
    ) {
      toast.warning("Please enter all the fields!", {
        position: "top-center",
      });
      return;
    } else if (!/^[01]\d{3}[\s-]?\d{4}[\s-]?\d{4}$/.test(aadharNo)) {
      toast.error("*Adhar No* should be of 12 digit and valid", {
        position: "top-center",
      });
      return;
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      toast.error("*Email* is not valid", {
        position: "top-center",
      });
      return;
    } else if (!/^[789]\d{9}$/.test(phone)) {
      toast.error("*Phone No* should be of 10 digit and valid", {
        position: "top-center",
      });
      return;
    } else if (gender !== "Male" && gender !== "Female" && gender !== "Other") {
      toast.error(
        "*Gender* should be either Male or Female or Other (case sensitive)",
        {
          position: "top-center",
        }
      );
      return;
    } else if (!(age >= 18 && age <= 110)) {
      toast.error("*Age* should be above or equal 18", {
        position: "top-center",
      });
      return;
    } else if (!/^[a-zA-Z]+$/.test(city)) {
      toast.error("*City* is incorrect (only text)", {
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

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aadharNo,
        email,
        phone,
        gender,
        age,
        city,
        password,
        confirmpass,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, {
            position: "top-center",
          });
        } else {
          // toast.success(data.message, {
          //   position: "top-center",
          // });
          // window.setTimeout(() => {
          //   history.push("/login");
          // }, 1700);
          swal(
            "signed up successfully🎉✨",
            "Kindly check your Email for your Unique_Id (uId)",
            "success"
          );

          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <section className="signup">
        <div className="container mt-5">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form className="register-form" id="register-form">
                <div className="form-group">
                  <label htmlFor="aadharNo">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="number"
                    value={aadharNo}
                    onChange={(e) => setAadharNo(e.target.value)}
                    autoComplete="off"
                    placeholder="Your AadharNo"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email  material-icons-name"></i>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    placeholder="Your Recovery Email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    <i className="zmdi zmdi-phone-in-talk material-icons-name"></i>
                  </label>
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="off"
                    placeholder="Your Mobile No."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">
                    <i className="zmdi zmdi-male-female material-icons-name"></i>
                  </label>
                  {/* <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    autoComplete="off"
                    placeholder="Gender"
                  /> */}
                  <div
                    className="form-group select-option"
                    style={{ marginLeft: "1rem" }}
                  >
                    <select
                      className="form-control"
                      id="exampleFormControlSelect1"
                      ref={form1}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="" disabled selected>
                        Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="age">
                    <i className="zmdi zmdi-walk material-icons-name"></i>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    autoComplete="off"
                    placeholder="Age"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">
                    <i className="zmdi zmdi-pin material-icons-name"></i>
                  </label>
                  {/* <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="off"
                    placeholder="Your City"
                  /> */}
                  <div
                    className="form-group select-option"
                    style={{ marginLeft: "1rem" }}
                  >
                    <select
                      className="form-control "
                      id="exampleFormControlSelect1"
                      ref={form2}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="" disabled selected>
                        City
                      </option>
                      <option value="Vasai">Vasai</option>
                      <option value="Borivali">Borivali</option>
                      <option value="Thane">Thane</option>
                      <option value="Bhiwandi">Bhiwandi</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    placeholder="Your Password"
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
                {/* <div class="form-group"> */}

                {/* </div> */}
              </form>
              <button
                style={{ marginTop: "10px" }}
                class="btn btn-primary btn-lg"
                onClick={() => postData()}
              >
                Register
              </button>
            </div>

            <div className="signup-image">
              <figure>
                <img src={signpic} alt="registration pic" />
              </figure>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "black" }}
              >
                Already have an account?{" "}
                <span style={{ color: "blue" }}>login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default SignUp;
