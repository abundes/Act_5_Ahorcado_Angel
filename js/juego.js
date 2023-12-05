const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

const ahorcado = {
  categorias: ["Animales", "Frutas", "Países"],
  categoriaActual: "Animales", // Inicia con la primera categoría
  palabraSecreta: "",
  letrasUsadas: [],
  puntos: 0,
  intentosRestantes: 6,
  letrasDisponibles: "abcdefghijklmnñopqrstuvwxyz",



  reiniciarJuego: function () {
    // Seleccionar una palabra aleatoria de la categoría actual
    this.palabraSecreta = this.obtenerPalabraAleatoria();
    this.letrasUsadas = [];
    this.intentosRestantes = 6;
    this.puntos = 0;

    this.dibujarEscenario(); // Limpia el lienzo y dibuja el escenario inicial

    // Dibuja todas las demás partes del juego
    this.dibujarTeclado();
    this.dibujarInformacionJuego();
    this.pintarPalabra();
    this.pintarLetrasUsadas();
    this.mostrarMensaje("");
    this.iniciarEventos();

     // Habilitar botones del teclado al reiniciar el juego
     this.habilitarTeclado();
},


  obtenerPalabraAleatoria: function () {
    const palabras = {
      Animales: ["elefante", "leon", "tigre", "jirafa", "gato", "perro"],
      Frutas: ["manzana", "platano", "uva", "fresa", "pera", "kiwi"],
      Países: ["argentina", "españa", "francia", "italia", "mexico", "colombia"],
    };

    const palabrasCategoria = palabras[this.categoriaActual];
    const indiceAleatorio = Math.floor(Math.random() * palabrasCategoria.length);

    return palabrasCategoria[indiceAleatorio];
  },

  play: function () {
    this.reiniciarJuego();
  },

  dibujarEscenario: function () {
    this.limpiarLienzo();
    this.dibujarImagenSVG('svg/imagen.svg', 0, 0, canvas.width, canvas.height);
    this.dibujarAhorcado();
    this.dibujarTeclado();
    this.dibujarBotonCategoria();
    this.dibujarBotonReiniciar(); // Agregado para dibujar el botón de reiniciar
    this.animacionAhorcado();
  },
  
  dibujarEscenario: function () {
    this.limpiarLienzo();
    this.dibujarImagenSVG('svg/imagen.svg', 0, 0, canvas.width, canvas.height); // Dibuja la imagen SVG
    this.dibujarAhorcado(); // Dibuja las partes del ahorcado
    this.dibujarTeclado(); // Dibuja el teclado

    // Agrega el botón de categorías después de dibujar el teclado
    this.dibujarBotonCategoria();

    // Dibuja la animación del ahorcado después de todo lo demás
    this.animacionAhorcado();
},

  dibujarAhorcado: function () {
// Tamaño común de las imágenes
const imgSize = 400;

// Array de objetos que contienen información sobre cada parte del cuerpo
const partesCuerpo = [
{ id: 'palo', x: -64, y: -0 * imgSize, visible: true },
{ id: 'pie_izquierdo', x: -60, y: -0  * imgSize, visible: false },
{ id: 'pie_derecho', x: -60, y: -0 * imgSize, visible: false },
{ id: 'torzo', x: -60, y: -396 + imgSize, visible: false },
{ id: 'brazo_derecho', x: 340 - imgSize, y: -396 + imgSize, visible: false },
{ id: 'brazo_izquierdo', x: -460 + imgSize, y: -396 + imgSize, visible: false },
{ id: 'cabeza', x: -60, y: -0, visible: false },

];

// Determina cuántas partes del ahorcado se deben mostrar según los intentos restantes
const partesPorMostrar = 6 - this.intentosRestantes;

// Muestra las partes correspondientes desde los pies
for (let i = 0; i < partesPorMostrar; i++) {
    partesCuerpo[i + 1].visible = true;
}

// Dibuja todas las partes del ahorcado
partesCuerpo.forEach(part => {
    if (part.visible) {
        this.dibujarImagenSVG(`svg/${part.id}.svg`, part.x, part.y, imgSize, imgSize);
    }
});
},

  ocultarImagen: function (id) {
const img = document.getElementById(id);
if (img) {
img.style.display = "none";
}
  },

  dibujarImagenSVG: function (ruta, x, y, ancho, alto) {
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, x, y, ancho, alto);
    };
    img.src = ruta;
  },

  limpiarLienzo: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  dibujarTeclado: function () {
    ctx.font = "20px Arial";
    const margen = 300; // Ajusta este valor para desplazar más a la derecha
    const espacioEntreFilas = 35; // Ajusta este valor para cambiar el espacio entre las filas
    const fila1 = "abcdefghijklm";
    const fila2 = "nñopqrstuvwxyz";

    for (let i = 0; i < fila1.length; i++) {
      const letra = fila1[i];
      const x = i * 35 + margen;
      const y = canvas.height - 80;

      this.dibujarBotonTeclado(letra, x, y);
    }

    for (let i = 0; i < fila2.length; i++) {
      const letra = fila2[i];
      const x = i * 35 + margen;
      const y = canvas.height - 80 + espacioEntreFilas; // Ajusta la posición en y para la segunda fila

      this.dibujarBotonTeclado(letra, x, y);
    }
  // Agrega aquí el bloque de código que resalta las letras al pasar el mouse
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.resaltarLetraTeclado(mouseX, mouseY);
  });
  },

  verificarClicTeclado: function (mouseX, mouseY) {
    const margen = 300;
    const espacioEntreFilas = 35;
    const fila1 = "abcdefghijklm";
    const fila2 = "nñopqrstuvwxyz";

    for (let i = 0; i < fila1.length; i++) {
        const letra = fila1[i];
        const x = i * 35 + margen;
        const y = canvas.height - 80;

        // Verificar si el clic está dentro del área del botón
        if (this.verificarClicBotonTeclado(mouseX, mouseY, x, y, letra)) {
            this.seleccionarLetra(letra);
            return;
        }
    }

    for (let i = 0; i < fila2.length; i++) {
        const letra = fila2[i];
        const x = i * 35 + margen;
        const y = canvas.height - 80 + espacioEntreFilas; // Ajusta la posición en y para la segunda fila

        // Verificar si el clic está dentro del área del botón
        if (this.verificarClicBotonTeclado(mouseX, mouseY, x, y, letra)) {
            this.seleccionarLetra(letra);
            return;
        }
    }

    // Limpiar y redibujar el teclado para eliminar resaltados anteriores
    this.dibujarTeclado();
},

