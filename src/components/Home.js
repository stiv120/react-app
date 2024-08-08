import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand">Api React con PHP</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Consultar Ciudades</NavLink >
                        </li>
                        <li className="nav-item">
                            <NavLink to="/historial/ver" className="nav-link">Historial</NavLink >
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Home;
