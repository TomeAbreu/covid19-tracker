import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./App.css";
import InfoBox from "./Components/InfoBox/InfoBox";
import Map from "./Components/Map/Map";
import Table from "./Components/Table/Table";
import { sortData, prettyPrintStat } from "./utils/util";
import LineGraph from "./Components/LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
   //State = How to write a variable in React we use hooks instead of variables
   //Hook useSteate for list of countries
   const [countries, setCountries] = useState([]);
   const [country, setCountry] = useState("worldwide");
   const [countryInfo, setCountryInfo] = useState({});
   const [tableData, setTableData] = useState([]);
   const [mapCenter, setMapCenter] = useState([34.80746, -404796]);
   const [mapZoom, setMapZoom] = useState(3);
   const [mapCountries, setMapCountries] = useState([]);
   const [casesType, setCasesType] = useState("cases");
   const [isLoading, setLoading] = useState(false);

   //Get Worldwide Info as soon as app loads so dependecy list is empty because we only want this to load when component loads and set CountryInfo variale
   useEffect(() => {
      const getWorldwideData = async () => {
         const res = await fetch("https://disease.sh/v3/covid-19/all");
         const worldWideData = await res.json();
         setCountryInfo(worldWideData);
      };

      getWorldwideData();
   }, []);
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
         //Add table info of all countries
         const sortedData = sortData(contriesData);
         setTableData(sortedData);
         setMapCenter([34.80746, -40.4796]);
         //Set map variable
         setMapCountries(contriesData);
      };
      //Call async function to loadd the countries
      getCountriesData();
   }, []);

   //Select onChange async function
   const onCountryChange = async (event) => {
      setLoading(true);
      const countryCode = event.target.value;
      setCountry(countryCode);

      //Get All Country Data of Country Selected
      const url =
         countryCode === "worldwide"
            ? "https://disease.sh/v3/covid-19/all"
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      //Make request to get that country data
      const response = await fetch(url);
      const countryData = await response.json();
      setLoading(false);

      setCountryInfo(countryData);

      //Set Map centered to the country choosen and set zoom
      countryCode === "worldwide"
         ? setMapCenter([34.80746, -40.4796])
         : setMapCenter([
              countryData.countryInfo.lat,
              countryData.countryInfo.long,
           ]);
      setMapZoom(6);
   };

   return (
      <div className="app">
         <div className="app_left">
            <div className="app_header">
               <h1>Covid 19 Tracker</h1>
               <FormControl className="app_dropdown">
                  <Select
                     variant="outlined"
                     value={country}
                     onChange={onCountryChange}
                  >
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
               <InfoBox
                  isRed
                  active={casesType === "cases"}
                  className="infoBox__cases"
                  onClick={(e) => setCasesType("cases")}
                  title="Coronavirus Cases"
                  total={numeral(countryInfo.cases).format("0,0")}
                  cases={prettyPrintStat(countryInfo.todayCases)}
                  isloading={isLoading}
               />
               <InfoBox
                  active={casesType === "recovered"}
                  className="infoBox__recovered"
                  onClick={(e) => setCasesType("recovered")}
                  title="Recovered"
                  total={numeral(countryInfo.recovered).format("0,0")}
                  cases={prettyPrintStat(countryInfo.todayRecovered)}
                  isloading={isLoading}
               />
               <InfoBox
                  isGrey
                  active={casesType === "deaths"}
                  className="infoBox__deaths"
                  onClick={(e) => setCasesType("deaths")}
                  title="Deaths"
                  total={numeral(countryInfo.deaths).format("0,0")}
                  cases={prettyPrintStat(countryInfo.todayDeaths)}
                  isloading={isLoading}
               />
            </div>
            {/* Map */}
            <Map
               countries={mapCountries}
               casesType={casesType}
               center={mapCenter}
               zoom={mapZoom}
            />
         </div>
         <Card className="app_right">
            <CardContent>
               {/* Table */}
               <h3 className="app_LivecasesTitle">Live Cases By Country</h3>
               <Table countries={tableData}></Table>

               {/* Graph */}
               <h3 className="app_graphTitle">WorldWide New {casesType}</h3>
               <LineGraph className="app_graph" casesType={casesType} />
            </CardContent>
         </Card>
      </div>
   );
}

export default App;
