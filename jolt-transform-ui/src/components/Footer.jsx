import React from "react";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer
            role="contentinfo"
            aria-label="Site footer"
            className="w-full bg-transparent text-gray-600 py-4"
        >
            <div className="max-w-screen-lg mx-auto px-4 text-center">
                <span className="text-sm">
                    © {year} <a href="https://halversondm.com" target="_blank">halversondm.com</a>
                </span>
            </div>
        </footer>
    );
};

export default Footer;

