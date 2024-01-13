
//Css
import './climaApp.css';

//Icons
import searchIcon from '../assets/search.png';
import clearIcon from '../assets/clear.png';
import cloudIcon from '../assets/cloud.png';
import drizzleIcon from '../assets/drizzle.png';
import humidityIcon from '../assets/humidity.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';
import windIcon from '../assets/wind.png';
import { useState } from 'react';
import { useEffect } from 'react';


export const ClimaApp = () => {

    let apiKey = '95626f79ca9ed6885662694a6f39e7f0';

    const [inputValue, setInputValue] = useState('');
    //const [location, setLocation] = useState('');


    const [climaData, setClimaData] = useState({});
    const [wicon, setWicon] = useState(cloudIcon);
    

    const onInputChange = ({ target }) => {
        setInputValue( target.value );
    }

    const handleSearch = async() => {
        const element = document.getElementsByClassName("cityInput");

        if(element[0].value === '') {
            return 0;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ element[0].value }&units=Metric&appid=${ apiKey }`

        //Solicitud de info a la api
        const response = await fetch(url);
        const data = await response.json();
        //console.log( data );

        if( data.cod === '404' ) {
            alert( data.message );
            setInputValue('');
            return
        }

        const datos = {
            humidity: data.main.humidity,
            wind: Math.floor(data.wind.speed),
            temprature: Math.floor(data.main.temp),
            location: data.name,
            weatherIcon: data.weather[0].icon
        }
        //console.log( datos );

        setClimaData( datos );
        setInputValue('');

        if( (data.weather[0].icon === "01d") || (data.weather[0].icon === "01n") ) {
            setWicon( clearIcon );
        } else if( (data.weather[0].icon === "02d") || (data.weather[0].icon === "02n") ) {
            setWicon( cloudIcon );
        } else if( (data.weather[0].icon === "03d") || (data.weather[0].icon === "03n") ) {
            setWicon( drizzleIcon );
        } else if( (data.weather[0].icon === "04d") || (data.weather[0].icon === "04n") ) {
            setWicon( drizzleIcon );
        } else if( (data.weather[0].icon === "09d") || (data.weather[0].icon === "09n") ) {
            setWicon( rainIcon );
        } else if( (data.weather[0].icon === "10d") || (data.weather[0].icon === "10n") ) {
            setWicon( rainIcon );
        } else if( (data.weather[0].icon === "13d") || (data.weather[0].icon === "13n") ) {
            setWicon( snowIcon );
        } else {
            setWicon( clearIcon );
        }
    }

    useEffect(() => {
        //console.log('algo');
        if("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async(position) => {
                const { latitude, longitude } = position.coords;

                // Llamar a la API de OpenWeatherMap con la clave de API
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=Metric&appid=${apiKey}&lang=es`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    //console.log( data );

                    const datos = {
                        humidity: data.main.humidity,
                        wind: Math.floor(data.wind.speed),
                        temprature: Math.floor(data.main.temp),
                        location: data.name
                    }
                    //console.log( datos );

                    setClimaData( datos );

                    // Obtener el nombre de la ciudad y el estado desde la respuesta
                    //const city = data.name;
                    //const state = data.sys.country;
                } catch (error) {
                    console.error("Error al obtener la ubicación:", error);
                }
            });
        } else {
            console.error("Geolocalización no soportada en este navegador");
        }
    }, []);
    
    return (
        <div className="container">
            <div className="top-bar">
                <input 
                    type="text" 
                    className='cityInput' 
                    placeholder='Search'
                    value={ inputValue }
                    onChange={ onInputChange }
                />
                
                <div className='search-icon' onClick={ () => handleSearch() }>
                    <img src={ searchIcon } alt="search" />
                </div>
            </div>

            <div className="clima-image">
                <img src={ wicon } alt="" />
            </div>

            <div className="clima-temp">{ climaData.temprature }°c</div>
            <div className="clima-location">{ climaData.location }</div>

            <div className='data-container'>
                <div className="element">
                    <img src={ humidityIcon } alt="" className='icon' />
                    <div className="data">
                        <div className="humidity-porcent">{ climaData.humidity }%</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>

                <div className="element">
                    <img src={ windIcon } alt="" className='icon' />
                    <div className="data">
                        <div className="wind-rate">{ climaData.wind } km/h</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
