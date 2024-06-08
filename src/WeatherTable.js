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

const formatTimezoneOffset = (offsetInSeconds) => {
    const hours = Math.floor(Math.abs(offsetInSeconds) / 3600);
    const minutes = Math.floor((Math.abs(offsetInSeconds) % 3600) / 60);
    const sign = offsetInSeconds >= 0 ? "+" : "-";
    return `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const WeatherTable = ({ weatherData }) => {
    const [tempUnit, setTempUnit] = useState('C');
    const [tempAnchorEl, setTempAnchorEl] = useState(null);
    const [selectedTempParam, setSelectedTempParam] = useState('Temperature');

    const [windUnit, setWindUnit] = useState('m/s');
    const [windAnchorEl, setWindAnchorEl] = useState(null);
    const [selectedWindParam, setSelectedWindParam] = useState('Wind Speed');

    if (!weatherData) return null;

    const timezone = formatTimezoneOffset(weatherData.timezone);
    const sunriseIST = convertToIST(weatherData.sys.sunrise);
    const sunsetIST = convertToIST(weatherData.sys.sunset);

    const toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;
    const toMilesPerHour = (metersPerSecond) => metersPerSecond * 2.23694;

    const getTemperature = (tempInCelsius) => {
        return tempUnit === 'C' ? tempInCelsius : toFahrenheit(tempInCelsius);
    };

    const getWindSpeed = (speedInMetersPerSecond) => {
        return windUnit === 'm/s' ? speedInMetersPerSecond : toMilesPerHour(speedInMetersPerSecond);
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

    const handleWindUnitChange = (event, newUnit) => {
        if (newUnit !== null) {
            setWindUnit(newUnit);
        }
    };

    const handleWindMenuOpen = (event) => {
        setWindAnchorEl(event.currentTarget);
    };

    const handleWindMenuClose = () => {
        setWindAnchorEl(null);
    };

    const handleWindParamSelect = (param) => {
        setSelectedWindParam(param);
        handleWindMenuClose();
    };

    const getSelectedWindValue = () => {
        switch (selectedWindParam) {
            case 'Wind Speed':
                return getWindSpeed(weatherData.wind.speed);
            case 'Wind Degree':
                return weatherData.wind.deg;
            default:
                return getWindSpeed(weatherData.wind.speed);
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
                    <TableRow>
                        <TableCell>City, Country</TableCell>
                        <TableCell align="right">{weatherData.name}, {weatherData.sys.country}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Timezone</TableCell>
                        <TableCell align="right">{timezone}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Weather</TableCell>
                        <TableCell align="right">{weatherData.weather[0].main}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sunrise</TableCell>
                        <TableCell align="right">{sunriseIST} IST</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sunset</TableCell>
                        <TableCell align="right">{sunsetIST} IST</TableCell>
                    </TableRow>
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
                    <TableRow>
                        <TableCell>
                            {selectedWindParam}
                            <Tooltip title="Select wind parameter" arrow>
                                <IconButton onClick={handleWindMenuOpen}>
                                    <ArrowDropDownIcon />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={windAnchorEl}
                                open={Boolean(windAnchorEl)}
                                onClose={handleWindMenuClose}
                            >
                                <MenuItem onClick={() => handleWindParamSelect('Wind Speed')}>Wind Speed</MenuItem>
                                <MenuItem onClick={() => handleWindParamSelect('Wind Degree')}>Wind Degree</MenuItem>
                            </Menu>
                        </TableCell>
                        <TableCell align="right">
                            {selectedWindParam === 'Wind Speed' ? `${getSelectedWindValue().toFixed(2)} ${windUnit}` : `${getSelectedWindValue()} °`}
                            {selectedWindParam === 'Wind Speed' && (
                                <ToggleButtonGroup
                                    value={windUnit}
                                    exclusive
                                    onChange={handleWindUnitChange}
                                    aria-label="wind unit"
                                    size="small"
                                    sx={{ marginLeft: 2 }}
                                >
                                    <ToggleButton
                                        value="m/s"
                                        aria-label="Meters per second"
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
                                        m/s
                                    </ToggleButton>
                                    <ToggleButton
                                        value="mph"
                                        aria-label="Miles per hour"
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
                                        mph
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Humidity</TableCell>
                        <TableCell align="right">{weatherData.main.humidity} %</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Pressure</TableCell>
                        <TableCell align="right">{weatherData.main.pressure} hPa</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Cloudy</TableCell>
                        <TableCell align="right">{weatherData.clouds.all}%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Visibility</TableCell>
                        <TableCell align="right">{(weatherData.visibility) / 1000} km</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WeatherTable;