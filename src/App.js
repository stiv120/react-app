import './App.css';
import { Component } from 'react';
import Home from './components/Home';
import Historial from './components/Historial';
import FormConsultar from './components/FormConsultar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <div>  
        <BrowserRouter>
          <Home />
          <Routes>
            <Route path="/historial/guardar" />
            <Route path="/" element={<FormConsultar/>} />
            <Route path="/historial/ver" element={<Historial/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
