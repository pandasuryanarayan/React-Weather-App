import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Alert, Skeleton } from '@mui/material';
import SearchBar from './SearchBar';
import WeatherTable from './WeatherTable';
import SelectWeather from './SelectWeather';
import './App.css';

function App() {

  const [weatherData, setWeatherData] = useState(null); // State to handle weather data
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState(null); // State to handle errors
  const [selectedParams, setSelectedParams] = useState([]); // State to handle selected parameters

  const fetchWeather = async (city, params) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY; // Weather API KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=metric`;

    setLoading(true); // Set loading state to true

    try {
      const response =  await axios.get(url);
      setWeatherData(response.data);
      setSelectedParams(params);
      console.log(response.data);
      setError(null);
    } catch (error) {
      setError('No City Found. Please Enter Correct City Name');
      console.error('Error fetching the Weather Data', error);
    } finally {
      setLoading(false); // Set loading state back to false after fetching data
    }
  }

  return (
    <Container className='App'>

    <Typography variant='h3' gutterBottom>
      Simple Weather
    </Typography>
    <SearchBar onSearch={fetchWeather}/>

    {loading ? ( // Conditional rendering based on loading state
        <Skeleton variant='rectanagular' height={400} animation='wave'/>
      ) : error ? ( // Show error message if there is an error
        <Alert severity='error' variant='filled'>{error}</Alert>
      ) : (
        selectedParams.length > 0 ? (
          <SelectWeather weatherData={weatherData} selectedParams={selectedParams} />
        ) : (
          <WeatherTable weatherData={weatherData} />
        )
      )}
    </Container>
  );
}

export default App;
