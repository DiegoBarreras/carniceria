let arrayClaveProd = [];
let arrayNumCajas = [];
let arrayDescProd = [];
let arrayKilos = [];
let arrayCentigramos = [];
let arrayDecigramos = [];
let arrayPeso = [];
let arrayComp = 0;
let totalCajas = 0;
let totalKilos = 0;

function mostrar() {
  totalCajas = 0;
  totalKilos = 0;

  let tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  for (let i = 0; i < (arrayClaveProd.length - 1); i++) {
    while (arrayClaveProd[i] == arrayClaveProd[i + 1]) {
      arrayNumCajas[i] += arrayNumCajas[i + 1];
      arrayPeso[i] += arrayPeso[i + 1];

      arrayClaveProd.splice(i + 1, 1);
      arrayNumCajas.splice(i + 1, 1);
      arrayDescProd.splice(i + 1, 1);
      arrayPeso.splice(i + 1, 1);
    }
  }

  for (let i = 0; i < arrayClaveProd.length; i++) {
    let tr = document.createElement("tr");
  
    let td1 = document.createElement("td");
    td1.textContent = arrayNumCajas[i];
    tr.appendChild(td1);

    let td2 = document.createElement("td");
    td2.textContent = arrayClaveProd[i]; 
    tr.appendChild(td2);

    let td3 = document.createElement("td");
    td3.textContent = arrayDescProd[i]; 
    tr.appendChild(td3);

    let td4 = document.createElement("td");
    td4.textContent = arrayPeso[i].toFixed(2) + "kg";
    tr.appendChild(td4);

    tbody.appendChild(tr);
}

  for (let i = 0; i < arrayNumCajas.length; i++) {
    totalCajas += parseInt(arrayNumCajas[i]);
  }

  for (let i = 0; i < arrayPeso.length; i++) {
    totalKilos += (parseFloat(arrayPeso[i]));
  }

  let trExtra = document.createElement("tr");

  let tdExtra1 = document.createElement("td");
  tdExtra1.textContent = totalCajas;
  trExtra.appendChild(tdExtra1);
  
  let tdExtra2 = document.createElement("td");
  tdExtra2.textContent = "TOTAL";
  trExtra.appendChild(tdExtra2);
  
  let tdExtra3 = document.createElement("td");
  tdExtra3.textContent = "";
  trExtra.appendChild(tdExtra3);
  
  let tdExtra4 = document.createElement("td");
  tdExtra4.textContent = totalKilos.toFixed(2) + "kg";
  trExtra.appendChild(tdExtra4);
  
  tbody.appendChild(trExtra);
}

function buscarNom(lineas) {
  for (let i = 0; i < arrayClaveProd.length; i++) {
    let cod = arrayClaveProd[i]; 
    let buscar_cod = parseInt(cod);  
    let izq = 0; 
    let der = lineas.length - 1; 
    let mid;
    let ausencia = 0; 

    while (izq <= der) {
      mid = Math.floor((izq + der) / 2);
      if (parseInt(lineas[mid]) === buscar_cod) { 
        arrayDescProd.push(lineas[mid].slice(9, 50).slice(0, -1));
        ausencia = 1;
        break;
      } else if (buscar_cod < parseInt(lineas[mid])) {
        der = mid - 1;
      } else {
        izq = mid + 1;
      }
    }

    if (ausencia === 0) {
      alert("El nombre del código ingresado no ha sido encontrado.");
    }
  }
  mostrar();
}

function cargarNom() {
  const input = document.getElementById("input_nom");
  const archivo = input.files[0];

  if (archivo) {
    const lector = new FileReader();
    
    lector.onload = function(e) {
      const contenido = e.target.result;
      const lineas = contenido.split('\n');
      lineas.sort();
      buscarNom(lineas); 
    };

    lector.onerror = function(e) {
      alert("Hubo un error al cargar el archivo: " + e.target.error.name);
    };

    lector.readAsText(archivo);
  }
}

function resumir(lineas) {
  arrayNumCajas = [];
  arrayClaveProd = [];
  arrayKilos = [];
  arrayCentigramos = [];
  arrayDecigramos = [];
  arrayPeso = [];
  arrayComp = 0;

  for (let i = 0; i < lineas.length; i++) {
    arrayComp++;
    arrayNumCajas.push(1);
    arrayClaveProd.push(lineas[i].slice(0, 8));

    if (parseInt(lineas[i].slice(11, 12)) > 5) {
      if (parseInt(lineas[i].slice(10, 11)) < 9) {
        arrayKilos.push(parseInt(lineas[i].slice(8, 10)));
        arrayCentigramos.push(parseInt(lineas[i].slice(10, 11)) + 1);
        arrayDecigramos.push(0);
      }
      else {
        arrayKilos.push(parseInt(lineas[i].slice(8, 10)) + 1);
        arrayCentigramos.push(0);
        arrayDecigramos.push(0);
      }
    }
    else {
      arrayKilos.push(parseInt(lineas[i].slice(8, 10)));
      arrayCentigramos.push(parseInt(lineas[i].slice(10, 11)));
      arrayDecigramos.push(0);
    }
  }

  for (let i = 0; i < arrayDecigramos.length; i++) {
    arrayPeso.push(parseFloat(String(arrayKilos[i]) + String(arrayCentigramos[i]) + String(arrayDecigramos[i]))/100);
  }
  
  cargarNom();
}

function ordenar(lineas) {
  for (let i = 0; i < lineas.length; i++) {
    lineas[i] = lineas[i].slice(2, 24);
  }
  
  lineas.sort();
  resumir(lineas);
}

function cargarReg() {
  const input = document.getElementById("input_reg");
  const archivo = input.files[0];

  if (archivo) {
    const lector = new FileReader();
    
    lector.onload = function(e) {
      const contenido = e.target.result;
      const lineas = contenido.split('\n').filter(line => line.length > 0);
      ordenar(lineas);
    };

    lector.onerror = function(e) {
      alert("Hubo un error al cargar el archivo: " + e.target.error.name);
    };

    lector.readAsText(archivo);
  }
}

function validar() {
  const input = document.getElementById("input_reg");
  const archivo = input.files[0];
  const inputNom = document.getElementById("input_nom");
  const archivoNom = inputNom.files[0];
  let val = 0;

  if (archivo) {
    const nomArch = archivo.name;
    const extension = nomArch.split('.').pop().toLowerCase();

    if (extension != "txt") {
      alert("Inserta un archivo .txt para los registros");
    } else {
      val++;
    }
  } else {
    alert("Inserta un archivo para los registros");
  }

  if (archivoNom) {
    const nomArchNom = archivoNom.name;
    const extensionNom = nomArchNom.split('.').pop().toLowerCase();

    if (extensionNom != "txt") {
      alert("Inserta un archivo .txt para los nombres de los productos");
    } else {
      val++;
    }
  } else {
    alert("Inserta un archivo para los nombres de los productos");
  }

  if (val == 2) {
    cargarReg();
  }
}