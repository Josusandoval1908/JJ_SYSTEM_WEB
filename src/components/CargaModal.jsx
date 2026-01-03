import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Asegúrate de haber ejecutado: npm install xlsx

export function CargaModal({ alCerrar, alFinalizarCarga }) {
  const [rutaArchivo, setRutaArchivo] = useState("");
  const [archivoReferencia, setArchivoReferencia] = useState(null);
  const [columnas, setColumnas] = useState({
    codigo: '', descripcion: '', precio: '', costo: '', existencia: '', marca: ''
  });
  const [rango, setRango] = useState({ inicio: '', final: '' });

  // Manejadores de cambios
  const manejarCambioColumna = (e) => {
    const valor = e.target.value.toUpperCase().substring(0, 2);
    setColumnas({ ...columnas, [e.target.name]: valor });
  };

  const manejarCambioRango = (e) => {
    const valor = e.target.value.replace(/\D/g, '').substring(0, 6);
    setRango({ ...rango, [e.target.name]: valor });
  };

  const manejarSeleccion = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setRutaArchivo(archivo.name);
      setArchivoReferencia(archivo);
    }
  };

  const abrirArchivo = () => {
    if (!archivoReferencia) return alert("⚠️ No hay archivo seleccionado.");
    const url = URL.createObjectURL(archivoReferencia);
    window.open(url, '_blank');
  };

  // Función técnica: Convierte letras (A, B, AA) en números de índice (0, 1, 26)
  const letraAIndice = (letra) => {
    if (!letra) return null;
    let col = 0;
    const s = letra.toUpperCase();
    for (let i = 0; i < s.length; i++) {
      col = col * 26 + (s.charCodeAt(i) - 64);
    }
    return col - 1;
  };

  // Lógica principal: Lee el Excel y prepara los datos
  const procesarArchivoExcel = () => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const nombreHoja = workbook.SheetNames[0];
        const hoja = workbook.Sheets[nombreHoja];
        const filas = XLSX.utils.sheet_to_json(hoja, { header: 1 });

        const start = parseInt(rango.inicio) - 1; // Ajuste a índice 0
        const end = rango.final ? parseInt(rango.final) : filas.length;

        const nuevosArticulos = [];

        for (let i = start; i < end; i++) {
          const filaActual = filas[i];
          if (!filaActual || filaActual.length === 0) continue;

          nuevosArticulos.push({
            codigo: String(filaActual[letraAIndice(columnas.codigo)] || ""),
            descrip: String(filaActual[letraAIndice(columnas.descripcion)] || ""),
            pvp_dola: parseFloat(filaActual[letraAIndice(columnas.precio)] || 0),
            costo_dola: parseFloat(filaActual[letraAIndice(columnas.costo)] || 0),
            existencia: parseFloat(filaActual[letraAIndice(columnas.existencia)] || 0),
            marca: String(filaActual[letraAIndice(columnas.marca)] || "")
          });
        }

        if (nuevosArticulos.length === 0) {
          alert("⚠️ No se encontraron datos en el rango especificado.");
          return;
        }

        await enviarAlServidor(nuevosArticulos);

      } catch (error) {
        console.error("Error al procesar:", error);
        alert("❌ Error al leer el contenido del Excel.");
      }
    };

    reader.readAsArrayBuffer(archivoReferencia);
  };

  const enviarAlServidor = async (datos) => {
    try {
      // NOTA: Reemplaza esta URL por la de tu API real
      const response = await fetch('http://localhost:3001/api/actualizar-inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await response.json();

      if (response.ok) {
        alert("✅ Inventario reemplazado con éxito.");
        if (alFinalizarCarga) alFinalizarCarga(); 
        alCerrar();
      } else {
        alert("❌ Error del servidor: " + (resultado.mensaje || "Desconocido"));
      }
    } catch (error) {
      alert("❌ Error crítico: No se pudo conectar con el servidor.");
    }
  };

  const validarYProcesar = () => {
    if (!rutaArchivo) return alert("⚠️ Seleccione un archivo.");
    if (!columnas.codigo || !columnas.descripcion || !columnas.precio || !rango.inicio) {
      return alert("⚠️ Código, Descripción, Precio y Línea Inicio son obligatorios.");
    }
    procesarArchivoExcel();
  };

  return (
    <div style={estilos.overlay}>
      <div style={estilos.modal}>
        <h3 style={estilos.titulo}>Configurar Columnas</h3>
        
        <div style={estilos.contenedorFila}>
          <input type="text" readOnly value={rutaArchivo} placeholder="Archivo..." style={estilos.inputRuta} />
          <label style={estilos.botonIcono}>
            📁 <input type="file" style={{ display: 'none' }} onChange={manejarSeleccion} accept=".csv, .xlsx, .xls" />
          </label>
          <button type="button" onClick={abrirArchivo} style={{...estilos.botonIcono, backgroundColor: '#16a085', border: 'none'}}>👁️</button>
        </div>

        <p style={estilos.subtitulo}>Letras de Columnas (A, B...):</p>
        <div style={estilos.gridMapeo}>
          {Object.keys(columnas).map((campo) => (
            <div key={campo} style={estilos.campoGrupo}>
              <label style={estilos.label}>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</label>
              <input 
                type="text" name={campo} value={columnas[campo]} 
                onChange={manejarCambioColumna} placeholder="-" style={estilos.inputColumnaNegro} 
              />
            </div>
          ))}
        </div>

        <p style={estilos.subtitulo}>Rango de Filas (Números):</p>
        <div style={estilos.gridRango}>
          <div style={estilos.campoGrupoRango}>
            <label style={estilos.label}>Línea Inicio:</label>
            <input 
              type="text" name="inicio" value={rango.inicio} 
              onChange={manejarCambioRango} placeholder="0" style={estilos.inputLargoNegro} 
            />
          </div>
          <div style={estilos.campoGrupoRango}>
            <label style={estilos.label}>Línea Final:</label>
            <input 
              type="text" name="final" value={rango.final} 
              onChange={manejarCambioRango} placeholder="Máx" style={estilos.inputLargoNegro} 
            />
          </div>
        </div>

        <div style={estilos.accionesCentradas}>
          <button onClick={alCerrar} style={estilos.botonCancelar}>Cancelar</button>
          <button onClick={validarYProcesar} style={estilos.botonAceptar}>Aceptar</button>
        </div>
      </div>
    </div>
  );
}