// Dentro de la función verificarClicBotonTeclado
verificarClicBotonTeclado: function (mouseX, mouseY, x, y, letra) {
  const BTN_SIZE = 30;

  // Verifica si el clic está dentro del área del botón y si la letra no ha sido usada
  if (
    mouseX > x &&
    mouseX < x + BTN_SIZE &&
    mouseY > y &&
    mouseY < y + BTN_SIZE &&
    !this.letrasUsadas.includes(letra)
  ) {
    if (this.palabraSecreta.includes(letra)) {
      // Pinta la letra de rojo si es correcta
      ctx.fillStyle = "#FF0000"; // Color de fondo rojo
      ctx.fillRect(x, y, BTN_SIZE, BTN_SIZE);
      ctx.strokeStyle = "#FFA500"; // Color del borde resaltado (puedes ajustar este color)
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, BTN_SIZE, BTN_SIZE);
    } else {
      // Pinta la letra en el color original
      ctx.fillStyle = "#9E4C04"; // Color de fondo
      ctx.fillRect(x, y, BTN_SIZE, BTN_SIZE);
      ctx.strokeStyle = "#552800"; // Color del borde
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, BTN_SIZE, BTN_SIZE);
    }

    ctx.fillStyle = "#fff"; // Restaura el color del texto
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letra.toUpperCase(), x + BTN_SIZE / 2, y + BTN_SIZE / 2);

    // Restaura el estado original después de un breve tiempo (puedes ajustar el valor)
    setTimeout(() => {
      this.dibujarBotonTeclado(letra, x, y);
    }, 300);

    return true;
  }
  return false;
},

