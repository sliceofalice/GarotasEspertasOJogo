(function (){

    const WIDTH = 800;
    const HEIGHT = 450;

    const FPS = 100;
    let frame = 0;

    let gameLoop;
    let game;

    let cientistas = ['hipatia', 'adalovelace', 'hedylamarr', 'joanclarke'];
    let index;

    let fundo;
    let tela;
    let jogar;
    let texto1;
    let texto2;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function init() {

        // GAME LOOP
        gameLoop = setInterval(run, 1000/FPS); // inicia o game loop
        
        // CRIA OS ELEMENTOS
        fundo = new Fundo(); // cria o fundo

        // DEFINE A INTRO
        cientistas.forEach(cientista => {
            if (cientista == game.id) {
                index = cientistas.indexOf(cientista); // pega o index do cientista
                return; // sai do loop
            } // end if
        }); // end forEach

        // CRIA OS ELEMENTOS
        tela = new Tela(index); // cria a tela
        jogar = new Jogar(index); // cria o jogar

        // CRIA OS TEXTOS
        texto1 = new Texto(1, WIDTH/1.79, HEIGHT/10, index);
        texto2 = new Texto(2, WIDTH/1.79, HEIGHT/2.5, index);
        texto1.escrever();
        texto2.escrever();

    } // end init

    ///////////////////////////////////////////////////////////////////////////////////////////////
    class Fundo{

        constructor() {
                
            // ELEMENTO FUNDO
            this.element = document.createElement('div');
            this.element.className = 'fundo';
            this.element.style.width = `${WIDTH}px`;
            this.element.style.height = `${HEIGHT}px`;
            game = document.querySelector('.game'); // pega o elemento com a classe 'game'
            game.appendChild(this.element); // adiciona o fundo ao game

        } // end constructor

    } // end fundo
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    class Tela {

        constructor(number) {

            // ELEMENTO TELA
            this.element = document.createElement('div');
            this.element.className = 'tela';
            this.element.style.width = `${WIDTH}px`;
            this.element.style.height = `${HEIGHT}px`;
            fundo.element.appendChild(this.element); // adiciona a tela ao fundo 

            this.number = number; // número da tela

            // background
            this.backgroundImage = {
                tela1_hipatia : 'url(../../media/img/hipatia/intro/intro1.png)',
                tela2_hipatia : 'url(../../media/img/hipatia/intro/intro2.png)',

                tela1_adalovelace : 'url(../../media/img/adalovelace/intro/intro1.png)',
                tela2_adalovelace : 'url(../../media/img/adalovelace/intro/intro2.png)',

                tela1_hedy : 'url(../../media/img/hedylamarr/intro/intro1.png)',
                tela2_hedy : 'url(../../media/img/hedylamarr/intro/intro2.png)',

                tela1_joanclarke : 'url(../../media/img/joanclarke/intro/intro1.png)',
                tela2_joanclarke : 'url(../../media/img/joanclarke/intro/intro2.png)'
            } // end backgroundImage

        } // end constructor

        mudar() {
            let telas1 = ['tela1_hipatia', 'tela1_adalovelace', 'tela1_hedy', 'tela1_joanclarke'];
            let telas2 = ['tela2_hipatia', 'tela2_adalovelace', 'tela2_hedy', 'tela2_joanclarke'];
            if (frame == 0) this.element.style.backgroundImage = this.backgroundImage[telas1[this.number]];
            if (frame == FPS/2) this.element.style.backgroundImage = this.backgroundImage[telas2[this.number]];
        } // end mudar

    } // end tela

    ///////////////////////////////////////////////////////////////////////////////////////////////
    class Jogar {
        
        constructor(number) {

            // ELEMENTO JOGAR
            this.element = document.createElement('div');
            this.element.className = 'jogar';
            this.element.style.width = `${WIDTH}px`;
            this.element.style.height = `${HEIGHT}px`;
            fundo.element.appendChild(this.element); // adiciona o jogar ao fundo

            this.number = number; // número do jogar

            this.backgroundImage = {
                hipatia : 'url(../../media/img/hipatia/intro/jogar.png)',
                adalovelace : 'url(../../media/img/adalovelace/intro/jogar.png)',
                hedylamarr : 'url(../../media/img/hedylamarr/intro/jogar.png)',
                joanclarke : 'url(../../media/img/joanclarke/intro/jogar.png)'
            } // end backgroundImage

        } // end constructor

        aparecer() {
            let urls = [this.backgroundImage.hipatia, this.backgroundImage.adalovelace, this.backgroundImage.hedylamarr, this.backgroundImage.joanclarke];
            this.element.style.backgroundImage = urls[this.number];
        } // end aparecer

        reverter() {
            this.element.style.backgroundImage = 'none';
        } // end reverter

    } // end jogar

    ///////////////////////////////////////////////////////////////////////////////////////////////
    class Texto {

        constructor(i, w, h, number) {
                
            // ELEMENTO TEXTO
            this.element = document.createElement('div');
            this.element.className = 'texto';
            this.element.style.width = `${w}px`;
            this.element.style.height = `${h}px`;
            this.element.id = `texto${i}`; // id do texto
            tela.element.appendChild(this.element); // adiciona o texto ao fundo

            this.number = number; // número do texto
            
        } // end constructor

        escrever() {
            
            if (this.number == 0) {

                if (this.element.id == 'texto1') {
                    this.element.style.color = '#DED552';
                    this.element.innerHTML = 'e os estudos sobre a matemática';
                } // end if
                if (this.element.id == 'texto2') {
                    this.element.style.color = '#464646';
                    this.element.innerHTML = `Hipátia foi uma matemática,<br>
                                            astrônoma e filósofa grega.<br>
                                            Ela foi a primeira mulher a estudar e ensinar<br>
                                            matemática, além de ser uma das primeiras<br>
                                            mulheres a estudar astronomia.
                                            <br><br>
                                            Neste jogo, você deve ajudar Hipátia a resolver<br>
                                            uma equação matemática.<br>
                                            Utilize o mouse para jogar.`;
                } // end if

            } else if (this.number == 1) {

                if (this.element.id == 'texto1') {
                    this.element.style.color = '#E1AEE0';
                    this.element.innerHTML = 'e a criação de algoritmo';
                } // end if
                if (this.element.id == 'texto2') {
                    this.element.style.color = '#464646';
                    this.element.innerHTML = `Ada Lovelace foi uma matemática e escritora inglesa.<br><br>
                                            Ela criou o primeiro algoritmo da história.<br>
                                            Um algoritmo é uma sequência de ações que devem ser 
                                            executadas para resolver um problema.
                                            <br><br>
                                            Ajude Ada a criar um algoritmo para resgatar<br>
                                            seu cachorrinho passando pelo labirinto.<br>
                                            Use as setas do teclado para criar uma sequência.<br>`;
                } // end if

            } else if (this.number == 2) {

                if (this.element.id == 'texto1') {
                    this.element.style.color = '#8194C9';
                    this.element.innerHTML = 'e a ideia que surgiu de um dueto';
                } // end if
                if (this.element.id == 'texto2') {
                    this.element.style.color = '#464646';
                    this.element.innerHTML = `Hedy Lamarr foi uma atriz e cientista austríaca.<br>
                                            Ela utilizou a Música para criar o sistema de 
                                            comunicação sem fio que deu origem ao Wi-fi e 
                                            ao Bluetooth.<br>
                                            A ideia para a invenção surgiu ao brincar de dueto com 
                                            um amigo, onde um tocava o piano e o outro repetia 
                                            as notas.
                                            <br><br>
                                            Neste jogo, você deve repetir a sequência de notas 
                                            que Hedy apresentar, assim como ela fez com seu amigo.<br>
                                            Clique nas teclas do piano para tocar as notas.`;
                } // end if

            } else if (this.number == 3) {

                if (this.element.id == 'texto1') {
                    this.element.style.color = '#C49461';
                    this.element.innerHTML = 'e o trabalho com a criptografia';
                } // end if
                if (this.element.id == 'texto2') {
                    this.element.style.color = '#464646';
                    this.element.innerHTML = `Joan Clarke foi a única mulher a trabalhar com<br>
                                            o processo criptográfico desenvolvido por Alan Turing<br>
                                            durante a Segunda Guerra Mundial para desenvendar<br>
                                            as mensagens do Enigma.
                                            <br><br>
                                            Neste jogo, dado uma chave criptográfica,<br>
                                            seu objetivo é utilizar a lógica e descobrir<br>
                                            a palavra secreta que está codificada.<br>
                                            Utilize o mouse para jogar.`;
                } // end if

            } // end if/else

        } // end escrever

    } // end texto

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function isInside(x, y, xMin, yMin, width, height) {
        return x >= xMin && x <= xMin + width && y >= yMin && y <= yMin + height;
    } // end isInside

    ///////////////////////////////////////////////////////////////////////////////////////////////
    window.addEventListener('mousemove', function(e) {

        const rect = tela.element.getBoundingClientRect(); // pega o tamanho da tela
        const x = e.clientX - rect.left; // posição do mouse no eixo x
        const y = e.clientY - rect.top; // posição do mouse no eixo y

        // se o mouse estiver sobre o jogar
        if (isInside(x, y, 454, 360, 168, 65)) {
            jogar.aparecer(); // muda o jogar
        } else {
            jogar.reverter(); // muda o jogar
        } // end if/else

    }); // end mouseover

    ///////////////////////////////////////////////////////////////////////////////////////////////
    window.addEventListener('click', function(e) {

        const rect = tela.element.getBoundingClientRect(); // pega o tamanho da tela
        const x = e.clientX - rect.left; // posição do mouse no eixo x
        const y = e.clientY - rect.top; // posição do mouse no eixo y
        
        // se o mouse estiver sobre o jogar
        if (isInside(x, y, 454, 360, 168, 65)) {
            if (index == 0) window.location.href = `../game/hipatia.html`;
            else if (index == 1) window.location.href = `../game/adalovelace.html`;
            else if (index == 2) window.location.href = `../game/hedylamarr.html`;
            else if (index == 3) window.location.href = `../game/joanclarke.html`;
        } else if (isInside(x, y, 16, 12, 50, 30)){ // se o mouse estiver sobre a tecla e a tecla não estiver ativa
            history.back(); // volta para o menu
        } // end if

    }); // end click

    ///////////////////////////////////////////////////////////////////////////////////////////////
    window.addEventListener('mousemove', function(e) {

        const rect = tela.element.getBoundingClientRect(); // pega o tamanho da tela
        const x = e.clientX - rect.left; // posição do mouse no eixo x
        const y = e.clientY - rect.top; // posição do mouse no eixo y

        // se o mouse estiver sobre a tecla voltar
        if (isInside(x, y, 16, 12, 50, 30) || isInside(x, y, 454, 360, 168, 65)){
            document.body.style.cursor = 'pointer'; // cursor de mão
        } else {
            document.body.style.cursor = 'default'; // cursor padrão
        } // end if/else

    }); // end mousemove

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function run() {
        
        // FRAME
        frame += 1; // incrementa o frame
        if (frame == FPS) frame = 0; // reseta o frame

        // MUDAR
        tela.mudar(); // muda a tela
    
    } // end run
    
    // INICIA A TELA
    document.addEventListener("DOMContentLoaded", function() {
        init();
    });

})() // end script
