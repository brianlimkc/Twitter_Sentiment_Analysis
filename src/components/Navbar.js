import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="ui three item menu">
        <NavLink to="/recent" className="item" >
        Recent Tweets Search
        </NavLink>
        <NavLink to="/rules" className="item" >
        Set Rules for Tweet Stream
        </NavLink>
        <NavLink to="/tweets" className="item" >
        View Tweet Stream
        </NavLink>

    </div>
  );
};

export default Navbar;
