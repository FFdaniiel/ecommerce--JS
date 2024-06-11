
// variables
const carrito = document.querySelector('#carrito');
const productosContainer = document.querySelector('#productos')
const numerito = document.querySelector('#numero');
const total = document.querySelector('#total');
const productosEnCarritoContainer = document.querySelector('#productosEnElCarrito');
const btnVaciar = document.querySelector('#vaciar-carrito');
const btnComprar = document.querySelector('#comprar');


let productosEnCarrito = JSON.parse(localStorage.getItem('productos-en-carrito')) || []
// Si existe un producto en carrito se actualiza el numero de carrito
if (productosEnCarrito) {
  actualizarNumero();
}


// Eventos

const eventos = () => {
  // Evento para comprar elementos
  btnComprar.addEventListener('click', comprarCarrito);
  // Evento para vaciar los elementos
  btnVaciar.addEventListener('click', vaciarCarrito);

}


// Funciones

// Importando JSON a productos
const traerProductos = async () => {
  try {
    const response = await fetch('./../js/productos.json')
    const producto = await response.json()
    return producto
  } catch (error) {
    console.log(error)
  }
}

// Muestra los productos en el HTML
const crearTarjetaProducto = (producto) => {
  const div = document.createElement("div")
  div.className = "producto"
  div.innerHTML = `
                    <div class="card align-items-center text-center m-2">
                      <img src="${producto.imagen}" class="card-img-top w-75 " alt="...">
                      <div class="card-body d-flex flex-column justify-content-evenly">
                      <h5 class="card-title">${producto.titulo}</h5>
                      <div>
                        <span class="card-precio">Precio: </span>
                        <span class="card-precio">$${producto.precio}</span>
                      </div>
                        <button  id='${producto.id}' class="btn btn-primary productoAgregar">Agregar al Carrito</button>
                      </div >
                    </div >
  
    `
  productosContainer.append(div)
  actualizarBtnAgregar()
}

// Trae los datos importados del JSON
const mostrarTarjetasProductos = async () => {
  const producto = await traerProductos()
  const productos = Object.keys(producto).map(key => ({ id: key, ...producto[key] }))
  productos.forEach(producto => {
    crearTarjetaProducto(producto)
  })
}

// 
const actualizarBtnAgregar = () => {
  const btnAgregar = document.querySelectorAll('.productoAgregar');
  btnAgregar.forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito);
  })
}

const agregarAlCarrito = async (e) => {
  const idBoton = parseInt(e.currentTarget.id)
  const data = await traerProductos()

  const productoAgregado = data.find((producto) => producto.id === idBoton)
  // aumenta la cantidad para no repetir el mismo producto 
  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id == idBoton
    )
    productosEnCarrito[index].cantidad++
  } else {
    productoAgregado.cantidad = 1
    productosEnCarrito.push(productoAgregado)
  }
  Swal.fire({
    text: `Se a añadido ${productoAgregado.titulo}`,
    timer: 2000,
    width: 400,
    icon: "success",
    toast: true,
    position: "top-start",
    showCancelButton: false,
    showConfirmButton: false,
    timerProgressBar: true,
    color: "#fff",
    background: "#E84545",
  })

  actualizarNumero()
  cargarProductosCarrito()
  // Guardando los productos en carrito en localstrorage
  localStorage.setItem(
    'productos-en-carrito',
    JSON.stringify(productosEnCarrito)
  )
}

function actualizarNumero() {
  if (numerito) {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
  }

}

