import React, { useState } from "react";
import "./SearchBarMini.css";
import { SearchBar } from "./SearchBar";

export const SearchBarMini = ({ handleQuery, placeVal, propName }) => {
    return (
        <div className="search-bar-mini">
            <h3 className="label">{placeVal}:</h3>
            <SearchBar
                handleQuery={handleQuery}
                placeVal={placeVal}
                propName={propName}
            />
        </div>
    );
};
