import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'


function Navbar() {
  return (
  <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
        <li className="nav-item">
             <a className="nav-link" href="/Login">Login</a>
           </li>
           <li className="nav-item">
             <a className="nav-link" href="/Signup">SignUp</a>
           </li>
        </ul>
      </div>
    </nav>
  </div>
  )
}

export default Navbar;
  // <nav className="navbar navbar-expand-lg navbar-light bg-light">
  //   <div className="container-fluid">
  //     <a className="navbar-brand" href="#"><h1>F-votechain</h1></a>
  //     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  //       <span className="navbar-toggler-icon"></span>
  //     </button>
  //     <div className="collapse navbar-collapse" id="navbarSupportedContent">
  //       <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
  //         <li className="nav-item">
  //           <a className="nav-link" href="/Login">Login</a>
  //         </li>
  //         <li className="nav-item">
  //           <a className="nav-link" href="/Signup">SignUp</a>
  //         </li>
  //       </ul>
  //     </div>
  //   </div>
  //  </nav>
  // );
/*
<div>
      <nav>
        <div class="nav-wrapper black">
          <Link to="/" class="brand-logo left">
            Vote-Chain
          </Link>
          <ul id="nav-mobile" class="right">
            <li>
              <Link to="/sign-in">Sign in</Link>
            </li>
            <li>
              <Link to="/sign-up">Sign up</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
*/