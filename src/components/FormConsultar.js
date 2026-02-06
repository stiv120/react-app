import axios from "axios";
import VerMapa from "./VerMapa";
import Select from "react-select";
import { llaveApi } from "../Llaves";
import { API_BASE_URL, API_USE_QUERY_PARAMS } from "../config";
import debounce from "lodash.debounce";
import React, { useState, useMemo } from "react";

const FormConsultar = () => {
  const [datosApi, setdatosApi] = useState({
    lat: "",
    lon: "",
    hum: "",
    zoom: null,
    error: null,
    iconoClima: [],
  });

  const [options, setOptions] = useState([]);

  // Implementamos debounce para manejar las solicitudes a la API
  const debouncedFetchCities = useMemo(
    () =>
      debounce(async (inputValue) => {
        if (inputValue.length > 2) {
          try {
            const response = await axios.get(
              "https://api.openweathermap.org/data/2.5/find",
              {
                params: {
                  q: inputValue,
                  appid: llaveApi,
                },
              }
            );

            const ciudades = response.data.list.map((ciudad) => ({
              value: `${ciudad.name},${ciudad.sys.country}`,
              label: `${ciudad.name}, ${ciudad.sys.country}`,
            }));

            setOptions(ciudades);
          } catch (error) {
            console.error("Error fetching cities:", error);
          }
        } else {
          setOptions([]);
        }
      }, 300),
    []
  );

  const handleInputChange = (inputValue) => {
    debouncedFetchCities(inputValue);
  };

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      obtenerDatosApi(selectedOption.value);
    }
  };

  const obtenerDatosApi = async (valorCiudad) => {
    if (valorCiudad) {
      try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${valorCiudad}&appid=${llaveApi}`;
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();

        setdatosApi({
          zoom: 7,
          error: null,
          lon: datos?.coord?.lon,
          lat: datos?.coord?.lat,
          hum: datos?.main?.humidity,
          iconoClima: datos?.weather ? datos?.weather?.shift() : [],
        });

        const guardarUrl = API_USE_QUERY_PARAMS
          ? `${API_BASE_URL}/api/index.php?action=guardar`
          : `${API_BASE_URL}/api/historial/guardar`;
        const response = await axios.post(guardarUrl, JSON.stringify(datos), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Datos guardados en el historial:", response.data);
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
        error: "Por favor selecciona una ciudad.",
      });
    }
  };

  return (
    <div>
      <div className="container p-2">
        <div className="row">
          <div className="col-md-5 mx-auto">
            <div className="card card-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group select-container">
                  <Select
                    name="ciudad"
                    options={options}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre completo de una ciudad."
                    noOptionsMessage={() => "No hay opciones"}
                    isClearable
                  />
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
