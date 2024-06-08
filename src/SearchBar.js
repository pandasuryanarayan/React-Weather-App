import React, { useState } from "react";
import { TextField, Button, Tooltip, Chip } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DoneIcon from '@mui/icons-material/Done';
import './App.css';

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState('');
    const [showParams, setShowParams] = useState(false);
    const [selectedParams, setSelectedParams] = useState([]);

    const handleSearch = () => {
        if (city) {
            onSearch(city, selectedParams);
        }
    };

    const toggleParams = () => {
        setShowParams(!showParams);
    };

    const handleParamSelect = (param) => {
        if (selectedParams.includes(param)) {
            setSelectedParams(selectedParams.filter((item) => item !== param));
        } else {
            setSelectedParams([...selectedParams, param]);
        }
    };

    const handleClearFilters = () => {
        setSelectedParams([]);
        if (city) {
            onSearch(city, []); // Trigger search with no filters
        }
    };

    return (
        <div className="SearchBar">
            <TextField
                required
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <Tooltip title="Customize your weather parameters" arrow>
                            <KeyboardArrowDownIcon
                                onClick={toggleParams}
                                style={{ cursor: 'pointer' }}
                            />
                        </Tooltip>
                    ),
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                style={{ marginLeft: '10px', padding: '10px' }}
            >
                Search
            </Button>
            {showParams && (
                <div className="ParameterChips">
                    {['Temperature', 'Weather', 'Cloudy', 'Visibility', 'Sunrise', 'Sunset'].map((param) => (
                        <Chip
                            key={param}
                            label={param}
                            clickable
                            onClick={() => handleParamSelect(param)}
                            color={selectedParams.includes(param) ? 'primary' : 'default'}
                            style={{ margin: '5px' }}
                            deleteIcon={
                                selectedParams.includes(param) ? (
                                    <DoneIcon style={{ color: 'red' }} />
                                ) : undefined
                            }
                            onDelete={() => handleParamSelect(param)}
                        />
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClearFilters}
                        style={{ marginLeft: '10px', padding: '10px' }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}

export default SearchBar;