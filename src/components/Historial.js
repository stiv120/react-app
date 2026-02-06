import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHistorial();
  }, []);

  const getHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/historial/ver`);
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setHistorial(response.data);
      } else {
        throw new Error("Datos no válidos recibidos de la API.");
      }
    } catch (err) {
      setError("Error al cargar el historial. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = (event) => {
    setBusqueda(event.target.value);
  };

  const handleRefresh = () => {
    setBusqueda("");
    getHistorial();
  };

  const historialFiltrado = historial.filter((item) => {
    const textoBusqueda = busqueda.toLowerCase();
    return Object.values(item).some((valor) =>
      valor?.toString().toLowerCase().includes(textoBusqueda)
    );
  });

  const isTablaVacia = historial.length === 0;
  const isInputDeshabilitado = isTablaVacia;

  return (
    <div className="container p-2">
      <div className="row">
        <div className="col-md-10">
          <div className="input-group">
            <input
              type="text"
              value={busqueda}
              onChange={handleBusqueda}
              className="form-control"
              placeholder="Buscar..."
              disabled={isInputDeshabilitado}
            />
          </div>
        </div>
        <div className="col-md-2 d-grid gap-2">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleRefresh}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <FontAwesomeIcon icon={faSync} className="me-1" />
            )}
            <span>Refrescar</span>
          </button>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="card card-body">
            <h1 className="text-center">Historial de consultas</h1>
            {isTablaVacia ? (
              <p className="text-center">No hay datos para mostrar.</p>
            ) : (
              <table className="table table-responsive-sm tablaHistorial">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">
                      #
                    </th>
                    <th scope="col" className="text-center">
                      Ciudad
                    </th>
                    <th scope="col" className="text-center">
                      Humedad
                    </th>
                    <th scope="col" className="text-center">
                      Fecha de Creación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historialFiltrado.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.ciudad}</td>
                      <td className="text-center">{item.humedad}%</td>
                      <td className="text-center">{item.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;
