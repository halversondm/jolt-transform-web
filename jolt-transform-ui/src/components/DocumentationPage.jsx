import React from "react";
import {Route, Routes} from "react-router";
import ShiftDoc from "./ShiftDoc";
import DefaultrDoc from "./DefaultrDoc";
import RemovrDoc from "./RemovrDoc";
import CardinalityDoc from "./CardinalityDoc";
import SortDoc from "./SortDoc";
import CustomDoc from "./CustomDoc";
import DocumentationMenu from "./DocumentationMenu";

const DocumentationPage = () => {
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
