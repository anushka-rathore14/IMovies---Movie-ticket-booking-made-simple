import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(() => localStorage.getItem('imovies_city') || 'Mumbai');
  const [availableCities, setAvailableCities] = useState(['Mumbai', 'Delhi', 'Bengaluru', 'New York']);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cities = await dbService.getCities();
        if (cities && cities.length) {
          setAvailableCities(cities);
        }
      } catch (e) {
        // use fallback cities
      }
    };
    fetchCities();
  }, []);

  const changeCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem('imovies_city', newCity);
    setIsCityModalOpen(false);
  };

  return (
    <CityContext.Provider
      value={{
        city,
        changeCity,
        availableCities,
        isCityModalOpen,
        setIsCityModalOpen,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
