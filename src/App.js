import React, { useState, useEffect } from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";

import './App.css';
import Header from "./Header";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";





import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});


  // UseEffect runs a piece of code based on a given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then ((data) => {
      setCountryInfo(data);
    });
  },[]);
  

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }));
          setCountries(countries);

        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[CONTRY_CODE]

    const url = countryCode === "worldwide"
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
      setCountry(countryCode);
      
      
    });
  };

  console.log('CountryINFO >>>', countryInfo)
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropDown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* loop through all counteries and show them */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Header />
        {/*Title + select input dopdown field */}

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases = {countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases ={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total ={countryInfo.deaths}/>
        </div>
        
        < Map/>       
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={}/>
          <h3>Worldwide new cases</h3>
          {/*Graph */}
        </CardContent>
          

      </Card>

     

    </div>
  );
}

export default App;
