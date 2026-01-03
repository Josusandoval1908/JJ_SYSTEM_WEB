import { useState, useEffect } from 'react'
import { Ctainv } from './components/ctainv'
import { Login } from './components/Login'

function App() {
  const [articulos, setArticulos] = useState([]);
  const [estaLogueado, setEstaLogueado] = useState(false);

  const obtenerArticulos = (textoABuscar = "") => {
    // El "?buscar=" permite que el servidor filtre en la base de datos
    fetch(`http://localhost:3001/api/articulos?buscar=${textoABuscar}`)
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

  // 1. Si NO está logueado
  if (!estaLogueado) {
    return <Login alIngresar={() => setEstaLogueado(true)} />;
  }

  // 2. Si YA está logueado
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
} // <--- Aquí quitamos el punto y coma sobrante

// --- ESTO ES LO QUE FALTABA Y CAUSABA EL ERROR ---
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