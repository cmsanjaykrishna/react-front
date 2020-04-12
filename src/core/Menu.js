import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Home
        </Link>
      </li>
      {!isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signin")}
              to="/signin"
            >
              Signin
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signup")}
              to="/signup"
            >
              Signup
            </Link>
          </li>
        </>
      )}

      {isAuthenticated() && (
        <>
          <li className="nav-item">
            <a
              className="nav-link"
              style={
                (isActive(history, "/signup"),
                { cursor: "pointer", color: "#fff" })
              }
              onClick={() => signout(() => history.push("/"))}
            >
              Signout
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link">
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                style={{ color: "#fff" }}
              >
                {`${isAuthenticated().user.name}`}
              </Link>
            </a>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
