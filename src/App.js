import React, { useState, useEffect } from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";
import {sortData, prettyPrintStat} from "./util";

import './App.css';
import Header from "./Header";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";




import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const[tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat:30, lng:10});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);



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
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }));

          let sortedData = sortData(data);
        
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);

        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[CONTRY_CODE]

    const url = 
      countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setCountry(countryCode);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      
      
    });
  };


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
          <InfoBox 
          active={casesType === 'cases'} 
          onClick={(event) => setCasesType('cases')}
           title="Coronavirus Cases" 
           cases = {prettyPrintStat(countryInfo.todayCases)} 
           total={prettyPrintStat(countryInfo.cases)} />

          <InfoBox 
          active={casesType === 'recovered'}
          onClick={(event) => setCasesType('recovered')}
           title="Recovered" 
           cases ={prettyPrintStat(countryInfo.todayRecovered)} 
           total={prettyPrintStat(countryInfo.recovered)} />

          <InfoBox 
          active={casesType === 'deaths'}
          onClick={(event) => setCasesType('deaths')}
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total ={prettyPrintStat(countryInfo.deaths)}/>
        </div>
        
        < Map 
        countries={mapCountries}
        casesType={casesType}
        center={mapCenter} 
        zoom={mapZoom}/>       
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType}/>
        </CardContent >


      </Card>

     
s
    </div>
  );
}

export default App;
