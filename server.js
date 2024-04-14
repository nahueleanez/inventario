// Este es un ejemplo de una aplicación backend utilizando Node.js y MySQL para gestionar un inventario de productos.
// Se utiliza Express como framework para crear el servidor y gestionar las rutas.
// El código se encarga de manejar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los productos del inventario.

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'productos_inventario',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ error: 'Error al obtener productos' });
      return;
    }
    res.json(result);
  });
});

app.post('/productos', (req, res) => {
  const { producto, descripcion, precio, stock } = req.body;
  db.query(
    'INSERT INTO productos (producto, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
    [producto, descripcion, precio, stock],
    (err, result) => {
      if (err) {
        console.error('Error al crear un nuevo producto:', err);
        res.status(500).json({ error: 'Error al crear un nuevo producto' });
        return;
      }
      const nuevoProducto = {
        id: result.insertId,
        producto,
        descripcion,
        precio,
        stock
      };
      res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
    }
  );
});

app.delete('/productos/:id', (req, res) => {
  const productId = req.params.id;
  db.query('DELETE FROM productos WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      res.status(500).json({ error: 'Error al eliminar el producto' });
      return;
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  });
});

app.put('/productos/:id', (req, res) => {
  const productId = req.params.id;
  const { producto, descripcion, precio, stock } = req.body;

  const updatedFields = {};
  if (producto !== undefined) updatedFields.producto = producto;
  if (descripcion !== undefined) updatedFields.descripcion = descripcion;
  if (precio !== undefined) updatedFields.precio = precio;
  if (stock !== undefined) updatedFields.stock = stock;

  db.query(
    'UPDATE productos SET ? WHERE id = ?',
    [updatedFields, productId],
    (err, result) => {
      if (err) {
        console.error('Error al modificar el producto:', err);
        res.status(500).json({ error: 'Error al modificar el producto' });
        return;
      }
      res.json({ message: 'Producto modificado exitosamente' });
    }
  );
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Error de sintaxis en JSON' });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.options('*', cors());

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
