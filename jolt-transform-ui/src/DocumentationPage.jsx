import React from "react";
import {Link, Route, Routes, useLocation} from "react-router";
import ShiftDoc from "./components/ShiftDoc";
import DefaultrDoc from "./components/DefaultrDoc";
import RemovrDoc from "./components/RemovrDoc";
import CardinalityDoc from "./components/CardinalityDoc";
import SortDoc from "./components/SortDoc";
import CustomDoc from "./components/CustomDoc";

function DocumentationMenu() {
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

function DocumentationPage() {
    return (
        <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Documentation</h1>
            <p>The official JOLT documentation can be found at: <a href="https://github.com/bazaarvoice/jolt" target="_blank">JOLT GitHub</a></p>
            <br/>
            <DocumentationMenu />
            <Routes>
                <Route path="/shift" element={<ShiftDoc />}/>
                <Route path="/default" element={<DefaultrDoc />}/>
                <Route path="/remove" element={<RemovrDoc/>}/>
                <Route path="/cardinality" element={<CardinalityDoc/>}/>
                <Route path="/sort" element={<SortDoc/>}/>
                <Route path="/custom" element={<CustomDoc/>}/>
                <Route
                    index
                    element={<div>Select a topic from the menu above.</div>}
                />
            </Routes>
        </div>
    );
}

export default DocumentationPage;
