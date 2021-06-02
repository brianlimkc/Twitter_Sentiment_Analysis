import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="ui three item menu">
        <NavLink to="/recent" className="item" >
        Recent Tweet Search
        </NavLink>
        <NavLink to="/rules" className="item" >
        Manage Rules
        </NavLink>
        <NavLink to="/tweets" className="item" >
        Tweet Stream
        </NavLink>

    </div>
  );
};

export default Navbar;
