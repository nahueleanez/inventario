document.addEventListener('DOMContentLoaded', async () => {
    const tablaProductos = document.getElementById('tablaProductos');
    const contenedorCampoEditar = document.getElementById('contenedorCampoEditar');
    const selectCampoEditar = document.getElementById('campoEditar');

    let productoModificado = '';
    let precioModificado = 0;
    let descripcionModificada = '';
    let stockModificado = '';

    const mostrarProductos = async () => {
        tablaProductos.innerHTML = '';
        try {
            const response = await fetch('http://localhost:3000/productos');
            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }
            const productos = await response.json();

            const rows = productos.map(producto => `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.producto}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>
                        <button class="btn btnModificar" data-id="${producto.id}">Editar</button>
                        <button class="btn btnBorrar" data-id="${producto.id}">Eliminar</button>
                    </td>
                </tr>
            `).join('');

            tablaProductos.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            `;

            asignarEventosModificar();
            asignarEventosBorrar();

        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const formularioNuevoProducto = document.getElementById('formularioNuevoProducto');
    formularioNuevoProducto.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(formularioNuevoProducto);
        const nuevoProducto = {
            producto: formData.get('producto'),
            descripcion: formData.get('descripcion'),
            precio: parseFloat(formData.get('precio')),
            stock: parseInt(formData.get('stock'))
        };
        try {
            const response = await fetch('http://localhost:3000/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            });

            const result = await response.json();
            console.log(result);

            await mostrarProductos();

            formularioNuevoProducto.reset();
        } catch (error) {
            console.error('Error al comunicarse con el servidor:', error);
        }
    });

    const asignarEventosModificar = () => {
        const botonesModificar = document.querySelectorAll('.btnModificar');
        botonesModificar.forEach(btn => {
            btn.addEventListener('click', async () => {
                console.log('Clic en Editar');
                const id = btn.dataset.id;

                contenedorCampoEditar.style.display = 'block';

                selectCampoEditar.addEventListener('change', async (event) => {
                    console.log('cambio en el select');
                    const campoEditar = event.target.value;

                    let nuevoValor;
                    if (campoEditar === 'descripcion' || campoEditar === 'producto') {
                        nuevoValor = prompt(`Ingrese el nuevo valor para ${campoEditar}:`);
                    } else {
                        nuevoValor = parseFloat(prompt(`Ingrese el nuevo valor para ${campoEditar}:`));
                    }

                    const datosAEnviar = {};
                    datosAEnviar[campoEditar] = nuevoValor;

                    await editarProducto(id, campoEditar, nuevoValor);

                    contenedorCampoEditar.style.display = 'none';
                });
            });
        });
    };

    const asignarEventosBorrar = () => {
        const botonesBorrar = document.querySelectorAll('.btnBorrar');
        botonesBorrar.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await eliminarProducto(id);
            });
        });
    };

    const editarProducto = async (id, campo, valor) => {
        console.log('Campo:', campo);
        console.log('Valor:', valor);

        const confirmacion = confirm('¿Estás seguro de editar este producto?');
        if (confirmacion) {
            try {
                const response = await fetch(`http://localhost:3000/productos/${id}`);
                const productoActual = await response.json();

                const bodyData = {
                    producto: productoActual.producto,
                    descripcion: productoActual.descripcion,
                    precio: productoActual.precio,
                    stock: productoActual.stock
                };

                bodyData[campo] = valor;

                const responsePut = await fetch(`http://localhost:3000/productos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)
                });

                const result = await responseok.json();
                console.log(result);

                await mostrarProductos();
            } catch (error) {
                console.error('Error al editar el producto:', error);
            }
        }
    };

    const eliminarProducto = async (id) => {
        const confirmacion = confirm('¿Estás seguro de eliminar este producto?');
        if (confirmacion) {
            try {
                const response = await fetch(`http://localhost:3000/productos/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();
                console.log(result);

                await mostrarProductos();
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        }
    };

    await mostrarProductos();
});
