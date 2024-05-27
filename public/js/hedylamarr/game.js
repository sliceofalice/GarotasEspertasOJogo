(function () {
  const WIDTH = 800;
  const HEIGHT = 450;

  const FPS = 100;
  let frame = 0;

  let gameLoop;

  let fundo;
  let tela;

  let tecla = [];
  let nota = [];

  let audio = [];

  let letters = ["C", "D", "E", "F", "G", "A", "B"];
  let sound = [
    "../../media/sound/piano/C4.mp3",
    "../../media/sound/piano/D4.mp3",
    "../../media/sound/piano/E4.mp3",
    "../../media/sound/piano/F4.mp3",
    "../../media/sound/piano/G4.mp3",
    "../../media/sound/piano/A4.mp3",
    "../../media/sound/piano/B4.mp3",
  ];

  let status = 0;
  let latest = 0;
  let playing = 0;

  let score = 0;
  let divScore;
  let sequence = [];
  let player = [];

  let lastClickTime = 0; // Variável para armazenar o tempo do último clique

  let flag = true;

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function init() { 
    
    // GAME
    game(); // inicia o jogo

    // CRIA OS ELEMENTOS
    fundo = new Fundo(); // cria o fundo
    tela = new Tela(); // cria a tela
    divScore = new Pontuação(); // cria a pontuação

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
    divLevel.innerHTML = `<span id="instrucao">Repita a sequência de notas<br>que Hedy Lamarr tocar.<br><br>
                            Utilize o mouse para clicar nas notas.</span><br>
                            <span id="aperte">Aperte "Espaço" para começar</span>`;

    window.addEventListener("keydown", function (e) {

      if (flag == true){ // se a flag for true
        if (e.key == " ") { // se a tecla for espaço
          divLevel.remove(); // remove a instrução
          flag = false; // muda a flag para false
          start(); // inicia o jogo
        } // end if
      } // end 
      
    }); // end addEventListener
  
  } // end 
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  function start(){

    player = [];

    // GAME LOOP
    gameLoop = setInterval(run, 1000 / FPS); // inicia o game

    // CRIA OS ELEMENTOS
    for (let t = 0; t < 7; t++) tecla.push(new Tecla(t)); // cria a tecla e adiciona ao array
    for (let n = 0; n < 7; n++) nota.push(new Nota(n)); // cria a nota e adiciona ao array
    for (let n = 0; n < 7; n++) audio.push(new Audio(sound[n])); // cria o audio e adiciona ao array
    
    // AUDIO
    audio.forEach((audio) => {
      audio.addEventListener("timeupdate", function () {
        if (audio.currentTime >= 0.7) {
          audio.pause(); // para o audio após 0.7 segundo
          audio.currentTime = 0;
        } // end if
      }); // end addEventListener
      audio.load();
    }); // end forEach

    play(); // inicia o jogo


  } // end start

  ///////////////////////////////////////////////////////////////////////////////////////////////
  async function play() {
    player = [];
    await new Promise((resolve) => {
      setTimeout(resolve, 1000); // espera 1 segundo
    }); // end Promise
    randomNote(); // gera nota
    document.removeEventListener("click", clickHandler1);
    document.removeEventListener("mousemove", mouseHandler1);
    await playSequence(); // toca a sequência de 
    document.addEventListener("mousemove", mouseHandler1);
    document.addEventListener("click", clickHandler1);
  } // end play
  
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
    divEnd.innerHTML = `<span id="pontuacao">Pontuação: ${score}</span><br>
                          <span id="aperte2">Aperte "Espaço" para jogar novamente</span>`;

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
  function randomNote() {
    const randomIndex = Math.floor(Math.random() * letters.length); // gera nota aleatoria
    sequence.push(randomIndex); // adiciona a nota ao array
  } // end randomNote
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  async function playSequence() {
    active = false; // desativa o mouse
    for (const noteIndex of sequence) {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000); // espera 1 segundo
      }); // end Promise
      await playAndAppear(noteIndex); // toca e mostra a 
    } // end for
    await new Promise((resolve) => {
      setTimeout(resolve, 1000); // espera 1 segundo
    }); // end Promise
    active = true; // ativa o mouse
  } // end playSequence

  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  function playAndAppear(noteIndex) {

    // Promise para tocar e mostrar uma nota
    new Promise((resolve) => {
      nota[noteIndex].aparecer(); // mostra a nota na tela
      audio[noteIndex].play(); // toca o áudio da nota
      audio[noteIndex].addEventListener('ended', function() {
        resolve(); // resolve a promessa quando a nota terminar de tocar
      }); // end addEventListener
    }); // end Promise

  } // end playAndAppear

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
        tela1: "url(../../media/img/hedylamarr/tela1.png)",
        tela2: "url(../../media/img/hedylamarr/tela2.png)",
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
      this.element = document.createElement("div");
      this.element.className = "tecla";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona a tecla a tela

      // NUMERO E LETRA DA TECLA
      this.number = number;
      this.letter = letters[this.number];
      this.element.id = `tecla${this.letter}`;

      // background
      this.backgroundImage = {
        teclaC: "url(../../media/img/hedylamarr/teclas/teclaC.png)",
        teclaD: "url(../../media/img/hedylamarr/teclas/teclaD.png)",
        teclaE: "url(../../media/img/hedylamarr/teclas/teclaE.png)",
        teclaF: "url(../../media/img/hedylamarr/teclas/teclaF.png)",
        teclaG: "url(../../media/img/hedylamarr/teclas/teclaG.png)",
        teclaA: "url(../../media/img/hedylamarr/teclas/teclaA.png)",
        teclaB: "url(../../media/img/hedylamarr/teclas/teclaB.png)",
      }; // end backgroundImage

    } // end constructor

    mudar() {

      let teclas = [
        this.backgroundImage.teclaC,
        this.backgroundImage.teclaD,
        this.backgroundImage.teclaE,
        this.backgroundImage.teclaF,
        this.backgroundImage.teclaG,
        this.backgroundImage.teclaA,
        this.backgroundImage.teclaB,
      ];

      this.element.style.backgroundImage = teclas[this.number];

    } // end mudar

    reverter() {
      this.element.style.backgroundImage = "none";
    } // end reverter

  } // end tecla

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Nota {

    constructor(number) {

      // ELEMENTO NOTA
      this.element = document.createElement("div");
      this.element.className = "nota";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona a nota a tela

      // NUMERO E LETRA DA NOTA
      this.number = number;
      this.letter = letters[this.number];
      this.element.id = `nota${this.letter}`;

      // background
      this.backgroundImage = {
        notaC: "url(../../media/img/hedylamarr/notas/notaC.png)",
        notaD: "url(../../media/img/hedylamarr/notas/notaD.png)",
        notaE: "url(../../media/img/hedylamarr/notas/notaE.png)",
        notaF: "url(../../media/img/hedylamarr/notas/notaF.png)",
        notaG: "url(../../media/img/hedylamarr/notas/notaG.png)",
        notaA: "url(../../media/img/hedylamarr/notas/notaA.png)",
        notaB: "url(../../media/img/hedylamarr/notas/notaB.png)",
      }; // end backgroundImage

    } // end constructor

    aparecer() {

      // POSIÇÃO INICIAL
      let pixel = 50; //
      this.element.style.top = `${pixel}px`;

      // DEFINE A NOTA
      let notas = [
        this.backgroundImage.notaC,
        this.backgroundImage.notaD,
        this.backgroundImage.notaE,
        this.backgroundImage.notaF,
        this.backgroundImage.notaG,
        this.backgroundImage.notaA,
        this.backgroundImage.notaB,
      ];
      this.element.style.backgroundImage = notas[this.number];

      // ANIMAÇÃO
      const intervalId = setInterval(() => {
        pixel -= 1; // incrementa o pixel
        this.element.style.top = `${pixel}px`; // muda a posição da nota
        tecla[this.number].mudar(); // muda a tecla
        playing = 1; // ativa o status de playing
  
        // SE A NOTA CHEGAR AO TOPO
        if (pixel === -30) {
          this.element.style.backgroundImage = "none"; // remove a nota
          tecla[this.number].reverter(); // reverte a tecla
          playing = 0; // desativa o status de playing
          clearInterval(intervalId); // para a animação
          return; // retorna
        } // end if
      }, 1000 / FPS); // end setInterval

    } // end aparecer

  } // end nota

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Pontuação {

    constructor() {
        
        // ELEMENTO PONTUAÇÃO
        this.element = document.createElement("div");
        this.element.className = "pontuacao";
        this.element.style.width = `${WIDTH - 550}px`;
        this.element.style.height = `${HEIGHT - 350}px`;
        fundo.element.appendChild(this.element); // adiciona a pontuação a tela

        // TEXTO DA PONTUAÇÃO
        this.element.innerHTML = `<span id=texto1>Pontuação</span>
                                  <span id=texto2>${score}</span>`; // pontuação inicial
  
      } // end constructor
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function isInside(x, y, xMin, yMin, width, height) {
    return x >= xMin && x <= xMin + width && y >= yMin && y <= yMin + height;
  } // end isInside

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function isInsideArea(x, y, xMin, yMin, width, height) {

    // verifica se o mouse está sobre a tecla preta
    let inside = [
      isInside(x, y, 427, 184, 30, 135),
      isInside(x, y, 477, 184, 30, 135),
      isInside(x, y, 587, 184, 30, 135),
      isInside(x, y, 637, 184, 30, 135),
      isInside(x, y, 687, 184, 30, 135),
    ];

    // se o mouse estiver sobre a tecla preta
    if (inside.some((isInside) => isInside)) {
      return false; // retorna false
    } else {
      return isInside(x, y, xMin, yMin, width, height); // verifica se o mouse está sobre a tecla branca
    } // end if/else

  } // end isInsideTecla  

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function mouseHandler1(e) {

    const rect = tela.element.getBoundingClientRect(); // pega o tamanho da tela
    const x = e.clientX - rect.left; // posição do mouse no eixo x
    const y = e.clientY - rect.top; // posição do mouse no eixo y

    // verifica se o mouse está sobre a tecla
    let inside = [
      isInsideArea(x, y, 390, 185, 50, 235),
      isInsideArea(x, y, 440, 185, 50, 235),
      isInsideArea(x, y, 490, 185, 50, 235),
      isInsideArea(x, y, 540, 185, 50, 235),
      isInsideArea(x, y, 590, 185, 50, 235),
      isInsideArea(x, y, 640, 185, 50, 235),
      isInsideArea(x, y, 690, 185, 50, 235),
    ];

    const index = inside.findIndex((isInside) => isInside); // retorna o index do array que é true

    // se o mouse estiver sobre a tecla
    if (index != -1 && latest == status) {
      // se o mouse estiver sobre a tecla e a tecla estiver ativa
      document.body.style.cursor = "pointer"; // cursor de mão
      tecla[index].mudar(); // muda a tecla
      latest = status;
      status = index;
    } else if (index != -1 && latest != status) {
      // se o mouse estiver sobre a tecla e a tecla não estiver ativa
      document.body.style.cursor = "default"; // cursor padrão
      tecla.forEach((tecla) => tecla.reverter()); // reverte a tecla
      latest = status;
      status = index;
    } else if (playing == 1) {
      // se o mouse não estiver sobre a tecla
      document.body.style.cursor = "default"; // cursor padrão
    } else if (isInside(x, y, 16, 12, 50, 30)) {
      // se o mouse estiver sobre a tecla
      document.body.style.cursor = "pointer"; // cursor de mão
    } else {
      // se o mouse não estiver sobre a tecla
      document.body.style.cursor = "default"; // cursor padrão
      tecla.forEach((tecla) => tecla.reverter()); // reverte a tecla
      latest = status;
      status = index;
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

  /////////////////////////////////////////////////////////////////////////////////////////////

  async function clickHandler1(e) {

    const currentTime = new Date().getTime(); // obtém o tempo atual em milissegundos
    const minClickInterval = 500; // define o intervalo mínimo entre cliques em milissegundos

    // verifica se o intervalo de tempo desde o último clique é maior que o intervalo mínimo
    if (currentTime - lastClickTime < minClickInterval) {
      // se for menor, desconsidera o clique
      return;
    } // end if

    lastClickTime = currentTime; // atualiza o tempo do último clique
    
    const rect = tela.element.getBoundingClientRect(); // pega o tamanho do menu
    const x = e.clientX - rect.left; // posição do mouse no eixo x
    const y = e.clientY - rect.top; // posição do mouse no eixo y

    // verifica se o mouse está sobre a tecla
    let inside = [
      isInsideArea(x, y, 390, 185, 50, 235),
      isInsideArea(x, y, 440, 185, 50, 235),
      isInsideArea(x, y, 490, 185, 50, 235),
      isInsideArea(x, y, 540, 185, 50, 235),
      isInsideArea(x, y, 590, 185, 50, 235),
      isInsideArea(x, y, 640, 185, 50, 235),
      isInsideArea(x, y, 690, 185, 50, 235),
    ];

    const index = inside.findIndex((isInside) => isInside); // retorna o index do array que é true

    // se o mouse estiver sobre a tecla
    if (index != -1 && index < 7) {
      await playAndAppear(index); // toca e mostra a nota
    } // end if

    if (index != sequence[player.length]) {
      await new Promise((resolve) => {
        setTimeout(resolve, 500); // espera 0.5 segundo
      }); // end Promise
      await clearInterval(gameLoop);
      await endGame();
    } else if (player.length + 1 == sequence.length){
      score += 10; // incrementa a pontuação
      divScore = new Pontuação(); // cria a pontuação
      play(); // inicia novo nível
    } else {
      score += 10; // incrementa a pontuação
      divScore = new Pontuação(); // cria a pontuação
      player.push(index); // adiciona a nota ao array
    } // end if/else

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

  // INICIA A TELA
  document.addEventListener("DOMContentLoaded", function() {
    init();
  });
  
})(); // end script
