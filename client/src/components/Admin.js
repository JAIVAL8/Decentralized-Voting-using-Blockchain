import React, { useContext, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";

export const Admin = () => {
  const history = useHistory();
  useLayoutEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).isAdmin === false) {
      history.push("/");
    }
  }, []);

  return <div>Hii</div>;
};
