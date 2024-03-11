import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container">
        <Link to='/' className="navbar-brand text-white h3">Rєnthunt</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active text-white h3" aria-current="page">Explore</Link>
            </li>
            <li className="nav-item">
              <Link to="/offers" className="nav-link text-white h3">Offers</Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link text-white h3">Profile</Link>
            </li>
          </ul>
        </div>
      </div>
      </nav>
    </>
  )
}

export default Header