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


/*

<div class="login-form">
  <form action="/examples/actions/confirmation.php" method="post">
    <h2 class="text-center">Log in</h2>   
    <div class="form-group">
      <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">
                    <span class="fa fa-user"></span>
                </span>                    
            </div>
            <input type="text" class="form-control" name="username" placeholder="Username" required="required"/>				
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">
                    <i class="fa fa-lock"></i>
                </span>                    
            </div>
            <input type="password" class="form-control" name="password" placeholder="Password" required="required"/>				
        </div>
    </div>        
    <div class="form-group">
        <button type="submit" class="btn btn-primary login-btn btn-block">Log in</button>
    </div>
    <div class="clearfix">
        <label class="float-left form-check-label"><input type="checkbox"/> Remember me</label>
        <Link to="#" class="float-right">Forgot Password?</Link>
    </div>
    <div class="or-seperator"><i>or</i></div>
    <p class="text-center">Login with your social media account</p>
    <div class="text-center social-btn">
        <Link to="/" class="btn btn-secondary"><i class="fa fa-facebook"></i>&nbsp; Facebook</Link>
        <Link to="/" class="btn btn-info"><i class="fa fa-twitter"></i>&nbsp; Twitter</Link>
  <Link to="/" class="btn btn-danger"><i class="fa fa-google"></i>&nbsp; Google</Link>
    </div>
</form> 
<p class="text-center text-muted small">Don't have an account? <Link to="/signin">Sign up here!</Link></p>
</div>
*/