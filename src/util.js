import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";


const casesTypeColors = {
    cases: {
      // hex: "#FF8C00",
  
      hex: "#696969",
      multiplier: 150,
    },
    recovered: {
      hex: "#228B22",
      multiplier: 150,
    },
    deaths: {
      hex: "#FF0000",
      multiplier:500,
    },
  };

// export const sortData = (data) => {
//     const sortedData = [...data];
//     sortedData.sort((a, b) => {s
//         if (a.cases > b.cases) {
//             return -1;
//         } else {
//             return 1;
//         }
//     })
//     return sortedData;
// }


export const sortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
}



export const prettyPrintStat = (stat) => 
  stat? `${numeral(stat).format("0.0a")}` : "0";


// Draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType="cases") => 

    data.map(country => (
        <Circle center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity = {0.4}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
            Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
        >
            <Popup>
              <div className="info-container"> 
                <div className="info-flag" style={{backgroundImage : `url(${country.countryInfo.flag})`}} />

                <div className="info-name"><strong>{country.country}</strong></div>
                <div className="info-cases"><strong>Cases:</strong> {numeral(country.cases).format("0,0")}</div>
                <div className="info-recovered"><strong>Recovered:</strong> {numeral(country.recovered).format("0,0")}</div>
                <div className="info-deaths"><strong> Deaths:</strong> {numeral(country.deaths).format("0,0")}</div>
              </div>
            </Popup>
            
        </Circle>

    ));

