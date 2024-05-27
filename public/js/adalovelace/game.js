(function () {
  const WIDTH = 800;
  const HEIGHT = 450;

  const FPS = 100;
  let frame = 0;

  let gameLoop;

  let fundo;
  let tela;

  let teclas = [];

  let player;
  let dog;
  let grade;

  let labirinto;
  let nLabirinto = 1;

  let algorithm = [];
  let leftTecla = 0;
  let topTecla = 0;

  let divLimite = null;
  let divRestart = null;

  let posX = 5;
  let posY = 0;

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
  let a2 = 0;

  let flag = true;

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function init() { 
    
    // GAME
    game(); // inicia o jogo

    // CRIA OS ELEMENTOS
    fundo = new Fundo(); // cria o fundo
    tela = new Tela(); // cria a tela
    grade = new Grade(); // cria a grade

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
    divLevel.innerHTML = `<span id="instrucao">Utilize as setas do teclado ou WASD<br>para escrever o algoritmo.<br><br>
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
    for (let i = 0; i < 2; i++) teclas.push(new Tecla(i));
    for (let n = 0; n < 7; n++) audio.push(new Audio(sound[n])); // cria o audio e adiciona ao array
    player = new Player(); // cria o player
    dog = new Dog(); // cria o dog

    // MOVIMENTACÃO DO PLAYER
    document.addEventListener("keydown", algorithmHandler); // evento de teclado

    labirinto = new Labirinto(nLabirinto); // cria o labirinto 1;
    
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
    document.removeEventListener("keydown", algorithmHandler);

    // CRIA ELEMENTO DA MENSAGEM DO JOGO
    let divEnd = document.createElement("div");
    divEnd.className = "end";
    divEnd.style.width = `${WIDTH - 200}px`;
    divEnd.style.height = `${HEIGHT - 200}px`;
    document.getElementById("game").appendChild(divEnd);

    // TEXTO DA MENSAGEM DO JOGO
    divEnd.innerHTML = `<span id="parabens">Parabéns! Você completou o desafio!</span><br>
                          <span id="aperte4">Aperte "Espaço" para jogar novamente</span>`;

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
        tela1: "url(../../media/img/adalovelace/tela1.png)",
        tela2: "url(../../media/img/adalovelace/tela2.png)",
      }; // end backgroundImage

    } // end constructor

    mudar() {
      if (frame == 0) this.element.style.backgroundImage = this.backgroundImage.tela1;
      if (frame == FPS / 2) this.element.style.backgroundImage = this.backgroundImage.tela2;
    } // end mudar

  } // end tela

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class TeclaMove {

    constructor(string) {

      // ELEMENTO TECLA
      this.element = document.createElement('div');
      this.element.className = 'teclaMove';
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona a tecla ao fundo

      this.type = string.toLowerCase();

      if (string == "w") this.number = 0;
      if (string == "a") this.number = 1;
      if (string == "s") this.number = 2;
      if (string == "d") this.number = 3;

      this.backgroundImage = {
        w: "url(../../media/img/adalovelace/teclas/teclaW.png)",
        a: "url(../../media/img/adalovelace/teclas/teclaA.png)",
        s: "url(../../media/img/adalovelace/teclas/teclaS.png)",
        d: "url(../../media/img/adalovelace/teclas/teclaD.png)",
      } // end backgroundImage

    } // end constructor

    aparecer() {
      let urls = [this.backgroundImage.w, this.backgroundImage.a, this.backgroundImage.s, this.backgroundImage.d];
      this.element.style.backgroundImage = urls[this.number];
      this.element.style.left = `${leftTecla}px`;
      this.element.style.top = `${topTecla}px`;
      leftTecla += 45;

      if (leftTecla > 720) {
        leftTecla = 0;
        topTecla += 45;
      } // end if
      
    } // end aparecer

  } // end TeclaMove

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
        apagar: "url(../../media/img/adalovelace/teclas/apagar.png)",
        testar: "url(../../media/img/adalovelace/teclas/testar.png)",
      } // end backgroundImage

    } // end constructor

    aparecer() {
      let urls = [this.backgroundImage.apagar, this.backgroundImage.testar];
      this.element.style.backgroundImage = urls[this.number];
    } // end aparecer

    reverter() {
      this.element.style.backgroundImage = 'none';
    } // end reverter

  } // end Tecla

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Grade {

    constructor() {

      // ELEMENTO GRADE
      this.element = document.createElement("div");
      this.element.className = "grade";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona a grade ao fundo

    } // end constructor

  } // end grade

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Player {
      
    constructor() {
  
      // ELEMENTO PLAYER
      this.element = document.createElement("div");
      this.element.className = "player";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona o player à tela
  
    } // end constructor

    async mover(string) {

      if (string.includes("w") && labirinto.labirinto[posX][posY].w == 1) {
        this.element.style.top = `${parseInt(this.element.style.top || 0) - 35}px`;
        posX -= 1;
      } // end if
      if (string.includes("a") && labirinto.labirinto[posX][posY].a == 1) {
        this.element.style.left = `${parseInt(this.element.style.left || 0) - 35}px`;
        posY -= 1;
      } // end if
      if (string.includes("s") && labirinto.labirinto[posX][posY].s == 1) {
        this.element.style.top = `${parseInt(this.element.style.top || 0) + 35}px`;
        posX += 1;
      } // end if
      if (string.includes("d") && labirinto.labirinto[posX][posY].d == 1) {
        this.element.style.left = `${parseInt(this.element.style.left || 0) + 35}px`;
        posY += 1;
      } // end if

      audio[a1].play();
      a1 += 1;
      if (a1 == 7) a1 = 0;

      void this.element.offsetWidth; // reinicia a animação

    } // end mover

    reset() {
      posX = 5;
      posY = 0;
      this.element.style.top = 0;
      this.element.style.left = 0;
      void this.element.offsetWidth;
    }
  
  } // end player

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Dog {
      
    constructor() {
  
      // ELEMENTO PLAYER
      this.element = document.createElement("div");
      this.element.className = "dog";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      fundo.element.appendChild(this.element); // adiciona o dog à tela
  
    } // end constructor
  
  } // end dog

  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Posicao {
        
    constructor(string) {
    
      // ELEMENTO POSICAO
      this.w = 0;
      this.a = 0;
      this.s = 0;
      this.d = 0;

      // se a string incluir a letra, está disponível
      if (string.includes("w")) this.w = 1;
      if (string.includes("a")) this.a = 1;
      if (string.includes("s")) this.s = 1;
      if (string.includes("d")) this.d = 1;

    } // end constructor

  } // end Posicao
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  class Labirinto {
    
    constructor(number) {

      // ELEMENTO LABIRINTO
      this.number = number;

      this.element = document.createElement("div");
      this.element.className = "labirinto";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      this.element.style.backgroundImage = `url(../../media/img/adalovelace/labirinto/labirinto${number}.png)`;
      fundo.element.appendChild(this.element); // adiciona o labirinto à tela

      this.data = {
        labirinto1: `sd/ad/asd/ad/as/sd/ad/as/d/as/sd/ws/s/ws/d/was/w/sd/wa/sd/wad/was/wd/wa/wsd/as/wd/as/ws/sd/wad/
        as/w/sd/ad/was/wd/as/wd/was/ws/sd/wa/s/ws/s/wsd/a/wd/as/ws/w/ws/sd/was/w/wd/wad/a/d/wa/wd/ad/wad/wa/w`
      }
      
      this.labirinto = this.valores(number);

    } // end constructor

    valores(number) {
  
      let matriz = []; // cria matriz
      let data = ""; // dados do labirinto

      // LEITURA DOS DADOS

      if (number == 1) {
        data = this.data.labirinto1;
      } // end if
      
      let linhas = data.split('/'); // separa as linhas
      let k = 0;
    
      for (let i = 0; i < 6; i++) {
        matriz[i] = [];
        for (let j = 0; j < 11; j++) {
          matriz[i][j] = new Posicao(linhas[k]); // inicializa a posição
          k += 1;
        } // end for
      } // end for
    
      return matriz;

    } // end valores
    
  } // end Labirinto

  ///////////////////////////////////////////////////////////////////////////////////////////////
  async function movePlayer() {
    for (let i = 0; i < algorithm.length; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          flag = true; // muda a flag para true
          player.mover(algorithm[i].type); // move o jogador
          resolve(); // resolve a promisse
        }, 500); // tempo de espera
      }); // end promise
    } // end for
    flag = false; // muda a flag para false
  } // end movePlayer

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function algorithmHandler(e) {

    if (flag == false) { 

      let key;

      if (e.key == "ArrowUp" || e.key == "w") key = "w";
      if (e.key == "ArrowDown" || e.key == "s") key = "s";
      if (e.key == "ArrowLeft" || e.key == "a") key = "a";
      if (e.key == "ArrowRight" || e.key == "d") key = "d";

      if (key && (algorithm.length < 32)){
        let teclaMove = new TeclaMove(key);

        teclaMove.aparecer(); // aparece a tecla
        algorithm.push(teclaMove); // adiciona a tecla ao algoritmo

        audio[a2].play();
        a2 += 1;
        if (a2 == 7) a2 = 0;

        if (algorithm.length == 32) {
          flag = true; // muda a flag para true

          // CRIA O ELEMENTO DIV DA INSTRUÇÃO
          divLimite = document.createElement("div");
          divLimite.className = "limite";
          divLimite.style.width = `${WIDTH - 200}px`;
          divLimite.style.height = `${HEIGHT - 200}px`;
          document.getElementById("game").appendChild(divLimite);

          // TEXTO DA INSTRUÇÃO
          divLimite.innerHTML = `<span id="instrucao2">Limite de instruções atingido!<br>
                                  Apague algumas instruções e tente novamente.</span><br>
                                  <span id="aperte2">Aperte "Espaço" para retomar</span>`;
        } // end if
      } // end if
    } // end if
  
  } // end algorithmHandler

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function isInside(x, y, xMin, yMin, width, height) {
    return x >= xMin && x <= xMin + width && y >= yMin && y <= yMin + height;
  } // end isInside

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function mouseHandler1(e) {

    const rect = tela.element.getBoundingClientRect(); // pega o tamanho da tela
    const x = e.clientX - rect.left; // posição do mouse no eixo x
    const y = e.clientY - rect.top; // posição do mouse no eixo y

    if (isInside(x, y, 688, 400, 25, 35)) {
      // se o mouse estiver sobre a tecla APAGAR
      document.body.style.cursor = "pointer"; // cursor de mão
      teclas[0].aparecer(); // aparece a tecla
    } else if (isInside(x, y, 735, 400, 30, 35)) {
      // se o mouse estiver sobre a tecla TESTAR
      document.body.style.cursor = "pointer"; // cursor de mão
      teclas[1].aparecer(); // aparece a tecla
    } else if (isInside(x, y, 16, 12, 50, 30)) {
      // se o mouse estiver sobre a tecla
      document.body.style.cursor = "pointer"; // cursor de mão
    } else {
      for (let i = 0; i < 2; i++) teclas[i].reverter(); // reverte a tecla
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

    if (isInside(x, y, 688, 400, 25, 35) && algorithm.length > 0 && flag == false) {

      // se o mouse estiver sobre a tecla APAGAR e houver instruções
      if (leftTecla <= 720 && topTecla >= 0) {
        leftTecla -= 45; // decrementa a posição no eixo x
      } // end if
      if (leftTecla == 0 && topTecla == 45) {
        leftTecla = 720; // muda a posição no eixo x
        topTecla -= 45; // decrementa a posição no eixo y
      } // end if
      algorithm[algorithm.length - 1].element.remove(); // remove a tecla
      algorithm.pop(); // remove a última instrução

    } else if (isInside(x, y, 735, 400, 30, 35) && algorithm.length > 0 && flag == false) {

      // se o mouse estiver sobre a tecla TESTAR e houver instruções
      await movePlayer();
      await new Promise((resolve) => {
        setTimeout(resolve, 1000); // espera 1 segundo
      }); // end Promise

      if (posX == 0 && posY == 11) {

        await new Promise((resolve) => {
          setTimeout(resolve, 500); // espera 0.5 segundo
        }); // end Promise
        await clearInterval(gameLoop);
        await endGame();

      } else {

        flag = true;

        // CRIA O ELEMENTO DIV DA INSTRUÇÃO
        divRestart= document.createElement("div");
        divRestart.className = "restart";
        divRestart.style.width = `${WIDTH - 200}px`;
        divRestart.style.height = `${HEIGHT - 200}px`;
        document.getElementById("game").appendChild(divRestart);

        // TEXTO DA INSTRUÇÃO
        divRestart.innerHTML = `<span id="instrucao3">Erro no algoritmo criado!<br>
                                Tente novamente.</span><br>
                                <span id="aperte3">Aperte "Espaço" para retomar</span>`;

      } // end if/else
    } // end if)

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
  function limitHandler(e) {
    if (flag == true){ // se a flag for true
      if (e.key == " ") { // se a tecla for espaço
        if (divLimite != null) divLimite.remove(); // remove a instrução
      } // end if
    } // end if
  } // end limitHandler

  ///////////////////////////////////////////////////////////////////////////////////////////////
  function errorHandler(e) {
    if (flag == true){ // se a flag for true
      if (e.key == " ") { // se a tecla for espaço
        if (divRestart != null){
          divRestart.remove(); // remove a instrução
          flag = false;
          player.reset();
        } // end if
      } // end if
    } // end if
  }

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

  document.addEventListener("keydown", limitHandler); // evento de teclado
  document.addEventListener("keydown", errorHandler); // evento de teclado

  // INICIA A TELA
  document.addEventListener("DOMContentLoaded", function() {
    init();
  });
  
})(); // end script
