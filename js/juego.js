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
},


  obtenerPalabraAleatoria: function () {
    const palabras = {
      Animales: ["elefante", "leon", "tigre", "jirafa"],
      Frutas: ["manzana", "platano", "uva", "fresa"],
      Países: ["argentina", "españa", "francia", "italia"],
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
const imgSize = 300;

// Array de objetos que contienen información sobre cada parte del cuerpo
const partesCuerpo = [
{ id: 'palo', x: 10, y: 0.2 * imgSize, visible: true },
{ id: 'pie_izquierdo', x: 10, y: 0.22  * imgSize, visible: false },
{ id: 'pie_derecho', x: 10, y: 0.22 * imgSize, visible: false },
{ id: 'torzo', x: 10, y: -230 + imgSize, visible: false },
{ id: 'brazo_derecho', x: 310 - imgSize, y: -230 + imgSize, visible: false },
{ id: 'brazo_izquierdo', x: -290 + imgSize, y: -230 + imgSize, visible: false },
{ id: 'cabeza', x: 10, y: 70, visible: false },
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
    const y = canvas.height - 80 + espacioEntreFilas;

    // Verificar si el clic está dentro del área del botón
    if (this.verificarClicBotonTeclado(mouseX, mouseY, x, y, letra)) {
      this.seleccionarLetra(letra);
      return;
    }
  }

  // Limpiar y redibujar el teclado para eliminar resaltados anteriores
  this.dibujarTeclado();
  },

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
    ctx.fillStyle = "#FFD700"; // Color de fondo resaltado
    ctx.fillRect(x, y, BTN_SIZE, BTN_SIZE);
    ctx.strokeStyle = "#FFA500"; // Color del borde resaltado
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, BTN_SIZE, BTN_SIZE);
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

  dibujarBotonTeclado: function (letra, x, y) {
    // Código para dibujar el botón del teclado (igual que en la función original)
    const BTN_SIZE = 30;
    const MARGIN = 10;

    ctx.fillStyle = "#9E4C04"; // Color de fondo
    ctx.fillRect(x, y, BTN_SIZE, BTN_SIZE);
    ctx.strokeStyle = "#552800"; // Color del borde
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, BTN_SIZE, BTN_SIZE);
    ctx.fillStyle = "#fff"; // Color del texto
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letra.toUpperCase(), x + BTN_SIZE / 2, y + BTN_SIZE / 2);

    // Verifica si la letra ya ha sido usada y la resalta si es el caso
 if (this.letrasUsadas.includes(letra)) {
  ctx.fillStyle = "#555"; // Cambia el color de fondo para las letras usadas
  ctx.fillRect(x, y, BTN_SIZE, BTN_SIZE);
  ctx.fillStyle = "#fff"; // Restaura el color del texto
  ctx.fillText(letra.toUpperCase(), x + BTN_SIZE / 2, y + BTN_SIZE / 2);
}
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
        this.mostrarMensaje("Incorrecto. Pierdes un intento.");
        if (this.intentosRestantes <= 0) {
          this.animacionAhorcado(); // Llama a la animación al perder
          return;
        }
      }
      this.dibujarEscenario();
      this.pintarPalabra();
      this.pintarLetrasUsadas();
      this.dibujarTeclado();
      this.dibujarInformacionJuego();
      if (this.palabraAdivinada()) {
        this.mostrarMensaje("¡Has ganado!");
      } else {
        this.mostrarMensaje("");
      }
    }
  },

  palabraAdivinada: function () {
    return this.palabraSecreta.split("").every(letra => this.letrasUsadas.includes(letra));
  },

  dibujarInformacionJuego: function () {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#fff"; // Color del texto
    ctx.fillText(`Categoría: ${this.categoriaActual}`, 100, 20); // Corregí la variable a this.categoriaActual
    ctx.fillText(`Puntos: ${this.puntos}`, 60, 40);
    ctx.fillText(`Intentos restantes: ${this.intentosRestantes}`, 100, 60);
  },

  //animacion al perder...
  animacionAhorcado: function () {
    if (this.intentosRestantes <= 0) {
      const spriteSheet = new Image();
      spriteSheet.src = 'png/animacion.png';
      const spriteWidth = 116; // Ancho de cada frame en el sprite original
      const spriteHeight = 348.66; // Altura de la imagen completa en el sprite original
      const numFrames = 5;
      let currentFrame = 0;

      const newWidth = 50; // Nuevo ancho de la animación
      const newHeight = 150; // Nueva altura de la animación

      const animate = () => {
        const frameX = currentFrame * spriteWidth;
        const frameY = 0;

        // Nuevas coordenadas y dimensiones para la animación
        const animationX = 116; // Nueva posición X
        const animationY = 115; // Nueva posición Y
        const animationWidth = newWidth; // Nuevo ancho
        const animationHeight = newHeight; // Nueva altura

        ctx.drawImage(spriteSheet, frameX, frameY, spriteWidth, spriteHeight, animationX, animationY, animationWidth, animationHeight);

        currentFrame++;

        if (currentFrame < numFrames) {
          setTimeout(() => {
            requestAnimationFrame(animate);
          }, 700);
        } else {
          // Reiniciar el juego después de la animación
          this.reiniciarJuego();
        }
      };

      requestAnimationFrame(animate);
    }
},


//botones de categorías...
  dibujarBotonCategoria: function () {
    const BTN_SIZE = 70;
    const MARGIN = 3;
  
    const cambiarCategoriaButton = document.createElement("button");
    cambiarCategoriaButton.innerText = "Cambiar Categoría";
    cambiarCategoriaButton.style.position = "absolute";
    cambiarCategoriaButton.style.top = canvas.offsetTop + "px";
    cambiarCategoriaButton.style.right = window.innerWidth - (canvas.offsetLeft + canvas.width) + "px";
    cambiarCategoriaButton.style.backgroundColor = "#935300";
    cambiarCategoriaButton.style.border = "2px solid #5D3400";
    cambiarCategoriaButton.style.color = "#fff";
    cambiarCategoriaButton.style.textAlign = "center";
    cambiarCategoriaButton.style.textBaseline = "middle";
    cambiarCategoriaButton.style.font = "10px Arial";
    cambiarCategoriaButton.style.width = BTN_SIZE + "px";
    cambiarCategoriaButton.style.height = BTN_SIZE + "px";
  
    cambiarCategoriaButton.addEventListener("click", () => {
      this.toggleCategorias(); // Mostrar u ocultar las categorías al hacer clic
    });
  
    document.body.appendChild(cambiarCategoriaButton);
  
    const categoriasContainer = document.createElement("div");
    categoriasContainer.style.position = "absolute";
    categoriasContainer.style.top = canvas.offsetTop + 70 + "px";
    categoriasContainer.style.right = window.innerWidth - (canvas.offsetLeft + canvas.width) + "px";
    categoriasContainer.style.display = "none";
  
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
        this.cambiarCategoria(categoria);
        this.toggleCategorias(); // Ocultar las opciones de categoría al seleccionar una
      });
  
      categoriasContainer.appendChild(btnCategoria);
    });
  
    document.body.appendChild(categoriasContainer);
  
    this.toggleCategorias = function () {
      if (categoriasContainer.style.display === "none") {
        categoriasContainer.style.display = "block";
      } else {
        categoriasContainer.style.display = "none";
      }
    };
  },
  
  cambiarCategoria: function (nuevaCategoria) {
    this.categoriaActual = nuevaCategoria;
    this.reiniciarJuego();
  },

};

ahorcado.play();
ahorcado.dibujarBotonCategoria();