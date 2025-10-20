import React from "react";
import {BrowserRouter as Router, Link, Route, Routes, useLocation} from "react-router";
import TransformPage from "./TransformPage";
import DocumentationPage from "./DocumentationPage";
import BuildPage from "./BuildPage";
import "./components/JsonEditorWithLineNumbers.css";

function Header() {
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

function App() {
    return (
        <Router>
            <Header/>
            <main className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<TransformPage/>}/>
                    <Route path="/build" element={<BuildPage/>}/>
                    <Route path="/docs/*" element={<DocumentationPage/>}/>
                </Routes>
            </main>
        </Router>
    );
}

export default App;