const cargarProductosCarrito = () => {
  if (productosEnCarritoContainer) {

    productosEnCarritoContainer.innerHTML = ''
    productosEnCarrito.forEach(producto => {
      let total = Number(producto.precio).toFixed(3)
      let subtotal = total * producto.cantidad;
      div = document.createElement('div')
      div.classList.add('carrito-producto');
      div.innerHTML = `
                    <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="carrito-producto-titulo">
                        <small>Titulo</small>
                        <h3>${producto.titulo}</h3>
                    </div>
                    <div class= "container-precios">
                        <div class="carrito-producto-precio con-descuento">
                            <small>Precio</small>
                            <p>$${producto.precio.toFixed(2)}</p>
                        </div>
                        <div class="carrito-producto-subtotal">
                            <small>Subtotal</small>
                            <p>$${subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                        <div class = "carrito-container-cantidad">
                            <i id="${producto.id}" class="fa-solid fa-minus resta"></i>
                            <p class="cantidadActual">${producto.cantidad}</p>
                            <i id="${producto.id}" class="fa-solid fa-plus sumar"></i>
                        </div>
                    </div>
                    <button class="carrito-producto-eliminar btn btn-danger" id="${producto.id}"><i class="fa-solid fa-trash"></i></button>
                `;
      productosEnCarritoContainer.append(div);
    })
    eventos()
    actualizarSumarCantidad()
    actualizarRestaCantidad()
    actualizarBtnEliminar()
    actualizarTotal()
  }
}

// actualiza la suma 

function actualizarSumarCantidad() {
  const btnSuma = document.querySelectorAll('.sumar');
  btnSuma.forEach(btn => {
    btn.addEventListener('click', sumarCantidad);
  });
}

function sumarCantidad(e) {
  const idBoton = parseInt(e.currentTarget.id);
  const index = productosEnCarrito.findIndex(producto => producto.id == idBoton);
  productosEnCarrito[index].cantidad = productosEnCarrito[index].cantidad + 1
  cargarProductosCarrito()

  localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
  cargarProductosCarrito()
  actualizarNumero()

}

//  restar cantidad

function actualizarRestaCantidad() {
  const btnResta = document.querySelectorAll('.resta');
  btnResta.forEach(btn => {
    btn.addEventListener('click', restaCantidad);
  });
}

function restaCantidad(e) {
  const idBoton = parseInt(e.currentTarget.id)
  const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
  if (productosEnCarrito[index].cantidad > 1) {
    productosEnCarrito[index].cantidad = productosEnCarrito[index].cantidad - 1;
    cargarProductosCarrito();
    actualizarNumero()

  } else {
  }
  localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
}

// 
function actualizarBtnEliminar() {
  const btnEliminar = document.querySelectorAll('.carrito-producto-eliminar');

  btnEliminar.forEach(boton => {
    boton.addEventListener('click', eliminarDelCarrito);
  })
}

function eliminarDelCarrito(e) {
  Swal.fire({
    text: `Se a Elimino el producto!`,
    timer: 1500,
    width: 400,
    icon: "success",
    toast: true,
    position: "top-start",
    showCancelButton: false,
    showConfirmButton: false,
    timerProgressBar: true,
    color: "#fff",
    background: "#E84545",
  })
  const idBoton = parseInt(e.currentTarget.id)
  const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
  productosEnCarrito.splice(index, 1);
  cargarProductosCarrito()
  actualizarNumero()

  localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
}


function vaciarCarrito() {
  Swal.fire({
    title: '<strong>¿Estás seguro?</u></strong>',
    icon: 'question',
    html:
      `Se van a borrar ${productosEnCarrito.reduce((acc, productos) => acc + productos.cantidad, 0)} productos`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
      'Si',
    cancelButtonText:
      'No',
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito.length = 0;
      localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
      cargarProductosCarrito()
      actualizarNumero()

    }
  })
}

// Actualizar el total
function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
  let numero = Number(totalCalculado.toFixed(3))
  total.innerText = `$${numero} `
}

function comprarCarrito() {
  if (productosEnCarrito.length > 0) {
    Swal.fire({
      title: '<strong>Se va a procesar la compra, ¿estas seguro?</u></strong>',
      icon: 'info',
      html:
        `Se va a procesar la compra de ${productosEnCarrito.reduce((acc, productos) => acc + productos.cantidad, 0)} productos`,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        'Si',
      cancelButtonText:
        'No',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.replace("./../page/form.html");

      }
    })
  }

}

// Función Para iniciar
const productoMain = () => {
  mostrarTarjetasProductos()
  cargarProductosCarrito()
}