const estilos = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modal: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', width: '95%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', boxSizing: 'border-box' },
  titulo: { marginTop: 0, marginBottom: '15px', color: '#2c3e50', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' },
  subtitulo: { fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d', marginBottom: '8px', marginTop: '10px' },
  contenedorFila: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' },
  inputRuta: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #bdc3c7', backgroundColor: '#f9f9f9', color: '#333', fontWeight: 'bold', fontSize: '13px' },
  botonIcono: { display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '40px', height: '40px', backgroundColor: '#34495e', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' },
  gridMapeo: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  gridRango: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
  campoGrupo: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fdfdfd', padding: '5px 8px', borderRadius: '6px', border: '1px solid #eee' },
  campoGrupoRango: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', color: '#2c3e50', fontWeight: '700' },
  inputColumnaNegro: { width: '35px', padding: '6px 2px', borderRadius: '4px', border: 'none', textAlign: 'center', textTransform: 'uppercase', backgroundColor: '#2c3e50', color: '#ffffff', fontWeight: 'bold', fontSize: '14px', outline: 'none' },
  inputLargoNegro: { width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#2c3e50', color: '#ffffff', fontWeight: 'bold', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  accionesCentradas: { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #eee' },
  botonCancelar: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ecf0f1', border: 'none', borderRadius: '6px', color: '#7f8c8d', fontWeight: 'bold' },
  botonAceptar: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};