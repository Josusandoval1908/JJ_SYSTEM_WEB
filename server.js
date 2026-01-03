import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
// Aumentamos el límite para permitir cargar archivos de excel grandes
app.use(express.json({ limit: '50mb' })); 

// Usamos process.env para que en Render lea la base de datos de internet
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1', 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jjsystem',
  port: process.env.DB_PORT || 3308
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a MariaDB:', err);
    return;
  }
  console.log('✅ Servidor conectado a MariaDB (jjsystem)');
});

// 2. RUTA PARA EL LOGIN
app.post('/api/login', (req, res) => {
  const { user, clave } = req.body;
  const sql = "SELECT * FROM usuarios WHERE user = ? AND clave = ?";
  
  db.query(sql, [user, clave], (err, result) => {
    if (err) {
      console.error("Error en consulta login:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
    if (result.length > 0) {
      console.log(`👤 Usuario ${user} ha iniciado sesión`);
      res.json({ success: true, usuario: result[0].user });
    } else {
      res.json({ success: false, message: "Usuario o clave incorrectos" });
    }
  });
});



// 3. RUTA PARA OBTENER ARTÍCULOS
app.get('/api/articulos', (req, res) => {
  const termino = req.query.buscar || ""; // Recibe lo que escribes en el buscador
  
  // Buscamos por código O por descripción
  const sql = `
    SELECT codigo, descrip, pvp_dola, existencia 
    FROM ctainv 
    WHERE codigo LIKE ? OR descrip LIKE ? 
    LIMIT 100`;

  const wildCard = `%${termino}%`;

  db.query(sql, [wildCard, wildCard], (err, result) => {
    if (err) {
      console.error("Error al buscar:", err);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json(result);
  });
});




// --- NUEVA SECCIÓN: CARGAR EXCEL Y REEMPLAZAR INVENTARIO ---
app.post('/api/actualizar-inventario', (req, res) => {
  const articulos = req.body;

  if (!articulos || articulos.length === 0) {
    return res.status(400).json({ success: false, mensaje: "No se recibieron datos" });
  }

  // Usamos una transacción para asegurar que si algo falla, no se borre el inventario anterior
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ success: false, mensaje: "Error de transacción" });

    // 1. Vaciamos la tabla
    db.query("DELETE FROM ctainv", (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ success: false, mensaje: "Error al limpiar tabla" });
        });
      }

      // 2. Preparamos la inserción masiva
      const sqlInsert = "INSERT INTO ctainv (codigo, descrip, pvp_dola, costo_dola, marca, existencia) VALUES ?";
      
      // Transformamos el objeto de React en una matriz para mysql2
      const valores = articulos.map(art => [
        art.codigo, 
        art.descrip, 
        art.pvp_dola, 
        art.costo_dola, 
        art.marca, 
        art.existencia
      ]);

      db.query(sqlInsert, [valores], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error al insertar:", err);
            res.status(500).json({ success: false, mensaje: "Error al insertar nuevos datos" });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ success: false, mensaje: "Error al confirmar cambios" });
            });
          }
          console.log(`📦 Inventario actualizado: ${articulos.length} registros cargados.`);
          res.json({ success: true, mensaje: "Inventario reemplazado con éxito" });
        });
      });
    });
  });
});

// 4. INICIO DEL SERVIDOR
app.listen(3001, () => {
  console.log("🚀 Servidor unificado corriendo en el puerto 3001");
});