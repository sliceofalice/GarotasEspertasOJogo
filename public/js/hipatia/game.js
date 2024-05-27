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

  let equacao;
  let numberA;
  let numberB;
  let numberC;
  let sinal;
  let answer;

  let a1 = 0;

  let divRestart = null;
  let divCorrect = null;

  let teclas = [];

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
    divLevel.innerHTML = `<span id="instrucao">Utilize o mouse para escolher o número.<br><br>
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
    for (let i = 0; i < 12; i++) teclas.push(new Tecla(i));

    // CRIA A EQUAÇÃO
    equacao = new Equacao(); 
    equacao.set();

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
        tela1: "url(../../media/img/hipatia/tela1.png)",
        tela2: "url(../../media/img/hipatia/tela2.png)",
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
        apagar: "url(../../media/img/hipatia/teclas/apagar.png)",
        testar: "url(../../media/img/hipatia/teclas/testar.png)",
        tecla: "url(../../media/img/hipatia/teclas/tecla.png)"
      } // end backgroundImage

      this.bottom = [0];
      this.left = [0];

      for (let i = 1; i < 10; i++) {

        if (i == 6) {
          this.bottom.push(this.bottom[i - 1] - 76);
          this.left.push(56);
        } else {
          this.bottom.push(this.bottom[i - 1]);
          this.left.push(this.left[i - 1] + 86);
        } // end if/else
        
      } // end for

      this.type = "";

    } // end constructor

    aparecer() {
      let urls = [this.backgroundImage.apagar, this.backgroundImage.testar];
      let urls2 = [];
      for (let i = 0; i < 10; i++) urls2.push(this.backgroundImage.tecla);
      let numbers = "0123456789";

      if (this.number == 0 || this.number == 1) {
        this.element.style.backgroundImage = urls[this.number];
      } else if (this.number >= 2) {
        this.element.style.backgroundImage = urls2[this.number - 2];;
        this.element.style.left = `${this.left[this.number - 2]}px`;
        this.element.style.bottom = `${this.bottom[this.number - 2]}px`;
        this.type = numbers[this.number - 2];
      } // end if/else
    } // end aparecer

    reverter() {
      this.element.style.backgroundImage = 'none';
    } // end reverter

  } // end Tecla

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Equacao {
      
    constructor() {
      
      // ELEMENTO EQUAÇÃO
      this.element = document.createElement('div');
      this.element.className = 'equacao';
      this.element.style.width = `${WIDTH - 425}px`;
      this.element.style.height = `${HEIGHT - 300}px`;
      fundo.element.appendChild(this.element); // adiciona a equação ao fundo

    } // end constructor

    set () {
      let sinais = ["+", "-", "×", "÷"];
      let operacao = Math.floor(Math.random() * 4);
      sinal = sinais[operacao];

      if (operacao != 2 && operacao != 3){
        numberA = Math.floor(Math.random() * 9);
        numberB = Math.floor(Math.random() * 9);
        if (numberA < numberB) {
          let temp = numberA;
          numberA = numberB;
          numberB = temp;
        } // end if
      } else if (operacao == 2){
        numberA = Math.floor(Math.random() * 8) + 1;
        numberB = Math.floor(Math.random() * 8) + 1;
      } else {
        numberB = Math.floor(Math.random() * 8) + 1;
        let maxMultiplier = Math.floor(72 / numberB);
        let multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
        numberA = numberB * multiplier;
      } // end if
    
      if (operacao == 0) numberC = numberA + numberB;
      if (operacao == 1) numberC = numberA - numberB;
      if (operacao == 2) numberC = numberA * numberB;
      if (operacao == 3) numberC = numberA / numberB;

      this.element.innerHTML = `<span id="numberA">${numberA}</span>
                              <span id="sinal">${sinal}</span>
                              <span id="numberB">?</span> = 
                              <span id="numberC">${numberC}</span>`;

    } // end set

    mudar() {
      document.getElementById("numberB").innerHTML = answer;
    } // end muda
        
  } // end Equacao

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

      isInside(x, y, 226, 288, 65, 50),
      isInside(x, y, 310, 288, 65, 50),
      isInside(x, y, 402, 288, 65, 50),
      isInside(x, y, 486, 288, 65, 50),
      isInside(x, y, 570, 288, 65, 50),
      isInside(x, y, 654, 288, 65, 50),

      isInside(x, y, 283, 367, 65, 50),
      isInside(x, y, 367, 367, 65, 50),
      isInside(x, y, 455, 367, 65, 50),
      isInside(x, y, 540, 367, 65, 50),

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
      for (let i = 0; i < 12; i++) teclas[i].reverter(); // reverte a tecla
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

      isInside(x, y, 226, 288, 65, 50),
      isInside(x, y, 310, 288, 65, 50),
      isInside(x, y, 402, 288, 65, 50),
      isInside(x, y, 486, 288, 65, 50),
      isInside(x, y, 570, 288, 65, 50),
      isInside(x, y, 654, 288, 65, 50),

      isInside(x, y, 283, 367, 65, 50),
      isInside(x, y, 367, 367, 65, 50),
      isInside(x, y, 455, 367, 65, 50),
      isInside(x, y, 540, 367, 65, 50),
      
    ] // end inside

    const index = inside.findIndex((isInside) => isInside); // retorna o index do array que é true

    if (flag == false){
      if (index == 0) {
        answer = "?";
        equacao.mudar();
      } else if (index == 1) {
        if (answer == numberB) {
          flag = true;
  
          // CRIA O ELEMENTO DIV DA INSTRUÇÃO
          divCorrect = document.createElement("div");
          divCorrect.className = "correct";
          divCorrect.style.width = `${WIDTH - 200}px`;
          divCorrect.style.height = `${HEIGHT - 200}px`;
          document.getElementById("game").appendChild(divCorrect);
  
          // TEXTO DA INSTRUÇÃO
          divCorrect.innerHTML = `<span id="instrucao3">Você acertou!<br>
                                  ${numberA} ${sinal} ${numberB} = ${numberC}</span><br>
                                  <span id="aperte3">Aperte "Espaço" para continuar o jogo</span>`;
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
        answer = teclas[index].type;
        equacao.mudar();
        audio[a1].play();
        a1 += 1;
        if (a1 == 7) a1 = 0;
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
          divRestart = null;
          flag = false;
        } // end if
      } // end if
    } // end if
  } // end errorHandler

  ///////////////////////////////////////////////////////////////////////////////////////////////
  async function continueHandler(e){
    if (flag == true){ // se a flag for true
      if (e.key == " ") { // se a tecla for espaço
        if (divCorrect != null){
          divCorrect.remove(); // remove a instrução
          divCorrect = null;
          flag = false;
          equacao.set();
          answer = "";
        } // end if
      } // end if
    } // end if
  } // end continueHandler

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
  document.addEventListener("keydown", continueHandler); // evento de teclado

  // INICIA A TELA
  document.addEventListener("DOMContentLoaded", function() {
    init();
  });
  
})(); // end script
