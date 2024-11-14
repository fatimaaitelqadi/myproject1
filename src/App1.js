import { Oval } from 'react-loader-spinner'; // Pour afficher un spinner pendant le chargement
import React, { useState } from 'react';
import axios from 'axios'; // Pour effectuer des requêtes HTTP
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons'; // Icône pour afficher un message d'erreur
import './css.css'; // Import du fichier CSS pour le style

function Grp204WeatherApp() {
    const [input, setInput] = useState(''); // Pour stocker la ville saisie par l'utilisateur
    const [weather, setWeather] = useState({
        loading: false, // Si l'application charge les données
        data: {}, // Les données météo
        error: false, // Si une erreur s'est produite
    });

    // Fonction pour formater la date dans un format lisible
    const toDateFunction = () => {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const currentDate = new Date();
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
        return date;
    };

    // Fonction pour effectuer la recherche des données météo
    const search = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setInput('');
            setWeather({ ...weather, loading: true });
            const url = 'https://api.openweathermap.org/data/2.5/weather';
            const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; // Remplacez par votre clé API OpenWeatherMap
            await axios
                .get(url, {
                    params: {
                        q: input,
                        units: 'metric', // Pour obtenir la température en degrés Celsius
                        appid: api_key, // Votre clé API
                    },
                })
                .then((res) => {
                    setWeather({ data: res.data, loading: false, error: false });
                })
                .catch((error) => {
                    setWeather({ ...weather, data: {}, error: true });
                    setInput('');
                });
        }
    };

    return (
        <div className="App">
            <h1 className="app-name">Application Météo grp204</h1>
            <div className="search-bar">
                <input
                    type="text"
                    className="city-search"
                    placeholder="Entrez le nom de la ville..."
                    name="query"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={search} // Recherche lorsque l'utilisateur appuie sur "Entrée"
                />
            </div>
            {weather.loading && (
                <Oval type="Oval" color="black" height={100} width={100} />
            )}
            {weather.error && (
                <span className="error-message">
                    <FontAwesomeIcon icon={faFrown} />
                    <span>Ville introuvable</span>
                </span>
            )}
            {weather && weather.data && weather.data.main && (
                <div>
                    <h2>{weather.data.name}, {weather.data.sys.country}</h2>
                    <span>{toDateFunction()}</span>
                    <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} alt={weather.data.weather[0].description} />
                    <p>{Math.round(weather.data.main.temp)}°C</p>
                    <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
                </div>
            )}
        </div>
    );
}

export default Grp204WeatherApp;
