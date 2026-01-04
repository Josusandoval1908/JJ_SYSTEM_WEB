import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

// 1. CONFIGURACIÓN INICIAL
app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 

// 2. CONEXIÓN A BASE DE DATOS (CORREGIDA PARA RENDER/RAILWAY)
// Forzamos el uso de variables de entorno para evitar que busque el localhost de tu PC
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Convertimos a número porque Railway usa el puerto 50959
  port: parseInt(process.env.DB_PORT) || 3306 
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('❌ Error fatal de conexión:', err.message);
    // Este log te dirá en Render qué datos está intentando usar
    console.log('Intentando conectar a:', dbConfig.host, 'Puerto:', dbConfig.port);
    return;
  }
  console.log('✅ Servidor conectado exitosamente a Railway');
});

// 3. RUTA PARA EL LOGIN
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

// 4. RUTA PARA OBTENER ARTÍCULOS
app.get('/api/articulos', (req, res) => {
  const termino = req.query.buscar || ""; 
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

// 5. RUTA ACTUALIZAR INVENTARIO
app.post('/api/actualizar-inventario', (req, res) => {
  const articulos = req.body;
  if (!articulos || articulos.length === 0) return res.status(400).json({ success: false });

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ success: false });

    db.query("DELETE FROM ctainv", (err) => {
      if (err) return db.rollback(() => res.status(500).json({ success: false }));

      const sqlInsert = "INSERT INTO ctainv (codigo, descrip, pvp_dola, costo_dola, marca, existencia) VALUES ?";
      const valores = articulos.map(art => [art.codigo, art.descrip, art.pvp_dola, art.costo_dola, art.marca, art.existencia]);

      db.query(sqlInsert, [valores], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ success: false }));
        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json({ success: false }));
          res.json({ success: true });
        });
      });
    });
  });
});

// 6. INICIO DEL SERVIDOR (PUERTO DINÁMICO PARA RENDER)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});