// SearchBar.js
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ handleQuery, placeVal, propName }) => {
    const [input, setInput] = useState("");

    return (
        <div>
            <div className="input-wrapper">
                <FaSearch id="bar-icon" size={20} />
                <input
                    value={input}
                    placeholder={placeVal}
                    onChange={(e) => {
                        setInput(e.target.value);
                        handleQuery(propName, e.target.value);
                    }}
                />
            </div>
        </div>
    );
};
