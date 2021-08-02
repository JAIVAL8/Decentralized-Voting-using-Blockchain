import React from "react";
import { Link } from "react-router-dom";
import signpic from "../images/signup.svg";

function SignUp() {
  return (
          <section className="signup">
            <div className="container mt-5">
              <div className="signup-content">
                <div className="signup-form">
                    <h2 className="form-title">Sign up</h2>  
                    <form className="register-form" id="register-form">
                      
                      <div className="form-group">
                        <label htmlFor="name">
                          <i class="zmdi zmdi-account material-icons-name"></i>
                        </label>
                        <input type="text" name="name" id="name" autoComplete="off" 
                          placeholder="Your Name"/>     
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">
                          <i class="zmdi zmdi-email  material-icons-name"></i>
                        </label>
                        <input type="email" name="email" id="email" autoComplete="off" 
                          placeholder="Your Email"/>     
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">
                          <i class="zmdi zmdi-phone-in-talk material-icons-name"></i>
                        </label>
                        <input type="number" name="phone" id="phone" autoComplete="off" 
                          placeholder="Your Phone"/>     
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">
                          <i class="zmdi zmdi-lock material-icons-name"></i>
                        </label>
                        <input type="password" name="password" id="password" autoComplete="off" 
                          placeholder="Your Password"/>     
                      </div>

                      <div className="form-group">
                        <label htmlFor="cpassword">
                          <i class="zmdi zmdi-lock material-icons-name"></i>
                        </label>
                        <input type="password" name="cpassword" id="cpassword" autoComplete="off" 
                          placeholder="Confirm Your Password"/>     
                      </div>

                      
                      <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-lg">Register</button>
                       </div>

                    
                    </form> 
                  </div>

                    <div className="signup-image">
                      <figure>
                        <img src={signpic} alt="registration pic"/>
                      </figure>
                      <Link to="/Login">Already have an account?</Link>
                    </div>
                

              </div>
            </div>  

          </section>
   
    
    
  );
}

export default SignUp;





