// SearchBar.js
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./TimeBar.css";

export const TimeBar = ({ handleQuery, placeVal, propName }) => {
    const [input, setInput] = useState("");

    return (
        <div className="search-bar-mini">
            <h3 className="label">{placeVal}:</h3>
            <div className="input-wrapper">
                <FaSearch id="bar-icon" size={20} />
                <input
                    type="date"
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
