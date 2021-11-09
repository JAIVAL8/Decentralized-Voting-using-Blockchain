import React, { useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

import { reducer, initialState } from "./reducers/userReducer";
import Reset from "./components/Reset";
import NewPassword from "./components/NewPassword";
import CandidateList from "./components/CandidateList";
import Dashboard from "./components/Dashboard";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/reset-password")) {
        history.push("/login");
      }
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <CandidateList />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/reset-password">
        <Reset />
      </Route>
      <Route path="/reset-password/:token">
        <NewPassword />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
