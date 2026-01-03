CREATE TABLE configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rif VARCHAR(50) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    correo VARCHAR(100)
);