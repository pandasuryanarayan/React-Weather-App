import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip,
    Menu, MenuItem, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './App.css';

const convertToIST = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = {
        timeZone: 'Asia/Kolkata', // IST timezone
        weekday: 'short', // Display short weekday name
        year: 'numeric', // Display full year
        month: 'short', // Display short month name
        day: 'numeric', // Display day of the month
        hour12: true, // Use 12-hour format
        hour: 'numeric', // Display hours
        minute: 'numeric', // Display minutes
        second: 'numeric', // Display seconds
    };
    return date.toLocaleString('en-IN', options);
};

const SelectWeather = ({ weatherData, selectedParams }) => {
    const [tempUnit, setTempUnit] = useState('C');
    const [tempAnchorEl, setTempAnchorEl] = useState(null);
    const [selectedTempParam, setSelectedTempParam] = useState('Temperature');

    const sunriseIST = convertToIST(weatherData.sys.sunrise);
    const sunsetIST = convertToIST(weatherData.sys.sunset);

    if (!weatherData) return null;

    const toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

    const getTemperature = (tempInCelsius) => {
        return tempUnit === 'C' ? tempInCelsius : toFahrenheit(tempInCelsius);
    };

    const handleTempUnitChange = (event, newUnit) => {
        if (newUnit !== null) {
            setTempUnit(newUnit);
        }
    };

    const handleTempMenuOpen = (event) => {
        setTempAnchorEl(event.currentTarget);
    };

    const handleTempMenuClose = () => {
        setTempAnchorEl(null);
    };

    const handleTempParamSelect = (param) => {
        setSelectedTempParam(param);
        handleTempMenuClose();
    };

    const getSelectedTempValue = () => {
        switch (selectedTempParam) {
            case 'Temperature':
                return getTemperature(weatherData.main.temp);
            case 'Feels Like':
                return getTemperature(weatherData.main.feels_like);
            case 'Temperature Min':
                return getTemperature(weatherData.main.temp_min);
            case 'Temperature Max':
                return getTemperature(weatherData.main.temp_max);
            default:
                return getTemperature(weatherData.main.temp);
        }
    };

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 435 }} className="TableContainer">
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selectedParams.includes('Temperature') && (
                        <TableRow>
                            <TableCell>
                                {selectedTempParam}
                                <Tooltip title="Select temperature parameter" arrow>
                                    <IconButton onClick={handleTempMenuOpen}>
                                        <ArrowDropDownIcon />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={tempAnchorEl}
                                    open={Boolean(tempAnchorEl)}
                                    onClose={handleTempMenuClose}
                                >
                                    <MenuItem onClick={() => handleTempParamSelect('Temperature')}>Temperature</MenuItem>
                                    <MenuItem onClick={() => handleTempParamSelect('Feels Like')}>Feels Like</MenuItem>
                                    <MenuItem onClick={() => handleTempParamSelect('Temperature Min')}>Temperature Min</MenuItem>
                                    <MenuItem onClick={() => handleTempParamSelect('Temperature Max')}>Temperature Max</MenuItem>
                                </Menu>
                            </TableCell>
                            <TableCell align="right">
                                {getSelectedTempValue().toFixed(2)} &deg;{tempUnit}
                                <ToggleButtonGroup
                                    value={tempUnit}
                                    exclusive
                                    onChange={handleTempUnitChange}
                                    aria-label="temperature unit"
                                    size="small"
                                    sx={{ marginLeft: 2 }}
                                >
                                    <ToggleButton
                                        value="C"
                                        aria-label="Celsius"
                                        sx={{
                                            '&.Mui-selected': {
                                                color: 'white',
                                                backgroundColor: 'red',
                                                '&:hover': {
                                                    backgroundColor: 'darkred',
                                                },
                                            },
                                        }}
                                    >
                                        &deg;C
                                    </ToggleButton>
                                    <ToggleButton
                                        value="F"
                                        aria-label="Fahrenheit"
                                        sx={{
                                            '&.Mui-selected': {
                                                color: 'white',
                                                backgroundColor: 'red',
                                                '&:hover': {
                                                    backgroundColor: 'darkred',
                                                },
                                            },
                                        }}
                                    >
                                        &deg;F
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </TableCell>
                        </TableRow>
                    )}
                    {selectedParams.includes('Weather') && (
                        <TableRow>
                            <TableCell>Weather</TableCell>
                            <TableCell align="right">{weatherData.weather[0].main}</TableCell>
                        </TableRow>
                    )}
                    {selectedParams.includes('Cloudy') && (
                        <TableRow>
                            <TableCell>Cloudy</TableCell>
                            <TableCell align="right">{weatherData.clouds.all}%</TableCell>
                        </TableRow>
                    )}
                    {selectedParams.includes('Visibility') && (
                        <TableRow>
                            <TableCell>Visibility</TableCell>
                            <TableCell align="right">{weatherData.visibility / 1000} km</TableCell>
                        </TableRow>
                    )}
                    {selectedParams.includes('Sunrise') && (
                        <TableRow>
                            <TableCell>Sunrise</TableCell>
                            <TableCell align="right">{sunriseIST}</TableCell>
                        </TableRow>
                    )}
                    {selectedParams.includes('Sunset') && (
                        <TableRow>
                            <TableCell>Sunset</TableCell>
                            <TableCell align="right">{sunsetIST}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SelectWeather;
