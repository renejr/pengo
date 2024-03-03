class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
        // Pontuação
        this.score = 0;
        this.currentLevel = 1; // Inicia no nível 1
        this.currentDifficulty = 'Normal'; // Default difficulty
        this.lastMoveTime = 0;
        this.moveDelay = 75; // Atraso em milissegundos
        this.pengoVelocity = { x: 0, y: 0 };
        this.pengoMaxSpeed = 160; // Máxima velocidade do Pengo em pixels por segundo
        this.pengoAcceleration = 600; // Quão rápido o Pengo acelera até a máxima velocidade


        this.SCORE_VALUES = {
            PARALYZE_SNO_BEE: 100,
            SMASH_SNO_BEE: 100,
            EGG_BLOCK_SMASH: 500,
            SMASH_TWO_SNO_BEES: 1600,
            SMASH_THREE_SNO_BEES: 3200,
            LINE_DIAMOND_BLOCKS_WALL: 5000,
            LINE_DIAMOND_BLOCKS_NOWALL: 10000
        };

        // Bônus de tempo
        this.TIME_BONUS = {
            0: 5000,
            20: 2000,
            30: 1000,
            40: 0,
            50: 0,
            60: 0
        };
        
        // Define as configurações de dificuldade
        this.difficultySettings = {
            'Baby': {
                enemySpeed: 100,
                numberOfEnemies: 5
            },
            'Normal': {
                enemySpeed: 200,
                numberOfEnemies: 10
            },
            'Hard': {
                enemySpeed: 300,
                numberOfEnemies: 15
            }
        };
    }
    

    preload() {
        this.load.image('pengoBordaSupInf', './assets/atari26/bordas.png');
        this.load.image('pengoBordasVert', './assets/atari26/bordasVerticais.png');

        // Blocos que podem ser quebrados
        this.load.image('blocoGelo', './assets/arcade/blocoGelo.png');
        // Blocos indestrutíveis
        this.load.image('blocoDuro', './assets/arcade/blocoGeloDuro.png');

        this.load.spritesheet('redPengo', './assets/arcade/redPengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade

        this.load.spritesheet('greenPengo', './assets/arcade/greenPengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade

        this.load.spritesheet('yellowPengo', './assets/arcade/yellowPengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade

        this.load.spritesheet('pinkPengo', './assets/arcade/pinkPengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade

        this.load.spritesheet('orangePengo', './assets/arcade/orangePengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade

        this.load.spritesheet('bluePengo', './assets/arcade/bluePengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade

        this.load.spritesheet('lightBluePengo', './assets/arcade/lightBluePengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade

        this.load.spritesheet('yellow2Pengo', './assets/arcade/yellow2Pengo.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade
    }

    create() {
        // Acessa valores do registry
        this.currentDifficulty = this.game.registry.get('currentDifficulty') || 'Normal';
        let lives = this.game.registry.get('lives') || 4;

        // Adiciona a borda superior
        this.add.image(0, 0, 'pengoBordaSupInf').setOrigin(0, 0);

        // Adiciona a borda inferior
        // Nota: Ajuste 'gameHeight' para a altura real da sua cena
        let gameHeight = this.game.config.height;
        this.add.image(0, gameHeight - 16, 'pengoBordaSupInf').setOrigin(0, 0);

        // Adiciona a borda esquerda, iniciando após 16 pixels para baixo
        this.add.image(0, 16, 'pengoBordasVert').setOrigin(0, 0);

        // Adiciona a borda direita, iniciando após 16 pixels para baixo
        // Nota: Ajuste 'gameWidth' para a largura real da sua cena
        let gameWidth = this.game.config.width;
        this.add.image(gameWidth , 16, 'pengoBordasVert').setOrigin(1, 0); // origin ajustado para alinhar à direita

        // Posição inicial de Pengo no centro do labirinto
        const startX = this.game.config.width / 2;
        const startY = this.game.config.height / 2;

        // Configura o jogo baseado na dificuldade selecionada
        this.configureGameplay(this.currentDifficulty);

        // Implementa a lógica do gameplay aqui...
        // Exemplo de como avançar de nível
        this.advanceLevel();

        this.criarLabirinto(); // Inicializa o labirinto
        const posicaoLivre = this.encontrarPosicaoLivre(); // Encontra uma posição livre

        // Nomes dos spritesheets de Pengo
        const pengoSprites = ['redPengo', 'greenPengo', 'yellowPengo', 'pinkPengo', 'orangePengo', 'bluePengo', 'lightBluePengo', 'yellow2Pengo'];
        const selectedPengo = pengoSprites[Phaser.Math.Between(0, pengoSprites.length - 1)];

        // Adiciona Pengo ao jogo usando a posição livre encontrada
        this.pengo = this.add.sprite(posicaoLivre.posX, posicaoLivre.posY, selectedPengo).setScale(1.3);
        this.pengo.setDepth(100);

        // Configuração dos controles do teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configura animações de Pengo
        this.configurePengoAnimations();

        //this.pintarCelulasLivres(); // Pinta células livres de verde claro
    }

    configureGameplay(difficulty) {
        // Acessa as configurações baseadas na dificuldade
        let settings = this.difficultySettings[difficulty];

        // Configura os parâmetros do jogo
        console.log('Configurações para a dificuldade:', settings);
        // Por exemplo, ajustar a velocidade dos inimigos e a quantidade
        // this.enemySpeed = settings.enemySpeed;
        // this.numberOfEnemies = settings.numberOfEnemies;

        // Aqui você pode criar os inimigos com base em numberOfEnemies
        // e ajustar suas velocidades para enemySpeed
    }

    criarLabirinto() {
        const difficultySettings = this.difficultySettings[this.currentDifficulty];
        const numberOfEnemies = difficultySettings.numberOfEnemies;
    
        const cols = Math.floor((this.game.config.width ) / 40);
        const rows = Math.floor((this.game.config.height ) / 40);
        this.labirinto = []; // Inicializa this.labirinto

        let contadorEspacos = 1; // Inicia o contador de espaços em branco
        const probabilidadeBlocoGelo = 0.2; // 20%
    
        for (let y = 0; y < rows; y++) {
            let row = [];
            for (let x = 0; x < cols; x++) {
                let isEdge = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
                if (!isEdge) {
                    row.push(Phaser.Math.FloatBetween(0, 1) < 0.2 ? 'blocoGelo' : null);
                } else {
                    row.push(null);
                }
            }
            this.labirinto.push(row);
        }
    
        // Adiciona blocos duros em posições aleatórias
        for (let i = 0; i < numberOfEnemies; i++) {
            let x, y;
            do {
                x = Phaser.Math.Between(1, cols - 2);
                y = Phaser.Math.Between(1, rows - 2);
            } while (this.labirinto[y][x]); // Garante que não substitua um bloco de gelo
            this.labirinto[y][x] = 'blocoDuro';
        }
    
        // Desenha o labirinto
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (this.labirinto[y][x]) {
                    const posX = x * 40 + 16; // Posição x do bloco
                    const posY = y * 40 + 16; // Posição y do bloco
                    this.add.image(posX, posY, this.labirinto[y][x]).setOrigin(0, 0);
                }
            }
        }
    }

    pintarCelulasLivres() {
        const blocoSize = 40; // Tamanho do bloco ajustado para as novas dimensões
        for (let y = 0; y < this.labirinto.length; y++) {
            for (let x = 0; x < this.labirinto[y].length; x++) {
                if (this.labirinto[y][x] === null) { // Célula livre
                    let rect = this.add.rectangle(x * blocoSize + 20, y * blocoSize + 20, blocoSize, blocoSize, 0x90ee90).setOrigin(0.5);
                    rect.setDepth(0); // Certifique-se de que está abaixo do Pengo
                }
            }
        }
    }
    
    
    encontrarPosicaoLivre() {
        const cols = Math.floor(this.game.config.width / 40);
        const rows = Math.floor(this.game.config.height / 40);
    
        let posicaoLivreEncontrada = false;
        let posX, posY;
    
        while (!posicaoLivreEncontrada) {
            const x = Phaser.Math.Between(1, cols - 2);
            const y = Phaser.Math.Between(1, rows - 2);
    
            // Garante que this.labirinto[y] não é undefined antes de tentar acessar this.labirinto[y][x]
            if (this.labirinto[y] && this.labirinto[y][x] === null) {
                posX = x * 40 + 40 / 2; // Ajuste para a posição do centro do bloco, se necessário
                posY = y * 40 + 40 / 2;
                posicaoLivreEncontrada = true;
            }
        }
    
        return { posX, posY };
    }
    
    advanceLevel() {
        // Incrementa o nível
        this.currentLevel++;
        console.log('Nível Atual:', this.currentLevel);

        // Aqui você pode ajustar a dificuldade baseada no nível atual
        // e reiniciar ou atualizar a cena conforme necessário
    }

    // Adicione métodos para atualizar a pontuação
    smashSnoBee(count) {
        if (count === 1) {
            this.score += this.SCORE_VALUES.SMASH_SNO_BEE;
        } else if (count === 2) {
            this.score += this.SCORE_VALUES.SMASH_TWO_SNO_BEES;
        } else if (count === 3) {
            this.score += this.SCORE_VALUES.SMASH_THREE_SNO_BEES;
        }

        // Atualize a pontuação na tela, se necessário
    }

    lineDiamondBlocks(alongWall) {
        this.score += alongWall ? this.SCORE_VALUES.LINE_DIAMOND_BLOCKS_WALL : this.SCORE_VALUES.LINE_DIAMOND_BLOCKS_NOWALL;

        // Atualize a pontuação na tela, se necessário
    }

    calculateTimeBonus(timeLeft) {
        // Encontra o maior intervalo de tempo que é menor ou igual ao tempo restante
        let bonus = 0;
        for (const time in this.TIME_BONUS) {
            if (timeLeft >= time) {
                bonus = this.TIME_BONUS[time];
                break;
            }
        }
        this.score += bonus;

        // Atualize a pontuação na tela, se necessário
    }

    configurePengoAnimations() {
        this.anims.create({
            key: 'moveDown',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'moveLeft',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'moveUp',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 15, end: 17 }),
            frameRate: 10,
            repeat: 0
        });
    
        this.anims.create({
            key: 'idle',
            frames: [{ key: this.pengo.texture.key, frame: 18 }],
            frameRate: 10
        });
    }

    movePengo(deltaX, deltaY) {
        let newX = this.pengo.x + deltaX * 40; // Atualizado para 40 pixels
        let newY = this.pengo.y + deltaY * 40;
        
        let newTileX = Math.floor(newX / 40);
        let newTileY = Math.floor(newY / 40);
        
        if (newTileX >= 0 && newTileX < this.labirinto[0].length && newTileY >= 0 && newTileY < this.labirinto.length && this.labirinto[newTileY][newTileX] === null) {
            this.pengo.x = newX;
            this.pengo.y = newY;
            // Adiciona a profundidade aqui
            this.pengo.setDepth(100);
        }
    }
    
    update(time, delta) {
        const deltaSeconds = delta / 1000; // Converte delta para segundos
    
        // Determina a direção desejada de movimento baseada na entrada do jogador
        let desiredVelocityX = 0;
        let desiredVelocityY = 0;
    
        if (this.cursors.left.isDown) {
            desiredVelocityX = -this.pengoAcceleration;
            this.pengo.anims.play('moveLeft', true);
        } else if (this.cursors.right.isDown) {
            desiredVelocityX = this.pengoAcceleration;
            this.pengo.anims.play('moveRight', true);
        }
    
        if (this.cursors.up.isDown) {
            desiredVelocityY = -this.pengoAcceleration;
            this.pengo.anims.play('moveUp', true);
        } else if (this.cursors.down.isDown) {
            desiredVelocityY = this.pengoAcceleration;
            this.pengo.anims.play('moveDown', true);
        }
    
        // Calcula a nova posição proposta para o Pengo
        let proposedNewX = this.pengo.x + desiredVelocityX * deltaSeconds;
        let proposedNewY = this.pengo.y + desiredVelocityY * deltaSeconds;
    
        // Converte a posição proposta para índices de grade do labirinto
        let newTileX = Math.floor(proposedNewX / (40 * 1.3));
        let newTileY = Math.floor(proposedNewY / (40 * 1.3));
    
        // Verifica se a posição proposta está em um bloco livre
        if (this.canMoveTo(newTileX, Math.floor(this.pengo.y / (40 * 1.3)))) {
            this.pengo.x = proposedNewX;
        }
    
        if (this.canMoveTo(Math.floor(this.pengo.x / (40 * 1.3)), newTileY)) {
            this.pengo.y = proposedNewY;
        }
    
        // Se nenhuma tecla está pressionada, exibe a animação "idle"
        if (desiredVelocityX === 0 && desiredVelocityY === 0) {
            this.pengo.anims.play('idle', true);
        }
    }
    
    canMoveTo(x, y) {
        // Garante que a célula destino está dentro do labirinto e é um espaço livre
        return x >= 0 && x < this.labirinto[0].length && y >= 0 && y < this.labirinto.length && this.labirinto[y][x] === null;
    }
    
    
}
