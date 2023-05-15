import axios from "axios";
import VerMapa from './VerMapa';
import { llaveApi } from '../Llaves';
import React, { useEffect, useState } from "react";

const FormConsultar = () => {
  
  const [datosApi, setdatosApi] = useState({
    lat: '',
    lon: '',
    hum: '',
    zoom: null,
    error: null,
    iconoClima: []
  });

  const [datosCiudades, setDatosCiudades] = useState([]);

  useEffect(() => {
    obtenerCiudades();
  }, []);

  const obtenerCiudades = () => {
    axios.get("http://localhost:80/api/ciudad/cargar-ciudades")
      .then(function (response) {
        setDatosCiudades(response?.data);
      })
      .catch(function (error) {
        console.log('Error al obtener las ciudades:', error);
      });
  };

  const obtenerDatosApi = async (e) => {
    e.preventDefault();
    const { ciudad } = e.target.elements;
    const valorCiudad = ciudad.value;

    if (valorCiudad !== "") {
      try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${valorCiudad}&appid=${llaveApi}`;
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();

        setdatosApi({
          zoom: 6,
          error: null,
          lon: datos?.coord?.lon,
          lat: datos?.coord?.lat,
          hum: datos?.main?.humidity,
          iconoClima: datos?.weather ? datos?.weather?.shift() : []
        });

        axios.post("http://localhost:80/api/historial/guardar", JSON.stringify(datos))
          .then(() => {
            console.log("Datos guardados en el historial");
          });
      } catch (error) {
        console.log("Error al obtener los datos de la API:", error);
      }
    } else {
      setdatosApi({
        lat: "",
        lon: "",
        hum: "",
        zoom: null,
        iconoClima: [],
        error: "Por favor selecciona una ciudad."
      });
    }
  };

  return (
    <div>
      <div className='container p-2'>
        <div className='row'>
          <div className='col-md-4 mx-auto'>
            <div className="card card-body">
              <form onSubmit={obtenerDatosApi}>
                <div className="form-group">
                  <select name="ciudad" className="form-control">
                    <option value="">Selecciona una ciudad.</option>
                    {datosCiudades.map((dato, index) => (
                      <option key={dato?.codigo_nombre}>{dato?.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <br />
                  <div className="d-grid gap-2">
                    <button className="btn btn-md btn-success">Consultar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <VerMapa {...datosApi} />
    </div>
  );
};

export default FormConsultar;
