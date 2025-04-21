import './App.css'
import { PrimeReactProvider } from "primereact/api"
import CRUDAutorizacion from './Components/CRUDAutorizacion'
import CRUDUnidadResponsable from './Components/CRUDUnidadResponsable'
import CRUDRol from './Components/CRUDRol'
import CRUDUsuario from './Components/CRUDUsuario'
import ListaUnidadResponsable from './Components/ListaUnidadResponsable'
//import ListaPlanificacion from './Components/ListaPlanificacion'
import ListaAutorizacion from './Components/ListaAutorizacion'
import ListaUsuario from './Components/ListaUsuario'
import ListaRol from './Components/ListaRol'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Head from './Components/Head'

function App() {
  
  return (
    <PrimeReactProvider>
      <BrowserRouter>
      <Head/>
          <Routes>
            <Route path="/" element={<ListaUnidadResponsable />} />
            <Route path="/listaUnidadResponsable" element={<ListaUnidadResponsable />} />
            <Route path="/listaAutorizacion" element={<ListaAutorizacion />} />
            <Route path="/listaRol" element={<ListaRol />} />
            <Route path="/listaUsuario" element={<ListaUsuario />} />
            <Route path="/UnidadResponsable" element={<CRUDUnidadResponsable />} />
            <Route path="/Rol" element={<CRUDRol />} />
            <Route path="/Usuario" element={<CRUDUsuario />} />
            <Route path="/Autorizacion" element={<CRUDAutorizacion />} />
          </Routes>
      </BrowserRouter>
    </PrimeReactProvider>  
  )
}
export default App
