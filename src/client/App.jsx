import "./App.css";
import { TimeBar } from "./components/TimeBar";
import { SearchBar } from "./components/SearchBar";
import { LogTable } from "./components/LogTable";
import { SearchBarMini } from "./components/SearchBarMini";
import { useState } from "react";

const API_URL = "https://localhost:3000";

const App = () => {
    const [query, setQuery] = useState({
        level: "",
        message: "",
        resourceId: "",
        timestamp: "",
        traceId: "",
        spanId: "",
        commit: "",
        metadata: {
            parentResourceId: "",
        },
    });
    const [results, setResults] = useState([]);
    const [tableResults, setTableResults] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isTimeDuration, setIsTimeDuration] = useState(false);
    const [isButtonActive, setIsButtonActive] = useState(true);

    const handleQuery = (propName, value) => {
        let currentQuery = query;
        if (propName.includes("time")) {
            console.log(propName);
            currentQuery[propName] = new Date(value).toISOString();
        } else currentQuery[propName] = value;
        setQuery(currentQuery);
    };

    const handleSubmit = async () => {
        setIsButtonActive(false);
        let queryParams = { after: {}, data: {} };
        for (var prop in query) {
            if (prop === "metadata") {
                if (query.metadata.parentResourceId !== "") {
                    let metadata = {
                        parentResourceId: "",
                    };
                    metadata.parentResourceId = query.metadata.parentResourceId;
                    queryParams.data.metadata = metadata;
                }
            } else if (query[prop] !== "") queryParams.data[prop] = query[prop];
        }
        console.log(queryParams);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(queryParams),
        };
        fetch("http://localhost:3000/logs", options)
            .then((response) => response.json())
            .then((json) => {
                if (Array.isArray(json.data)) {
                    try {
                        const data = [];
                        json.data.forEach((log) => {
                            data.push(log.data);
                        });
                        console.log(data);
                        setTableResults(data);
                        setResults(data);
                    } catch (error) {
                        console.log(error.message);
                    }
                    setIsButtonActive(true);
                } else console.log(json);
            })
            .catch((err) => console.error(err));
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    return (
        <div id="App">
            <h1 className="title">Log Explorer</h1>
            <div className="search-bar">
                <SearchBar
                    handleQuery={handleQuery}
                    placeVal={"Message"}
                    propName={"message"}
                />
            </div>
            <div className="flex-container">
                <SearchBarMini
                    handleQuery={handleQuery}
                    placeVal={"Level"}
                    propName={"level"}
                />
                <SearchBarMini
                    handleQuery={handleQuery}
                    placeVal={"Resource ID"}
                    propName={"resourceId"}
                />
                <SearchBarMini
                    handleQuery={handleQuery}
                    placeVal={"Trace ID"}
                    propName={"traceId"}
                />
                <SearchBarMini
                    handleQuery={handleQuery}
                    placeVal={"Span ID"}
                    propName={"spanId"}
                />
                <SearchBarMini
                    handleQuery={handleQuery}
                    placeVal={"Commit"}
                    propName={"commit"}
                />
                <SearchBarMini
                    handleQuery={handleQuery}
                    placeVal={"Parent Resource ID"}
                    propName={"metadata.parentResourceId"}
                />
            </div>
            <div className="flex-container">
                <TimeBar
                    handleQuery={handleQuery}
                    placeVal={isTimeDuration ? "TimeStart" : "TimeStamp"}
                    propName={isTimeDuration ? "timestart" : "timestamp"}
                />
                {isTimeDuration && (
                    <TimeBar
                        handleQuery={handleQuery}
                        placeVal={"TimeEnd"}
                        propName={"timeend"}
                    />
                )}
            </div>
            <button
                disabled={!isButtonActive}
                id="submit-button"
                onClick={handleSubmit}
            >
                Submit
            </button>
            {results && results.length > 0 && (
                <LogTable results={tableResults} />
            )}
        </div>
    );
};

export default App;
