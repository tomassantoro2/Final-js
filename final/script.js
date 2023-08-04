const productosUrl = 'productos.json';

const productoSeleccionado = document.getElementById('productoSeleccionado');
const carritoLista = document.getElementById('carritoLista');
const totalCompra = document.getElementById('totalCompra');
const metodoPagoSeleccionado = document.getElementById('metodoPagoSeleccionado');
const cuotasInfo = document.getElementById('cuotasInfo');
const mensajeResultado = document.getElementById('mensajeResultado');
const btnAgregarCarrito = document.getElementById('btnAgregarCarrito');
const btnCalcular = document.getElementById('btnCalcular');

let productos = [];
let carrito = [];
let metodoDePago = 1; // Billetera 

function generarOpcionesProductos() {
  productos.forEach(producto => {
    const option = document.createElement('option');
    option.value = producto.nombre;
    option.textContent = producto.nombre;
    productoSeleccionado.appendChild(option);
  });
}
const cargarProductos = () => {
    fetch(productosUrl)
      .then(response => response.json())
      .then(data => {
        productos = data;
        generarOpcionesProductos();
      })
      .catch(error => console.error('Error al cargar productos:', error));
  };
function actualizarCarrito() {
  carritoLista.innerHTML = '';
  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - Cantidad: ${item.cantidad}`;
    carritoLista.appendChild(li);
  });
}

function calcularTotal() {
  let total = 0;
  carrito.forEach(item => {
    const producto = productos.find(p => p.nombre === item.nombre);
    total += producto.precio * item.cantidad;
  });
  return total;
}

function actualizarTotalCompra() {
  const total = calcularTotal();
  totalCompra.textContent = total.toFixed(2);

  //  mensaje de cuotas
  const cuotasMensaje = metodoDePago === 2 ? `6 Cuotas de $${(total * 1.25 / 6).toFixed(2)}` :
                        metodoDePago === 3 ? `12 Cuotas de $${(total * 1.5 / 12).toFixed(2)}` :
                        '';
  cuotasInfo.textContent = cuotasMensaje;
}

function aplicarDescuento(importe) {
  switch (metodoDePago) {
    case 1: // Billetera (descuento del 30%)
      return importe * 0.7;
    case 2: // 6 Cuotas (interés del 25%)
      return importe * 1.25;
    case 3: // 12 Cuotas (interés del 50%)
      return importe * 1.5;
    case 4: // Un Pago (descuento del 10%)
      return importe * 0.9;
    default:
      return importe;
  }
}

function mostrarMensaje(mensaje, tipo) {
  mensajeResultado.textContent = mensaje;
  mensajeResultado.className = tipo;
}

btnAgregarCarrito.addEventListener('click', () => {
  const selectedProduct = productoSeleccionado.value;
  const existingItem = carrito.find(item => item.nombre === selectedProduct);

  if (existingItem) {
    existingItem.cantidad++;
  } else {
    carrito.push({ nombre: selectedProduct, cantidad: 1 });
  }

  actualizarCarrito();
  actualizarTotalCompra();
});

btnCalcular.addEventListener('click', () => {
  const total = calcularTotal();
  const importeFinal = aplicarDescuento(total);
  mostrarMensaje(`Total de la compra: $${total.toFixed(2)} - Importe final: $${importeFinal.toFixed(2)}`, 'resultado');
});

metodoPagoSeleccionado.addEventListener('change', () => {
  metodoDePago = parseInt(metodoPagoSeleccionado.value);
  actualizarTotalCompra();
});

// Ejecutar la función de carga de productos
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});
