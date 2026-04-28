import { NavLink } from "react-router-dom";
import { logoMain } from "../assets/assets";
import { navbarButtons, navLinks } from "../constants/constValues";
import SearchBar from "./Navbar/SearchBar";

const Navbar = () => {
    return (
        <nav className="w-full bg-border flex flex-col items-center px-4 py-2">
            <div className="max-w-360 w-full flex items-center justify-evenly">
                {/* Logo */}
                <NavLink to={"/"} reloadDocument>
                    <img src={logoMain} alt="Logo" className="max-w-42" />
                </NavLink>
                {/* NavbarLinks */}
                <ul className="text-whiteMain flex text-[16px] font-medium font-poppins gap-9">
                    {navLinks.map((link, index) => {
                        return (
                            <NavLink
                                to={link.path}
                                key={link.id}
                                reloadDocument
                            >
                                <li className="hover:underline hover:underline-offset-2 ">
                                    {link.title}
                                </li>
                            </NavLink>
                        );
                    })}
                </ul>
                {/* SearchBar Component and SignIn Buttons*/}
                <div className="flex gap-9 items-center">
                    <SearchBar />
                    <ul className="flex gap-3">
                        {navbarButtons.map((button, index) => {
                            return (
                                <NavLink to={button.path} reloadDocument>
                                    <li
                                        className={`border-purpleMain border border-solid ${button.id === "signup" ? "bg-purpleMain" : "bg-border"} rounded-[10px] text-whiteMain font-inter font-light py-2.5 px-9 `}
                                    >
                                        {button.title}
                                    </li>
                                </NavLink>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
