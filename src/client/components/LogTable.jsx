import React from "react";
import "./LogTable.css";
import { LogEntry } from "./LogEntry";

export const LogTable = ({ results }) => {
    return (
        <div className="flex-container">
            <table className="results-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Level</th>
                        <th>Message</th>
                        <th>Resource ID</th>
                        <th>Timestamp</th>
                        <th>Trace ID</th>
                        <th>Span ID</th>
                        <th>Commit</th>
                        <th>Parent Resource ID</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <LogEntry
                            key={index}
                            result={result}
                            index={index + 1}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
