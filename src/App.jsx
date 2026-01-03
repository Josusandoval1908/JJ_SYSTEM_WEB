import { useState, useEffect } from 'react'
import { Ctainv } from './components/ctainv'
import { Login } from './components/Login'

function App() {
  const [articulos, setArticulos] = useState([]);
  const [estaLogueado, setEstaLogueado] = useState(false);

  // --- CAMBIO 1: Definir la URL de la API dinámicamente ---
  // Esto intentará leer la variable de Render, si no existe, usará localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const obtenerArticulos = (textoABuscar = "") => {
    // --- CAMBIO 2: Usar la constante API_URL en el fetch ---
    fetch(`${API_URL}/api/articulos?buscar=${textoABuscar}`)
      .then(res => {
        if (!res.ok) throw new Error("Error en la red");
        return res.json();
      })
      .then(data => {
        setArticulos(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error cargando inventario:", err);
        setArticulos([]);
      });
  };

  useEffect(() => {
    if (estaLogueado) {
      obtenerArticulos();
    }
  }, [estaLogueado]);

  if (!estaLogueado) {
    return <Login alIngresar={() => setEstaLogueado(true)} />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <header style={estilos.headerSimple}>
        <h1 style={{ margin: 0 }}>JJ System Web 🚀</h1>
      </header>

      <Ctainv 
        datos={articulos} 
        alCambiarInventario={obtenerArticulos}
        onLogout={() => setEstaLogueado(false)}
      />
    </div>
  );
}

const estilos = {
  headerSimple: { 
    textAlign: 'center', 
    backgroundColor: '#2c3e50', 
    color: 'white', 
    padding: '20px', 
    borderRadius: '10px', 
    marginBottom: '20px' 
  }
};

export default App;