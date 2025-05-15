document.addEventListener("DOMContentLoaded", function () {
    const productContainer = document.getElementById('productContainer')
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then((data) => {
            data.categories.forEach((product) => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.strCategoryThumb}" alt="${product.strCategory}}">
                    </div>
                    <h2 class="product-title">${product.strCategory}</h2>
                    <p class="product-p">${product.strCategoryDescription.substring(0, 100) + '...'}</p>
                    <button>Agregar al carrito</button>
                    `;
                productContainer.appendChild(productCard);
                productCard.getElementsByTagName("button")[0].addEventListener("click", () => agregarCarrito(product));
            });
        })
        .catch(error => {
            console.error('Error No Carga api correctamente', error);
            productContainer.innerHTML = 'ERROR :No estan disponibles los productos';
        });
});
 function agregarCarrito(product) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(item => item.strCategory === product.strCategory);

    if (index > -1) {
      carrito[index].cantidad += 1;
    } else {

      const productoParaCarrito = {
        strCategory: product.strCategory,
        strCategoryThumb: product.strCategoryThumb,
        cantidad: 1
      };
      carrito.push(productoParaCarrito);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarNumeroCarrito();
}


  function mostrarCarrito() {
    const contenedor = document.getElementById("productContainer");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    mostrandoCarrito = true;
    if (!Array.isArray(carrito) || carrito.length === 0) {
      contenedor.innerHTML = "<p style='text-align:center; font-size:18px;'>Carrito vacío</p>";
      return;
    }

    contenedor.innerHTML = "";
    carrito.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
          <img src="\${item.strCategoryThumb}" alt="\${item.strCategory}" width="120" style="border-radius:8px; object-fit:cover;">
          <h3>\${item.strCategory}</h3>
          <p>Cantidad: <strong>\${item.cantidad}</strong></p>
          <div class="cart-controls">
            <button onclick="modificarCantidad(\${index}, 1)">+</button>
            <button onclick="modificarCantidad(\${index}, -1)">-</button>
            <button onclick="eliminarProducto(\${index})" style="background-color:#c0392b;">Eliminar</button>
          </div>
      `;
      contenedor.appendChild(card);
    });
  }


  function modificarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito[index]) {
      carrito[index].cantidad += cambio;
      if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      if (mostrandoCarrito) {
        mostrarCarrito();
      }
      actualizarNumeroCarrito();
    }
  }

  function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (mostrandoCarrito) {
      mostrarCarrito();
    }
    actualizarNumeroCarrito();
  }

  function actualizarNumeroCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = 0;
    carrito.forEach(item => total += item.cantidad);
    const cuenta = document.getElementById("numeroCarrito");
    if (cuenta) cuenta.innerText = total;
  }


  document.getElementById('numeroCarrito').addEventListener('click', () => {
    if (mostrandoCarrito) {
      cargarProductos();
    } else {
      mostrarCarrito();
    }
  });