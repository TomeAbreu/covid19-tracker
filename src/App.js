import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import "./App.css";
import InfoBox from "./Components/InfoBox";

function App() {
  //State = How to write a variable in React we use hooks instead of variables
  //Hook useSteate for list of countries
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);

  //Hook UseEffect => Runs a piece of code based on a given condition that is a dependency list in the 2nd argument of the function
  //If the dependency list is empty: the code run just once after component loads and never more
  //If there is a variable in the list then the code runs when the component loads and when the variable value changes
  useEffect(() => {
    //Async function to get the list of countries and their data
    const getCountriesData = async () => {
      const res = await fetch("https://disease.sh/v3/covid-19/countries");
      const contriesData = await res.json();
      const countries = contriesData.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      setCountries(countries);
    };
    //Call async function to loadd the countries
    getCountriesData();
  }, []);

  //Select onChange async function
  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app_header">
        <h1>Hello</h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem key="Worldwide" value="worldwide">
              Worldwide
            </MenuItem>
            {/* Loope through all the countries and show them in in options */}
            {countries.map((country) => (
              <MenuItem key={country.name} value={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="app_stats">
        <InfoBox title="Coronavirus Cases" cases={10} total={2000} />
        <InfoBox title="Cases" cases={20} total={2000} />
        <InfoBox title="Deaths" cases={30} total={2000} />
      </div>

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
