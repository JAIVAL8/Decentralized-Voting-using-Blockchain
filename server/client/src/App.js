import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

const Routing = () => {
  return (
    <Switch>
      {/* < Route exact path="/">
        <Home />
      </Route> */}
      <Route path="/Login">
        <Login />
      </Route>
      <Route path="/Signup">
        <SignUp />
      </Route>
    </Switch>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
