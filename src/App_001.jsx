import { useState, useEffect } from 'react'
import { Ctainv } from './components/ctainv'
import { Login } from './components/Login'

function App() {
  const [articulos, setArticulos] = useState([]);
  const [estaLogueado, setEstaLogueado] = useState(false);

  const obtenerArticulos = () => {
    fetch('http://localhost:3001/api/articulos')
      .then(res => res.json())
      .then(data => setArticulos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando inventario:", err));
  };

  useEffect(() => {
    if (estaLogueado) {
      obtenerArticulos();
    }
  }, [estaLogueado]);

  // --- LÓGICA DE RENDERIZADO ---

  // 1. Si NO está logueado, mostramos el componente Login
  if (!estaLogueado) {
    return <Login alIngresar={() => setEstaLogueado(true)} />;
  }

  // 2. Si YA está logueado, mostramos el inventario
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <header style={{ 
        textAlign: 'center', 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        position: 'relative'
      }}>
        <h1 style={{ margin: 0 }}>JJ System Web 🚀</h1>
        <button 
          onClick={() => setEstaLogueado(false)} 
          style={estilos.botonCerrar}>
          Cerrar Sesión
        </button>
      </header>

      <Ctainv datos={articulos} alCambiarInventario={obtenerArticulos} />
    </div>
  );
}

const estilos = {
  botonCerrar: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default App;