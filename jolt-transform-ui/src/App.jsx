import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router";
import TransformPage from "./components/TransformPage";
import DocumentationPage from "./components/DocumentationPage";
import BuildPage from "./components/BuildPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
    return (
        <Router>
            <Header/>
            <main className="min-h-auto bg-gray-100">
                <Routes>
                    <Route path="/" element={<TransformPage/>}/>
                    <Route path="/build" element={<BuildPage/>}/>
                    <Route path="/docs/*" element={<DocumentationPage/>}/>
                </Routes>
            </main>
            <Footer/>
        </Router>
    );
}

export default App;
