import React, { useState } from 'react';
import { CargaModal } from './CargaModal';

export function Ctainv({ datos, alCambiarInventario }) {
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);

  // Lógica de filtrado inteligente que ya teníamos
  const datosFiltrados = datos.filter((art) => {
    const busquedaLimpia = busqueda.toLowerCase().trim();
    if (!busquedaLimpia) return true;

    const palabrasBusqueda = busquedaLimpia.split(/\s+/);
    const textoArticulo = `${art.codigo} ${art.descrip}`.toLowerCase();

    return palabrasBusqueda.every(palabra => textoArticulo.includes(palabra));
  });

  return (
    <div style={estilos.contenedorPrincipal}>
      
      {/* SECCIÓN DE CONTROLES (Botón + Buscador) */}
      <div style={estilos.controles}>
        
        {/* BOTÓN CARGAR INVENTARIO */}
        <button 
          style={estilos.botonCargar} 
          onClick={() => setMostrarModal(true)}
        >
          🔄 Cargar Inventario
        </button>

        {/* BUSCADOR */}
        <div style={estilos.buscadorContenedor}>
          <input
            type="search"
            placeholder="🔍 Buscar por código o descripción..."
            style={estilos.inputBusqueda}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div style={estilos.conteo}>
            Mostrando {datosFiltrados.length} artículos
          </div>
        </div>
      </div>
      
      {/* GRID DE ARTÍCULOS */}
      <div style={estilos.gridContenedor}>
        {datosFiltrados.map((art) => (
          <div key={art.codigo} style={estilos.tarjeta}>
            <div style={estilos.cabecera}>
              <span style={estilos.etiquetaCodigo}>CÓDIGO: {art.codigo}</span>
            </div>
            
            <div style={estilos.cuerpo}>
              <h4 style={estilos.nombreArticulo}>{art.descrip}</h4>
              <div style={estilos.infoFila}>
                <span style={estilos.label}>Precio:</span>
                <span style={estilos.precio}>${art.pvp_dola}</span>
              </div>
              <div style={estilos.infoFila}>
                <span style={estilos.label}>Stock:</span>
                <span style={{
                  ...estilos.existencia,
                  color: art.existencia > 0 ? '#27ae60' : '#e74c3c'
                }}>
                  {art.existencia} {art.existencia > 0 ? 'Disponible' : 'Sin Stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <<< COLÓCALO JUSTO AQUÍ >>> */}
      {mostrarModal && (
        <CargaModal 
        alCerrar={() => setMostrarModal(false)} 
        alFinalizarCarga={alCambiarInventario} // <--- Agrega esta línea
        />
      )}

      {datosFiltrados.length === 0 && datos.length > 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#95a5a6' }}>
          No se encontraron resultados para "{busqueda}"
        </p>
      )}
    </div>
  );
}

const estilos = {
  contenedorPrincipal: { padding: '10px' },
  controles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
    alignItems: 'stretch'
  },

  botonCargar: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 16px',         // Más bajo y estrecho
    borderRadius: '8px',          // Bordes un poco más suaves
    border: 'none',
    fontSize: '14px',             // Fuente un poco más pequeña y profesional
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: 'fit-content',         // <--- CLAVE: Solo el ancho del contenido
    alignSelf: 'flex-start',      // Lo alinea a la izquierda
    display: 'flex',
    alignItems: 'center',
    gap: '5px',                   // Espacio entre el icono y el texto
    transition: 'background-color 0.3s'
  },
  buscadorContenedor: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  inputBusqueda: {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: '2px solid #bdc3c7',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  conteo: { fontSize: '12px', color: '#7f8c8d', paddingLeft: '5px' },
  gridContenedor: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px'
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e1e8ed'
  },
  cabecera: { borderBottom: '1px solid #f0f0f0', marginBottom: '10px', paddingBottom: '5px' },
  etiquetaCodigo: { fontSize: '11px', fontWeight: 'bold', color: '#95a5a6' },
  nombreArticulo: { margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1rem', textTransform: 'uppercase' },
  infoFila: { display: 'flex', justifyContent: 'space-between', padding: '3px 0' },
  label: { color: '#95a5a6', fontSize: '14px' },
  precio: { fontSize: '18px', fontWeight: 'bold', color: '#2ecc71' },
  existencia: { fontSize: '16px', fontWeight: '600' }
};