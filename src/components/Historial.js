import axios from "axios";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getHistorial();
  }, []);

  function getHistorial() {
    setLoading(true);
    axios.get("http://localhost:80/api/historial/ver").then(function (response) {
      setHistorial(response?.data);
      setLoading(false);
    });
  }

  function handleBusqueda(event) {
    setBusqueda(event.target.value);
  }

  function handleRefresh() {
    setBusqueda("");
    setLoading(true);
    getHistorial();
  }

  const historialFiltrado = historial.filter((item) => {
    const valores = Object.values(item);
    const textoBusqueda = busqueda.toLowerCase();

    for (let i = 0; i < valores.length; i++) {
      if (valores[i]?.toString().toLowerCase().includes(textoBusqueda)) {
        return true;
      }
    }

    return false;
  });

  const isTablaVacia = historial.length === 0;
  const isInputDeshabilitado = isTablaVacia ? "disabled" : "";

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
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            ) : (
              <FontAwesomeIcon icon={faSync} className="me-1" />
            )}
            <span>Refrescar</span>
          </button>
        </div>
      </div>
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
                  {historialFiltrado.map((historial, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1}</td>
                      <td className="text-center">{historial.ciudad}</td>
                      <td className="text-center">{historial.humedad}%</td>
                      <td className="text-center">{historial.created_at}</td>
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
