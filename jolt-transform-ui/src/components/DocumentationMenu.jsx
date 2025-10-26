import {Link, useLocation} from "react-router";
import React from "react";

const DocumentationMenu = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <nav className="mb-8 border-b pb-2">
            <ul className="flex space-x-6">
                <li>
                    <Link
                        to="/docs/shift"
                        className={
                            isActive("/docs/shift")
                                ? "font-bold text-blue-700"
                                : "hover:underline"
                        }
                    >
                        Shift
                    </Link>
                </li>
                <li>
                    <Link
                        to="/docs/default"
                        className={
                            isActive("/docs/default")
                                ? "font-bold text-blue-700"
                                : "hover:underline"
                        }
                    >
                        Default
                    </Link>
                </li>
                <li>
                    <Link
                        to="/docs/remove"
                        className={
                            isActive("/docs/remove")
                                ? "font-bold text-blue-700"
                                : "hover:underline"
                        }
                    >
                        Remove
                    </Link>
                </li>
                <li>
                    <Link
                        to="/docs/cardinality"
                        className={
                            isActive("/docs/cardinality")
                                ? "font-bold text-blue-700"
                                : "hover:underline"
                        }
                    >
                        Cardinality
                    </Link>
                </li>
                <li>
                    <Link
                        to="/docs/sort"
                        className={
                            isActive("/docs/sort")
                                ? "font-bold text-blue-700"
                                : "hover:underline"
                        }
                    >
                        Sort
                    </Link>
                </li>
                <li>
                    <Link
                        to="/docs/custom"
                        className={
                            isActive("/docs/custom")
                                ? "font-bold text-blue-700"
                                : "hover:underline"
                        }
                    >
                        Custom
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default DocumentationMenu;