// Modifica la función dibujarBotonTeclado
dibujarBotonTeclado: function (letra, x, y) {
  const BTN_SIZE = 30;

  // Verifica si la letra ya ha sido usada
  if (this.letrasUsadas.includes(letra)) {
    if (this.palabraSecreta.includes(letra)) {
      // Resalta la letra en rojo si está presente en la palabra
      ctx.fillStyle = "#E70000"; // Color de fondo rojo para letras correctas
      ctx.strokeStyle = "#E70000"; // Color del borde
    } else {
      // Fondo gris para letras incorrectas
      ctx.fillStyle = "#555";
    }
  } else {
    // Fondo café para letras no usadas
    ctx.fillStyle = "#9E4C04";
    ctx.strokeStyle = "#552800"; // Color del borde
  }

  // Dibuja el botón del teclado
  ctx.fillRect(x, y, BTN_SIZE, BTN_SIZE);
  ctx.strokeRect(x, y, BTN_SIZE, BTN_SIZE);

  ctx.fillStyle = "#fff"; // Color del texto
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letra.toUpperCase(), x + BTN_SIZE / 2, y + BTN_SIZE / 2);
},

  pintarPalabra: function () {
    const palabra = this.palabraSecreta.split("");
    palabra.forEach((letra, index) => {
      const x = index * 30 + 400;
      const y = canvas.height - 120;

      ctx.font = "20px Impact";
      ctx.fillStyle = "#fff"; // Agregué esto para que las letras sean blancas
      ctx.fillText(this.letrasUsadas.includes(letra) ? letra : "_", x, y);
    });
  },

  pintarLetrasUsadas: function () {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff"; // Color del texto
    const letras = this.letrasUsadas.join(", ");
  },

  limpiarLienzo: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  mostrarMensaje: function (mensaje) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff"; // Color del texto
    const textWidth = ctx.measureText(mensaje).width;
    ctx.fillText(mensaje, (canvas.width - textWidth) / 2, canvas.height / 2);
  },

  iniciarEventos: function () {
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Verificar clic en botones del teclado
      this.verificarClicTeclado(mouseX, mouseY);
    });
  },
  
  seleccionarLetra: function (letra) {
    if (!this.letrasUsadas.includes(letra)) {
      this.letrasUsadas.push(letra);
      if (!this.palabraSecreta.includes(letra)) {
        this.intentosRestantes--;
        if (this.intentosRestantes <= 0) {
          this.animacionAhorcado(); // Llama a la animación al perder
          return;
        }
      } else {
        // Ajusta los puntos según la longitud de la palabra
        this.puntos += Math.round(100 / this.palabraSecreta.length);
      }
      this.dibujarEscenario();
      this.pintarPalabra();
      this.pintarLetrasUsadas();
      this.dibujarTeclado();
      this.dibujarInformacionJuego();
      // En la función donde ganas el juego
if (this.palabraAdivinada()) {
  // Añade puntos adicionales al adivinar la palabra completa
  this.puntos += 100; // Siempre 100 puntos al ganar
  this.mostrarAlertaGanar(`¡Has ganado! Obtuviste 100 puntos.`);
  // Reinicia el juego después de un breve tiempo
  setTimeout(() => this.reiniciarJuego(), 2000);
} else {
  this.mostrarMensajeCentrado("");
}
    }
  },

  mostrarMensajeCentrado: function (mensaje) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff"; // Color del texto
    const textWidth = ctx.measureText(mensaje).width;
    const centerX = (canvas.width + textWidth)-300;
    const centerY = canvas.height / 2;
    ctx.fillText(mensaje, centerX, centerY);
  },
  
  

  palabraAdivinada: function () {
    return this.palabraSecreta.split("").every(letra => this.letrasUsadas.includes(letra));
  },

  dibujarInformacionJuego: function () {
    // Alineación horizontal de la información del juego
    const infoX = 400;

    // Dibujar cajita para la categoría
    ctx.fillStyle = "#5D3400"; // Color de fondo de la caja
    ctx.fillRect(infoX - 150, 10, 300, 25); // Tamaño y posición de la caja

    ctx.font = "18px Arial";
    ctx.fillStyle = "#fff"; // Color del texto
    ctx.fillText(`Categoría: ${this.categoriaActual}`, infoX, 25);

    // Dibujar cajita para los puntos
    ctx.fillStyle = "#7B4500"; // Color de fondo de la caja
    ctx.fillRect(infoX - 150, 35, 300, 25); // Tamaño y posición de la caja

    ctx.font = "18px Arial";
    ctx.fillStyle = "#fff"; 
    ctx.fillText(`Puntos: ${this.puntos}`, infoX, 50);

    // Dibujar cajita para los intentos restantes
    ctx.fillStyle = "#5D3400"; // Color de fondo de la caja
    ctx.fillRect(infoX - 150, 60, 300, 25); // Tamaño y posición de la caja

    ctx.font = "18px Arial";
    ctx.fillStyle = "#fff"; 
    ctx.fillText(`Intentos restantes: ${this.intentosRestantes}`, infoX, 75);
},

