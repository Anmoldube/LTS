import React from "react";
import Heros from "./Layout/Heros";

const Layout = ({ children }) => {
  return (
    <>
      <Heros />
      <div className="content">{children}</div>
    </>
  );
};

export default Layout;
