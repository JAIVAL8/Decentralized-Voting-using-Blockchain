import React from "react";
import { Link } from "react-router-dom";
import loginpic from "../images/login.svg";


function Login() {
  return (
    <>
        <section className="sign-in">
            <div className="container mt-5">
                <div className="signin-content">

                    <div className="signin-image">
                      <figure>
                        <img src={loginpic} alt="registration pic"/>
                      </figure>
                      <Link to="/Signup">Create an account?</Link>
                    </div>
                    <div className="signin-form">
                        <h2 className="form-title">Log In</h2>  
                        <form className="register-form" id="register-form">
                        
                        
                        
                        <div className="form-group">
                            <label htmlFor="email">
                            <i class="zmdi zmdi-email  material-icons-name"></i>
                            </label>
                            <input type="email" name="email" id="email" autoComplete="off" 
                            placeholder="Your Email"/>     
                        </div>

                       

                        <div className="form-group">
                            <label htmlFor="password">
                            <i class="zmdi zmdi-lock material-icons-name"></i>
                            </label>
                            <input type="password" name="password" id="password" autoComplete="off" 
                            placeholder="Your Password"/>     
                        </div>

                       

                        
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary btn-lg">Log-in</button>
                        </div>

                    
                     </form> 
                    </div>

                    
                </div>

              
            </div>  

        </section>
    </>
)

}

export default Login;


