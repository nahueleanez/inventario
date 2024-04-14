CREATE DATABASE productos_inventario;
USE productos_inventario;

CREATE TABLE productos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	producto VARCHAR(255) NOT NULL,
	descripcion TEXT,
	precio DECIMAL(10, 2) NOT NULL,
	stock INT NOT NULL
);

SELECT * FROM productos;