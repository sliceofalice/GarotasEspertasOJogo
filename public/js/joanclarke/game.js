(function () {
  const WIDTH = 800;
  const HEIGHT = 450;

  const FPS = 100;
  let frame = 0;

  let gameLoop;

  let fundo;
  let tela;

  let audio = [];
  let sound = [
    "../../media/sound/piano/C4.mp3",
    "../../media/sound/piano/D4.mp3",
    "../../media/sound/piano/E4.mp3",
    "../../media/sound/piano/F4.mp3",
    "../../media/sound/piano/G4.mp3",
    "../../media/sound/piano/A4.mp3",
    "../../media/sound/piano/B4.mp3",
  ];

  let a1 = 0;

  let alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let words = ["ENIGMA", "ARTE", "HABILIDADE", "COMPUTADOR"];

  let answer = "";
  let flagAnswer = false;

  let divRestart = null;

  let teclas = [];
  let cripto;
  let segredo;

  let flag = true;

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function init() { 
    
    // GAME
    game(); // inicia o jogo

    // CRIA OS ELEMENTOS
    fundo = new Fundo(); // cria o fundo
    tela = new Tela(); // cria a tela

  } // end init

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function game(){

    // INSTRUÇÃO
    flag = true;

    // CRIA O ELEMENTO DIV DA INSTRUÇÃO
    let divLevel = document.createElement("div");
    divLevel.className = "level";
    divLevel.style.width = `${WIDTH - 200}px`;
    divLevel.style.height = `${HEIGHT - 200}px`;
    document.getElementById("game").appendChild(divLevel);

    // TEXTO DA INSTRUÇÃO
    divLevel.innerHTML = `<span id="instrucao">Utilize o mouse para escolher a letra.<br><br>
                            Utilize o botão verde (redondo) para testar e<br>o botão vermelho (triangular) para apagar erros.</span><br>
                            <span id="aperte">Aperte "Espaço" para começar</span>`;

    function keydownHandler(e) {
      if (flag && e.key === " ") { // se a flag for true e a tecla for espaço
        divLevel.remove(); // remove a instrução
        flag = false; // muda a flag para false
        start(); // inicia o jogo
        window.removeEventListener("keydown", keydownHandler);
      } // end if
    } // end keydownHandler

    window.addEventListener("keydown", keydownHandler);

  } // end 
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  function start(){

    // GAME LOOP
    gameLoop = setInterval(run, 1000 / FPS); // inicia o game

    document.addEventListener("click", clickHandler1); // evento de clique
    document.addEventListener("mousemove", mouseHandler1); // evento de mouse

    // CRIA OS ELEMENTOS
    for (let i = 0; i < 28; i++) teclas.push(new Tecla(i));
    cripto = new Cripto();

    // CRIA O SEGREDO
    segredo = new Segredo(cripto.index);
    segredo.set();
    flagAnswer = true;

    // CRIA O AUDIO
    for (let n = 0; n < 7; n++) audio.push(new Audio(sound[n])); // cria o audio e adiciona ao array

    // AUDIO
    audio.forEach((audio) => {
      audio.addEventListener("timeupdate", async function () {
        if (audio.currentTime >= 0.7) {
          audio.pause(); // para o audio após 0.7 segundo
          audio.currentTime = 0;
        } // end if
        await new Promise((resolve) => {
          setTimeout(resolve, 500); // espera 0.5 segundo
        }); // end Promise 
      }); // end addEventListener
      audio.load();
    }); // end forEach
    
  } // end start

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function endGame(){

    flag = true;

    document.removeEventListener("click", clickHandler1);
    document.removeEventListener("mousemove", mouseHandler1);

    // CRIA ELEMENTO DA MENSAGEM DO JOGO
    let divEnd = document.createElement("div");
    divEnd.className = "end";
    divEnd.style.width = `${WIDTH - 200}px`;
    divEnd.style.height = `${HEIGHT - 200}px`;
    document.getElementById("game").appendChild(divEnd);

    // TEXTO DA MENSAGEM DO JOGO
    divEnd.innerHTML = `<span id="parabens">Você decifrou a palavra ${segredo.word}!</span><br>
                          <span id="aperte3">Aperte "Espaço" para jogar novamente</span>`;

    document.addEventListener("keydown", function (e) {
      if (flag == true) { // se a flag for true
        if (e.key == " ") { // se a tecla for espaço
          divEnd.remove(); // remove a mensagem
          flag = false; // muda a flag para false
          location.reload(); // recarrega a página
        } // end if
      } // end if
    }); // end addEventListener

  } // end endGame

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Fundo {

    constructor() {

      // ELEMENTO FUNDO
      this.element = document.createElement("div");
      this.element.className = "fundo";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      document.getElementById("game").appendChild(this.element); // adiciona o fundo ao game

    } // end constructor

  } // end fundo

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Tela {

    constructor() {

      // ELEMENTO TELA
      this.element = document.createElement("div");
      this.element.className = "tela";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona a tela ao fundo

      // background
      this.backgroundImage = {
        tela1: "url(../../media/img/joanclarke/tela1.png)",
        tela2: "url(../../media/img/joanclarke/tela2.png)",
      }; // end backgroundImage

    } // end constructor

    mudar() {
      if (frame == 0) this.element.style.backgroundImage = this.backgroundImage.tela1;
      if (frame == FPS / 2) this.element.style.backgroundImage = this.backgroundImage.tela2;
    } // end mudar

  } // end tela

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Tecla {
        
    constructor(number) {

      // ELEMENTO TECLA
      this.element = document.createElement('div');
      this.element.className = 'tecla';
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona a tecla ao fundo

      this.number = number;

      this.backgroundImage = {
        apagar: "url(../../media/img/joanclarke/teclas/apagar.png)",
        testar: "url(../../media/img/joanclarke/teclas/testar.png)",
        tecla: "url(../../media/img/joanclarke/teclas/tecla.png)"
      } // end backgroundImage

      this.bottom = [0];
      this.left = [0];

      for (let i = 1; i < 26; i++) {

        if (i == 10 || i == 20) {
          this.bottom.push(this.bottom[i - 1] - 64);
          if (i == 10) this.left.push(5);
          if (i == 20) this.left.push(9);
        } else {
          this.bottom.push(this.bottom[i - 1] + 1.5);
          this.left.push(this.left[i - 1] + 49);
        } // end if/else
        
      } // end for

      this.type = "";

    } // end constructor

    aparecer() {
      let urls = [this.backgroundImage.apagar, this.backgroundImage.testar];
      let urls2 = [];
      for (let i = 0; i < 26; i++) urls2.push(this.backgroundImage.tecla);
      let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      if (this.number == 0 || this.number == 1) {
        this.element.style.backgroundImage = urls[this.number];
      } else if (this.number >= 2) {
        this.element.style.backgroundImage = urls2[this.number - 2];;
        this.element.style.left = `${this.left[this.number - 2]}px`;
        this.element.style.bottom = `${this.bottom[this.number - 2]}px`;
        this.type = letters[this.number - 2];
      } // end if/else
    } // end aparecer

    reverter() {
      this.element.style.backgroundImage = 'none';
    } // end reverter

  } // end Tecla

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Cripto {
      
    constructor() {
  
      this.element = document.createElement('div');
      this.element.className = 'cripto';
      this.element.style.width = `${WIDTH - 500}px`;
      this.element.style.height = `${HEIGHT - 200}px`;
      fundo.element.appendChild(this.element);

      this.index = Math.floor(Math.random() * 25) + 1;

      this.cripto = alfabeto.substring(this.index, this.index + 4);
      if (this.cripto.length < 4) {
        this.cripto += alfabeto.substring(0, 4 - this.cripto.length);
      } // end if

      this.element.innerHTML = `<span id="cripto">${this.cripto.split("").join("<br>")}</span><br>`;
  
    } // end constructor

  } // end Cripto

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Segredo {
      
    constructor(index) {
  
      this.element = document.createElement('div');
      this.element.className = 'segredo';
      this.element.style.width = `${WIDTH - 200}px`;
      this.element.style.height = `${HEIGHT - 200}px`;
      fundo.element.appendChild(this.element);

      this.index = index;

      this.segredo = alfabeto.slice(index) + alfabeto.slice(0, index);
  
    } // end constructor

    set() {
      let random = Math.floor(Math.random() * words.length);
      this.word = words[random];

      let underscore = "";
      let criptografia = "";

      for (let i = 0; i < this.word.length; i++) {
        underscore += "_";
        criptografia += this.segredo[alfabeto.indexOf(this.word[i])];
        if (i < this.word.length - 1){
          underscore += " ";
          criptografia += " ";
        } // end if
      } // end for

      this.element.innerHTML = `<span id="underscore">${underscore}</span><br>
                                <span id="criptografia">${criptografia}</span><br>`;
    } // end set

    change(answer) {

      let underscore = document.getElementById("underscore");

      if (flagAnswer == true) {
        if (answer.length/2 == this.word.length) flagAnswer = false;
        underscore.innerHTML = answer;
        for (let i = (answer.length/2 - 1); i < this.word.length - 1; i++) {
          underscore.innerHTML += "_";
          if (i < this.word.length - 1) underscore.innerHTML += " ";
        } // end for
      } // end if

    } // end change

    apaga(str) {

      answer = str.slice(0, -2);
      flagAnswer = true;

      let underscore = document.getElementById("underscore");
      if (answer.length/2 == this.word.length) flagAnswer = false;
      underscore.innerHTML = answer;
      for (let i = (answer.length/2 - 1); i < this.word.length - 1; i++) {
        underscore.innerHTML += "_";
        if (i < this.word.length - 1) underscore.innerHTML += " ";
      } // end for

    } // end apaga

  } // end Segredo

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function isInside(x, y, xMin, yMin, width, height) {
    return x >= xMin && x <= xMin + width && y >= yMin && y <= yMin + height;
  } // end isInside

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function mouseHandler1(e) {

    const rect = tela.element.getBoundingClientRect(); // pega o tamanho da tela
    const x = e.clientX - rect.left; // posição do mouse no eixo x
    const y = e.clientY - rect.top; // posição do mouse no eixo y

    let inside = [
      isInside(x, y, 688, 400, 25, 35),
      isInside(x, y, 735, 400, 30, 35),

      isInside(x, y, 220, 290, 38, 36),
      isInside(x, y, 268, 291, 38, 36),
      isInside(x, y, 320, 292, 38, 36),
      isInside(x, y, 368, 293, 38, 36),
      isInside(x, y, 420, 294, 38, 36),
      isInside(x, y, 468, 295, 38, 36),
      isInside(x, y, 520, 296, 38, 36),
      isInside(x, y, 568, 297, 38, 36),
      isInside(x, y, 620, 298, 38, 36),
      isInside(x, y, 668, 299, 38, 36),

      isInside(x, y, 223, 343, 38, 36),
      isInside(x, y, 271, 344, 38, 36),
      isInside(x, y, 323, 345, 38, 36),
      isInside(x, y, 371, 346, 38, 36),
      isInside(x, y, 423, 347, 38, 36),
      isInside(x, y, 471, 348, 38, 36),
      isInside(x, y, 523, 349, 38, 36),
      isInside(x, y, 571, 350, 38, 36),
      isInside(x, y, 623, 351, 38, 36),
      isInside(x, y, 671, 352, 38, 36),

      isInside(x, y, 229, 395, 38, 36),
      isInside(x, y, 277, 396, 38, 36),
      isInside(x, y, 329, 397, 38, 36),
      isInside(x, y, 377, 398, 38, 36),
      isInside(x, y, 429, 399, 38, 36),
      isInside(x, y, 477, 400, 38, 36),
    ] // end inside

    const index = inside.findIndex((isInside) => isInside); // retorna o index do array que é true

    if (index == 0 || index == 1) {
      // se o mouse estiver sobre a tecla APAGAR
      document.body.style.cursor = "pointer"; // cursor de mão
      teclas[index].aparecer(); // aparece a tecla
    } else if (isInside(x, y, 16, 12, 50, 30)) {
      // se o mouse estiver sobre a tecla
      document.body.style.cursor = "pointer"; // cursor de mão\
    } else if (index >= 2) {
      // se o mouse estiver sobre a tecla TESTAR
      document.body.style.cursor = "pointer"; // cursor de mão
      teclas[index].aparecer(); // aparece a tecla
    } else {
      for (let i = 0; i < 28; i++) teclas[i].reverter(); // reverte a tecla
      document.body.style.cursor = "default"; // cursor padrão
    } // end if/else

  } // end mouseHandler1

  ///////////////////////////////////////////////////////////////////////////////////////////
  function mouseHandlerBack(e) {
    const rect = tela.element.getBoundingClientRect(); // pega o tamanho do menu
    const x = e.clientX - rect.left; // posição do mouse no eixo x
    const y = e.clientY - rect.top; // posição do mouse no eixo y

    if (isInside(x, y, 16, 12, 50, 30)) {
      // se o mouse estiver sobre a tecla
      document.body.style.cursor = "pointer"; // cursor de mão
    } else {
      // se o mouse não estiver sobre a tecla
      document.body.style.cursor = "default"; // cursor padrão
    } // end if/else
  } // end mouseHandlerBack

  ///////////////////////////////////////////////////////////////////////////////////////////
  async function clickHandler1(e) {
    const rect = tela.element.getBoundingClientRect(); // pega o tamanho da tela
    const x = e.clientX - rect.left; // posição do mouse no eixo x
    const y = e.clientY - rect.top; // posição do mouse no eixo y

    let inside = [
      isInside(x, y, 688, 400, 25, 35),
      isInside(x, y, 735, 400, 30, 35),
      
      isInside(x, y, 220, 290, 38, 36),
      isInside(x, y, 268, 291, 38, 36),
      isInside(x, y, 320, 292, 38, 36),
      isInside(x, y, 368, 293, 38, 36),
      isInside(x, y, 420, 294, 38, 36),
      isInside(x, y, 468, 295, 38, 36),
      isInside(x, y, 520, 296, 38, 36),
      isInside(x, y, 568, 297, 38, 36),
      isInside(x, y, 620, 298, 38, 36),
      isInside(x, y, 668, 299, 38, 36),

      isInside(x, y, 223, 343, 38, 36),
      isInside(x, y, 271, 344, 38, 36),
      isInside(x, y, 323, 345, 38, 36),
      isInside(x, y, 371, 346, 38, 36),
      isInside(x, y, 423, 347, 38, 36),
      isInside(x, y, 471, 348, 38, 36),
      isInside(x, y, 523, 349, 38, 36),
      isInside(x, y, 571, 350, 38, 36),
      isInside(x, y, 623, 351, 38, 36),
      isInside(x, y, 671, 352, 38, 36),

      isInside(x, y, 229, 395, 38, 36),
      isInside(x, y, 277, 396, 38, 36),
      isInside(x, y, 329, 397, 38, 36),
      isInside(x, y, 377, 398, 38, 36),
      isInside(x, y, 429, 399, 38, 36),
      isInside(x, y, 477, 400, 38, 36),
    ] // end inside

    const index = inside.findIndex((isInside) => isInside); // retorna o index do array que é true

    if (flag == false){
      if (index == 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, 300); // espera 0.3 segundo
        }); // end Promise
        segredo.apaga(answer);
      } else if (index == 1) {
        
        if (answer.split(" ").join("") === segredo.word){
          await new Promise((resolve) => {
            setTimeout(resolve, 500); // espera 0.5 segundo
          }); // end Promise
          await clearInterval(gameLoop);
          await endGame();
        } else {
          flag = true;
  
          // CRIA O ELEMENTO DIV DA INSTRUÇÃO
          divRestart = document.createElement("div");
          divRestart.className = "restart";
          divRestart.style.width = `${WIDTH - 200}px`;
          divRestart.style.height = `${HEIGHT - 200}px`;
          document.getElementById("game").appendChild(divRestart);
  
          // TEXTO DA INSTRUÇÃO
          divRestart.innerHTML = `<span id="instrucao2">Você errou!<br>
                                  Tente novamente.</span><br>
                                  <span id="aperte2">Aperte "Espaço" para retomar</span>`;
        } // end if/else

      } else if (index >= 2) {
        if (flagAnswer == true){
          await new Promise((resolve) => {
            setTimeout(resolve, 300); // espera 0.3 segundo
          }); // end Promise

          answer += teclas[index].type;
          if (answer.length != segredo.word.length) answer += " ";
          segredo.change(answer);

          audio[a1].play();
          a1 += 1;
          if (a1 == 7) a1 = 0;
        } // end if
      } // end if
    } // end if
    
  } // end clickHandler1
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  async function clickHandlerBack(e) {
    const rect = tela.element.getBoundingClientRect(); // pega o tamanho do menu
    const x = e.clientX - rect.left; // posição do mouse no eixo x
    const y = e.clientY - rect.top; // posição do mouse no eixo y

    if (isInside(x, y, 16, 12, 50, 30)) {
      // se o mouse estiver sobre a tecla e a tecla não estiver ativa
      history.back(); // volta para o menu
    } // end if
  } // end clickHandlerBack

  //////////////////////////////////////////////////////////////////////////////////////////////
  function errorHandler(e) {
    if (flag == true){ // se a flag for true
      if (e.key == " ") { // se a tecla for espaço
        if (divRestart != null){
          divRestart.remove(); // remove a instrução
          flag = false;
        } // end if
      } // end if
    } // end if
  } // end errorHandler

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function run() {

    // FRAME
    frame += 1; // incrementa o frame
    if (frame == FPS) frame = 0; // reseta o frame

    // MUDAR
    tela.mudar(); // muda a tela

  } // end run

  document.addEventListener("click", clickHandlerBack); // evento de clique
  document.addEventListener("mousemove", mouseHandlerBack); // evento de mouse

  document.addEventListener("keydown", errorHandler); // evento de teclado

  // INICIA A TELA
  document.addEventListener("DOMContentLoaded", function() {
    init();
  });
  
})(); // end script
