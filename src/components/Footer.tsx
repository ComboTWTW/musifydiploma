import React from "react";
import { NavLink } from "react-router-dom";
import { logoMain } from "../assets/assets";

const Footer = () => {
    return (
        <nav className="w-full bg-border flex flex-col items-center justify-center  py-10 mt-20">
            <div className="max-w-360 w-full flex items-center justify-between px-4">
                {/* Logo */}
                <NavLink to={"/"} reloadDocument>
                    <img src={logoMain} alt="Logo" className="max-w-42" />
                </NavLink>
                {/* Powered by */}

                {/* Author */}
                <h2 className="font-poppins text-xl font-semibold text-whiteMain">
                    Arthur M — 2026
                </h2>
            </div>
        </nav>
    );
};

export default Footer;
