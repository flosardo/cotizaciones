const valoresNoDeseados = ['Bitcoin', 'Argentina', 'Dolar Soja']
const monedaOrigen = "Pesos Argentinos";

const cotizacionDelDia = async () => {
  const cotizacion = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
    .then((response) => response.json())
  cotizacion.forEach((element) => {
    if (valoresNoDeseados.includes(element.casa.nombre)) {
      cotizacion.splice(cotizacion.indexOf(element), 1)
    }
  })
  return cotizacion
}

const dibujarCotizacion = (cotizacion) => {
  let divCotizaciones = document.querySelector('.cotizaciones')
  cotizacion.forEach(element => {
    let div = document.createElement('div')
    let tipoDolar = `${element.casa.nombre}`
    div.className = tipoDolar + ' col'
    if (!element.casa.hasOwnProperty('variacion')) {
      div.innerHTML = `
      <h2>Dolar BNA</h2>
      <p>Compra: $ ${element.casa.compra}</p> 
      <p>Venta: $ ${element.casa.venta}</p>` // Dolar BNA no tiene variacion
    }
    else {
      let variacion = Number(element.casa.variacion.replaceAll(',', '.'));
      div.innerHTML = `
      <h2>${tipoDolar}</h2>
      <p>Compra: $ ${element.casa.compra}</p>
      <p>Venta: $ ${element.casa.venta}</p>
      <p>Variación ${variacion > 0 ? "↑" : (variacion < 0 ? "↓" : "=")} ${variacion}</p>`
    }
    divCotizaciones.appendChild(div)
  });
}


const realizarConversion = async (event) => {
  event.preventDefault(); // Evitar que se recargue la página
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const monedaDestino = document.getElementById("monedaDestino").value;

  if (cantidad > 0) {
    // Buscar los tipos de cambio para la moneda de destino en el objeto cotizaciones
    const tipoCambioDestino = await buscarTipoCambio(monedaDestino);

    // Realizar la conversión utilizando el tipo de cambio de destino obtenido
    const resultado = cantidad / tipoCambioDestino;
    document.getElementById("resultado").innerText = `${cantidad} ${monedaOrigen} son ${resultado.toFixed(2)} dólares al ${monedaDestino}`;
    // Mostrar el recuadro de resultado
    document.querySelector(".resultado-container").classList.add("show");
  }
  else {
    alert("La cantidad debe ser mayor a 0")
  }
}

const buscarTipoCambio = async (moneda) => {
  const cotizaciones = await cotizacionDelDia();
  let valorCambio;
  cotizaciones.forEach((element) => {
    if (element.casa.nombre === moneda) {
      valorCambio = parseFloat(element.casa.venta);
      return valorCambio;
    }
  });
  return valorCambio;
}

cotizacionDelDia().then((cotizacion) => dibujarCotizacion(cotizacion))
