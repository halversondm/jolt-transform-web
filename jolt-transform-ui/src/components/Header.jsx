import {Link, useLocation} from "react-router";
import React from "react";

const Header = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <header className="bg-blue-700 text-white shadow mb-8">
            <nav className="container mx-auto flex items-center justify-between py-4 px-6">
                <div className="text-2xl font-bold tracking-tight">JOLT Transformer</div>
                <ul className="flex space-x-8">
                    <li>
                        <Link
                            to="/"
                            className={
                                isActive("/")
                                    ? "border-b-2 border-white pb-1 font-semibold"
                                    : "hover:underline"
                            }
                        >
                            Transform
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/docs"
                            className={
                                isActive("/docs")
                                    ? "border-b-2 border-white pb-1 font-semibold"
                                    : "hover:underline"
                            }
                        >
                            Documentation
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/build"
                            className={
                                isActive("/build")
                                    ? "border-b-2 border-white pb-1 font-semibold"
                                    : "hover:underline"
                            }
                        >
                            Build Spec
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;