animacionAhorcado: function () {
  if (this.intentosRestantes <= 0) {
    const palabraOriginal = this.palabraSecreta; // Guarda la palabra original antes de perder

    // Mostrar mensaje de alerta al centro
    this.mostrarAlerta(`Perdiste. La palabra era: ${palabraOriginal}`, false);

    // Animación del ahorcado (puedes ajustar la velocidad aquí)
    const animationSpeed = 200;
    const spriteSheet = new Image();
    spriteSheet.src = 'png/animacion.png';
    const spriteWidth = 116;
    const spriteHeight = 348.66;
    const numFrames = 5;
    let currentFrame = 0;

    const newWidth = 80;
    const newHeight = 210;

    const animationX = (canvas.width - newWidth) / 2 - 290;
    const animationY = canvas.height - newHeight - 125;
    const animationWidth = newWidth;
    const animationHeight = newHeight;

    const animate = () => {
      const frameX = currentFrame * spriteWidth;
      const frameY = 0;

      // Limpiar solo el área de la animación, no el fondo
      ctx.clearRect(animationX, animationY, animationWidth, animationHeight);

      // Recortar el fondo transparente
      ctx.drawImage(spriteSheet, frameX, frameY, spriteWidth, spriteHeight, animationX, animationY, animationWidth, animationHeight);

      currentFrame++;

      if (currentFrame >= numFrames) {
        clearInterval(animationInterval);

        // Desactivar botones antes de la animación
        this.deshabilitarTeclado();

        // Reiniciar el juego después de un breve tiempo
        setTimeout(() => {
          // Habilitar botones después de la animación y reiniciar el juego
          this.habilitarTeclado();
          this.reiniciarJuego();
        }, 1000); // Puedes ajustar el tiempo de espera aquí
      }
    };

    const animationInterval = setInterval(animate, animationSpeed);
  }
},

// Función para mostrar alerta al centro con opción para mostrar palabra
mostrarAlerta: function (mensaje, mostrarPalabra) {
  const alertContainer = document.createElement("div");
  alertContainer.style.position = "fixed";
  alertContainer.style.top = "50%";
  alertContainer.style.left = "50%";
  alertContainer.style.transform = "translate(-50%, -50%)";
  alertContainer.style.backgroundColor = "#ffcccb"; // Puedes cambiar el color de fondo
  alertContainer.style.padding = "20px";
  alertContainer.style.borderRadius = "10px";
  alertContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

  const alertText = document.createElement("p");
  alertText.style.margin = "0";
  alertText.style.fontSize = "18px";
  alertText.style.color = "#721c24"; // Puedes cambiar el color del texto
  alertText.innerText = mensaje;

  const palabraText = document.createElement("p");
  palabraText.style.margin = "10px 0 0";
  palabraText.style.fontSize = "16px";
  palabraText.style.color = "#721c24";

  if (mostrarPalabra) {
    palabraText.innerText = `La palabra era: ${this.palabraSecreta}`;
  }

  alertContainer.appendChild(alertText);
  alertContainer.appendChild(palabraText);
  document.body.appendChild(alertContainer);

  // Eliminar la alerta después de un breve tiempo
  setTimeout(() => {
    document.body.removeChild(alertContainer);
  }, 3000); // Puedes ajustar el tiempo que quieres que aparezca la alerta
},

// ...

mostrarAlertaGanar: function (mensaje) {
  const alertContainer = document.createElement("div");
  alertContainer.style.position = "fixed";
  alertContainer.style.top = "50%";
  alertContainer.style.left = "50%";
  alertContainer.style.transform = "translate(-50%, -50%)";
  alertContainer.style.backgroundColor = "#d4edda"; // Cambié el color de fondo para indicar victoria
  alertContainer.style.padding = "20px";
  alertContainer.style.borderRadius = "10px";
  alertContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

  const alertText = document.createElement("p");
  alertText.style.margin = "0";
  alertText.style.fontSize = "18px";
  alertText.style.color = "#155724"; // Cambié el color del texto para indicar victoria
  alertText.innerText = mensaje;

  alertContainer.appendChild(alertText);
  document.body.appendChild(alertContainer);

  // Eliminar la alerta después de un breve tiempo
  setTimeout(() => {
    document.body.removeChild(alertContainer);
  }, 3000); // Puedes ajustar el tiempo que quieres que aparezca la alerta
},

