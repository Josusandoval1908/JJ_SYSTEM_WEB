import React, { useState } from 'react';
import { CargaModal } from './CargaModal';

export function Ctainv({ datos, alCambiarInventario, onLogout }) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div style={estilos.contenedorPrincipal}>
      
      <div style={estilos.filaBotones}>
        <button style={estilos.botonCargar} onClick={() => setMostrarModal(true)}>
          🔄 Cargar Inventario
        </button>
        <button style={estilos.botonSalir} onClick={onLogout}>
          🚪 Cerrar Sesión
        </button>
      </div>

      <div style={estilos.controles}>
        <div style={estilos.buscadorContenedor}>
          <input
            type="search"
            placeholder="🔍 Buscar por código o descripción..."
            style={estilos.inputBusqueda}
            value={busqueda}
            
            onChange={(e) => {
              const valor = e.target.value;
              setBusqueda(valor);
              alCambiarInventario(valor); // Esto dispara la consulta al servidor con cada letra
            }}
          />
        </div>
      </div>
      
      <div style={estilos.gridContenedor}>
        {datos.map((art) => (
          <div key={art.codigo} style={estilos.tarjeta}>
            <div style={estilos.cabecera}>
              {/* CÓDIGO: Más grande y oscuro */}
              <span style={estilos.etiquetaCodigo}>{art.codigo}</span>
            </div>
            
            <div style={estilos.cuerpo}>
              <h4 style={estilos.nombreArticulo}>{art.descrip}</h4>
  
              <div style={estilos.seccionValores}>
                {/* Columna Precio */}
                <div style={estilos.columnaDato}>
                  <span style={estilos.miniLabel}>PRECIO</span>
                  <span style={estilos.precio}>${art.pvp_dola}</span>
                </div>

                {/* Columna Cantidad */}
                  <div style={estilos.columnaDato}>
                    <span style={estilos.miniLabel}>STOCK</span>
                    <span style={{
                      ...estilos.existencia,
                      color: art.existencia > 0 ? '#27ae60' : '#e74c3c'
                      }}>
                    {art.existencia}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <CargaModal 
          alCerrar={() => setMostrarModal(false)} 
          alFinalizarCarga={alCambiarInventario} 
        />
      )}
    </div>
  );
}

const estilos = {
  contenedorPrincipal: { padding: '10px' },
  
  filaBotones: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },

  controles: { marginBottom: '15px' },

  botonCargar: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  botonSalir: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  inputBusqueda: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },

  gridContenedor: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '8px'
  },

  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #e1e8ed',
    display: 'flex',
    flexDirection: 'column',
    height: '140px', // Altura fija pequeña para que todas sean iguales
    justifyContent: 'space-between'
  },

  cabecera: { 
    borderBottom: '1px solid #f0f0f0', 
    marginBottom: '5px', 
    paddingBottom: '2px' 
  },

  etiquetaCodigo: { 
    fontSize: '13px',       // Un poco más grande
    fontWeight: '900',      // Más negrita
    color: '#1a1a1a',       // Color muy oscuro (casi negro)
    letterSpacing: '0.5px'
  },

  nombreArticulo: { 
    margin: '0 0 8px 0', 
    color: '#444', 
    fontSize: '0.75rem', 
    textTransform: 'uppercase',
    display: '-webkit-box',
    WebkitLineClamp: '2', 
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.2',
    minHeight: '2.4em'
  },

// CONTENEDOR DE LAS DOS COLUMNAS
  seccionValores: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '6px',
    marginTop: 'auto'
  },

  columnaDato: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centra el texto y el valor
    flex: 1
  },

  miniLabel: {
    fontSize: '9px',      // Muy pequeño para que no estorbe
    fontWeight: 'bold',
    color: '#95a5a6',
    marginBottom: '2px'
  },

  precio: { 
    fontSize: '15px', 
    fontWeight: 'bold', 
    color: '#2ecc71' 
  },

  existencia: { 
    fontSize: '14px', 
    fontWeight: 'bold' 
  }
};