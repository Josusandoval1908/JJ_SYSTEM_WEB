import React, { useState } from 'react';

export function Login({ alIngresar }) {
  const [user, setUser] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, clave })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alIngresar(); // Si es correcto, avisamos a App.jsx para que cambie de pantalla
      } else {
        setError(data.message);
      }
    })
    .catch(err => setError("No hay conexión con el servidor"));
  };

  return (
    <div style={estilos.fondo}>
      <form style={estilos.form} onSubmit={manejarEnvio}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>JJ SYSTEM LOGIN</h2>
        <input 
          type="text" 
          placeholder="Usuario" 
          style={estilos.input} 
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          style={estilos.input} 
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        {error && <p style={estilos.error}>{error}</p>}
        <button type="submit" style={estilos.boton}>INGRESAR</button>
      </form>
    </div>
  );
}

const estilos = {
  fondo: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf0f1' },
  form: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '300px' },
  input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  boton: { width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: 'red', fontSize: '14px', textAlign: 'center' }
};