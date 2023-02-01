import Map from './Map';
import InfoBox from './InfoBox';
import Table from './Table';
import './App.css';
import {MenuItem,FormControl,Select,Card, CardContent} from "@material-ui/core";
import { useEffect, useState } from 'react';


function App() {
  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState('worldwide');
  const[countryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);



  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    });
  },[])

  useEffect(()=>{
    const getCountriesData=async()=>{                                     //fetch returns a promise
      await fetch("https://disease.sh/v3/covid-19/countries")             //Calling the API
      .then((response)=>response.json())                                  //Data is cleared in format
      .then((data)=>{
        const countries= data.map((country)=>(                            //maps from the huge return json format data
          {
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setTableData(data);
          setCountries(countries);                      //Loop through all the "countries" variables
      });
    };
    getCountriesData();                                 //Re-init the async function
  },[]);                                               //Runs a function under a condition in the [] bracket
  
  const onCountryChange = async(event)=>{
    const countryCode=event.target.value;
    setCountry(countryCode);

    const url=
      countryCode==="worldwide"
        ? "https://disease.sh/v3/covid-19/all"                          //when dropDown world wide then URL
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`     //when dropDown specific country
      await fetch(url)
        .then(response=>response.json())
        .then(data=>{
          setCountry(countryCode);
          setCountryInfo(data);
        })
  };
  
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>


      <FormControl className='app__dropdown'>
      <Select variant='outlined' onChange={onCountryChange} value={country}>      


        <MenuItem value="worldwide">Worldwide</MenuItem>
        {
          countries.map((country)=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))
        }
      </Select>
      </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
        <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
        <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
      </div>
      <Map/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
