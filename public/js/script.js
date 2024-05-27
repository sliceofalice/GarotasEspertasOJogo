(function (){

    const WIDTH = 800;
    const HEIGHT = 450;

    const FPS = 100;
    let frame = 0;

    let gameLoop;
    let menu;

    let livros = [];
    let capa = [];

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function init() {

        // GAME LOOP
        gameLoop = setInterval(run, 1000/FPS); // inicia o game loop

        // CRIA OS ELEMENTOS
        menu = new Menu(); // cria o menu
        for (let l = 0; l < 4; l++) livros.push(new Livro(l)); // cria o livro e adicionaao array
        for (let c = 0; c < 4; c++) capa.push(new Capa(c)); // cria a capa e adiciona ao array
        
    } // end init

    ///////////////////////////////////////////////////////////////////////////////////////////////
    class Menu {

        constructor() {

            // ELEMENTO MENU
            this.element = document.createElement('div');
            this.element.className = 'menu';
            this.element.style.width = `${WIDTH}px`;
            this.element.style.height = `${HEIGHT}px`;
            document.getElementById('game').appendChild(this.element); // adiciona o menu ao game 

            // BACKGROUND
            this.backgroundImage = {
                menu1 : 'url(media/img/menu/menu1.png)',
                menu2 : 'url(media/img/menu/menu2.png)',
            } // end backgroundImage

        } // end constructor

        mudar() {
            if (frame == 0) this.element.style.backgroundImage = this.backgroundImage.menu1;
            if (frame == FPS/2) this.element.style.backgroundImage = this.backgroundImage.menu2;
        } // end mudar

    } // end menu

    ///////////////////////////////////////////////////////////////////////////////////////////////
    class Livro {

        constructor(number) {

            // ELEMENTO LIVROS
            this.element = document.createElement('div');
            this.element.className = 'livro';
            this.element.id = `livro${number+1}`;
            this.element.style.width = `${WIDTH}px`;
            this.element.style.height = `${HEIGHT}px`;
            menu.element.appendChild(this.element); // adiciona o livro ao menu

            // NUMERO DO LIVRO
            this.number = number;

            // BACKGROUND
            this.backgroundImage = {
                livro1_1 : 'url(media/img/menu/livros/livro1_1.png)',
                livro1_2 : 'url(media/img/menu/livros/livro1_2.png)',

                livro2_1 : 'url(media/img/menu/livros/livro2_1.png)',
                livro2_2 : 'url(media/img/menu/livros/livro2_2.png)',

                livro3_1 : 'url(media/img/menu/livros/livro3_1.png)',
                livro3_2 : 'url(media/img/menu/livros/livro3_2.png)',

                livro4_1 : 'url(media/img/menu/livros/livro4_1.png)',
                livro4_2 : 'url(media/img/menu/livros/livro4_2.png)',
            } // end backgroundImage

        } // end constructor

        mudar() {
            let livros1 = [this.backgroundImage.livro1_1, this.backgroundImage.livro2_1, this.backgroundImage.livro3_1, this.backgroundImage.livro4_1];
            let livros2 = [this.backgroundImage.livro1_2, this.backgroundImage.livro2_2, this.backgroundImage.livro3_2, this.backgroundImage.livro4_2];
            if (frame == 0) this.element.style.backgroundImage = livros1[this.number];
            if (frame == FPS/5) this.element.style.backgroundImage = livros2[this.number];
        } // end mudar

    } // end livros

    ///////////////////////////////////////////////////////////////////////////////////////////////
    class Capa {

        constructor(number) {

            // ELEMENTO LIVROS
            this.element = document.createElement('div');
            this.element.className = 'capa';
            this.element.id = `capa${number+1}`;
            this.element.style.width = `${WIDTH}px`;
            this.element.style.height = `${HEIGHT}px`;
            menu.element.appendChild(this.element); // adiciona a capa ao menu

            // NUMERO DO LIVRO
            this.number = number;

            // BACKGROUND
            this.backgroundImage = {
                capa1: 'url(media/img/menu/capas/capa1.png)',
                capa2: 'url(media/img/menu/capas/capa2.png)',
                capa3: 'url(media/img/menu/capas/capa3.png)',
                capa4: 'url(media/img/menu/capas/capa4.png)',
            } // end backgroundImage

        } // end constructor

        mudar() {
            let capas = [this.backgroundImage.capa1, this.backgroundImage.capa2, this.backgroundImage.capa3, this.backgroundImage.capa4];
            if (this.element.style.backgroundImage == 'none') this.element.style.backgroundImage = capas[this.number];
        } // end mudar

        reverter() {
            if (this.element.style.backgroundImage != 'none') this.element.style.backgroundImage = 'none';
        } // end reverter

    } // end livros

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function isInside(x, y, xMin, yMin, width, height) {
        return x >= xMin && x <= xMin + width && y >= yMin && y <= yMin + height;
    } // end isInside

    ///////////////////////////////////////////////////////////////////////////////////////////////
    window.addEventListener('mousemove', function(e) {

        const rect = menu.element.getBoundingClientRect(); // pega o tamanho do menu
        const x = e.clientX - rect.left; // posição do mouse no eixo x
        const y = e.clientY - rect.top; // posição do mouse no eixo y

        // verifica se o mouse está sobre a capa
        let inside = [isInside(x, y, 358, 66, 100, 160),
                      isInside(x, y, 653, 70, 100, 165),
                      isInside(x, y, 463, 283, 105, 160),
                      isInside(x, y, 683, 280, 95, 165)];

        const index = inside.findIndex(isInside => isInside); // retorna o index do array que é true

        // se o mouse estiver sobre a capa
        if (index != -1) {
            document.body.style.cursor = 'pointer'; // cursor de mão
            capa[index].mudar(); // muda a capa
        } else {
            document.body.style.cursor = 'default'; // cursor padrão
            capa.forEach(capa => capa.reverter()); // reverte a capa
        } // end if/else

    }); // end mouseover

    ///////////////////////////////////////////////////////////////////////////////////////////////
    window.addEventListener('click', function(e) {

        const rect = menu.element.getBoundingClientRect(); // pega o tamanho do menu
        const x = e.clientX - rect.left; // posição do mouse no eixo x
        const y = e.clientY - rect.top; // posição do mouse no eixo y

        // verifica se o mouse está sobre a capa
        let inside = [isInside(x, y, 358, 66, 100, 160),
                      isInside(x, y, 653, 70, 100, 165),
                      isInside(x, y, 463, 283, 105, 160),
                      isInside(x, y, 683, 280, 95, 165)];
        
        const href = ['hipatia', 'adalovelace', 'hedylamarr', 'joanclarke'] // href das capas
        const index = inside.findIndex(isInside => isInside); // retorna o index do array que é true
        
        // se o mouse estiver sobre a capa
        if (index != -1) {
            window.location.href = `public/intro/${href[index]}.html`;
        } // end if

    }); // end click

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function run() {
        
        // FRAME
        frame += 1; // incrementa o frame
        if (frame == FPS) frame = 0; // reseta o frame

        // MUDAR
        menu.mudar(); // muda o menu
        livros.forEach(livro => livro.mudar()); // muda o livro    
    
    } // end run
    
    // INICIA O JOGO
    document.addEventListener("DOMContentLoaded", function() {
        init();
    });

})() // end script