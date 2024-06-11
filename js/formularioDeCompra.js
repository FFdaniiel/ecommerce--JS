const compraProductosForm = document.querySelector('#compraProductosForm');

document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Mostrar el mensaje de confirmación
    document.getElementById('enviar').style.display = 'block';
    // let timerInterval;
    Swal.fire({
        title: "Se ha realizado la compra con éxito!",
        icon: 'success',
        html: "Va a cerrarse <b></b>.",
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        }
    });
    productosEnCarrito.length = 0;
    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
    cargarProductosCarrito()
    actualizarNumero()
    // Redirigir después de 2 segundos
    setTimeout(() => {

        window.location.replace("./../index.html");

    }, 3000);
})


const cargarProductosForm = () => {
    compraProductosForm.innerHTML = ''
    productosEnCarrito.forEach((producto) => {
        let total = Number(producto.precio).toFixed(3)
        let subtotal = total * producto.cantidad
        div = document.createElement('div')
        div.classList.add('productoForm')
        div.innerHTML = `
                    <img class="carrito-producto-imagen" src="${producto.imagen
            }" alt="${producto.titulo}">
                    <div class="carrito-producto-titulo">
                        <small>Titulo</small>
                        <h3>${producto.titulo}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <p>${producto.cantidad}</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <p>$${subtotal.toFixed(2)}</p>
                    </div>
                    <div></div>
                    
                `
        compraProductosForm.append(div)
    })
}

cargarProductosForm()