// ...



deshabilitarTeclado: function () {
  canvas.removeEventListener("click", this.verificarClicTeclado);

  // Deshabilitar visualmente los botones del teclado (puedes personalizar esto)
  const teclas = document.querySelectorAll(".tecla");
  teclas.forEach(tecla => {
    tecla.disabled = true;
    tecla.style.opacity = "0.5"; // Puedes ajustar la opacidad o cualquier estilo que desees
  });
},

habilitarTeclado: function () {
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    this.verificarClicTeclado(mouseX, mouseY);
  });

  // Habilitar visualmente los botones del teclado (puedes personalizar esto)
  const teclas = document.querySelectorAll(".tecla");
  teclas.forEach(tecla => {
    tecla.disabled = false;
    tecla.style.opacity = "1"; // Puedes ajustar la opacidad o cualquier estilo que desees
  });
},

dibujarBotonCategoria: function () {
  const BTN_SIZE = 70;
  const MARGIN = 3;

  const cambiarCategoriaButton = document.createElement("button");
  cambiarCategoriaButton.innerText = "Cambiar Categoría";
  cambiarCategoriaButton.style.position = "absolute";
  cambiarCategoriaButton.style.top = canvas.offsetTop + "px";
  cambiarCategoriaButton.style.right =
    window.innerWidth - (canvas.offsetLeft + canvas.width) + "px";
  cambiarCategoriaButton.style.backgroundColor = "#935300";
  cambiarCategoriaButton.style.border = "2px solid #5D3400";
  cambiarCategoriaButton.style.color = "#fff";
  cambiarCategoriaButton.style.textAlign = "center";
  cambiarCategoriaButton.style.textBaseline = "middle";
  cambiarCategoriaButton.style.font = "10px Arial";
  cambiarCategoriaButton.style.width = BTN_SIZE + "px";
  cambiarCategoriaButton.style.height = BTN_SIZE + "px";

  const categoriasContainer = document.createElement("div");
  categoriasContainer.style.position = "absolute";
  categoriasContainer.style.top = canvas.offsetTop + 70 + "px";
  categoriasContainer.style.right =
    window.innerWidth - (canvas.offsetLeft + canvas.width) + "px";
  categoriasContainer.style.display = "none";

  cambiarCategoriaButton.addEventListener("click", () => {
    this.toggleCategorias(categoriasContainer);
  });

  document.body.appendChild(cambiarCategoriaButton);

  this.categorias.forEach((categoria, index) => {
    const btnCategoria = document.createElement("button");
    btnCategoria.innerText = categoria;
    btnCategoria.style.backgroundColor = "#974700";
    btnCategoria.style.border = "1px solid #5D3400";
    btnCategoria.style.color = "#fff";
    btnCategoria.style.textAlign = "center";
    btnCategoria.style.textBaseline = "middle";
    btnCategoria.style.font = "11px Arial";
    btnCategoria.style.width = BTN_SIZE + "px";
    btnCategoria.style.height = BTN_SIZE + "px";
    btnCategoria.style.marginBottom = "0px";

    btnCategoria.addEventListener("click", () => {
      this.cambiarCategoria(categoria, categoriasContainer);
      this.toggleCategorias(true, categoriasContainer); // Pasar true para indicar que se seleccionó una categoría
    });

    categoriasContainer.appendChild(btnCategoria);
  });

  document.body.appendChild(categoriasContainer);
},

toggleCategorias: function (categoriasContainer) {
  categoriasContainer.style.display =
    categoriasContainer.style.display === "none" ? "block" : "none";
},

cambiarCategoria: function (nuevaCategoria, categoriasContainer) {
  this.categoriaActual = nuevaCategoria;
  this.reiniciarJuego();
  categoriasContainer.style.display = "none"; // Ocultar las opciones de categoría al seleccionar una
},



};


ahorcado.play();
ahorcado.dibujarBotonCategoria();