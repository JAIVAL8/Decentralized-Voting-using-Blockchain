import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { UserContext } from "../App";

function Navbar() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            <button
              className="btn btn-dark"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
            >
              Logout
            </button>
          </Link>
        </li>,
      ];
    } else {
      return [
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            <h5>Login</h5>
          </Link>
        </li>,
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            <h5>Signup</h5>
          </Link>
        </li>,
      ];
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to={state ? "/" : "/login"}>
          <h3>VoteChain</h3>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
            {renderList()}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/login">
                <h5>Login</h5>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                <h5>Signup</h5>
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
