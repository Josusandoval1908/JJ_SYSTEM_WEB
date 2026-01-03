// Este componente solo se encarga de MOSTRAR un teléfono
export function TarjetaTelefono({ tel, alSeleccionar }) {
  return (
    <div 
      onClick={() => alSeleccionar(tel)}
      style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', cursor: 'pointer' }}
    >
      <img src={tel.img} alt={tel.modelo} style={{ width: '80px' }} />
      <h3>{tel.modelo}</h3>
      <p>{tel.marca}</p>
    </div>
  );
}