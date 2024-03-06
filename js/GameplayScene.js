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
        // Inicializa a capacidade de criar blocos de gelo
        this.canCreateIceBlock = true; // Pengo pode criar um bloco de gelo imediatamente
        this.iceBlocksAvailable = 3; // Inicializa com 3 blocos de gelo disponíveis
        this.lastDirection = 'up'; // Valor padrão ou baseado na orientação inicial do Pengo


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
        this.load.image('pengoBordaSupInf', './assets/atari26/bordas_upscaled.png');
        this.load.image('pengoBordasVert', './assets/atari26/bordasverticais_upscaled.png');

        // Blocos que podem ser quebrados
        this.load.image('blocoGelo', './assets/arcade/blocoGelo.png');
        // Blocos indestrutíveis
        this.load.image('blocoDuro', './assets/arcade/blocoGeloDuro.png');

        this.load.image('pengoIceCrystal', './assets/crystal_resized.png');

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

        this.load.spritesheet('snooGreen', './assets/arcade/snooGreen.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade
    }

    create(){
        // Acessa valores do registry
        this.currentDifficulty = this.game.registry.get('currentDifficulty') || 'Normal';
        let lives = this.game.registry.get('lives') || 4;

        // Cria os grupos de física para as bordas
        this.bordas = this.physics.add.staticGroup();

        // Adiciona a borda superior como um objeto de física
        this.bordas.create(0, 0, 'pengoBordaSupInf').setOrigin(0, 0).refreshBody();

        // Adiciona a borda inferior
        let gameHeight = this.game.config.height;
        this.bordas.create(0, gameHeight - 16, 'pengoBordaSupInf').setOrigin(0, 0).refreshBody();

        // Adiciona a borda esquerda
        this.bordas.create(0, 16, 'pengoBordasVert').setOrigin(0, 0).refreshBody();

        // Adiciona a borda direita
        let gameWidth = this.game.config.width;
        this.bordas.create(gameWidth - 16, 16, 'pengoBordasVert').setOrigin(0, 0).refreshBody();

        // Posição inicial de Pengo no centro do labirinto
        // Exemplo de ajuste de posição inicial dentro dos limites
        const startX = (this.game.config.width - 32) / 2;
        const startY = (this.game.config.height - 32) / 2;

        // Configura o jogo baseado na dificuldade selecionada
        this.configureGameplay(this.currentDifficulty);

        // Implementa a lógica do gameplay aqui...
        // Exemplo de como avançar de nível
        this.advanceLevel();

        // Configura entradas do teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.criarLabirinto(); // Inicializa o labirinto

        // Ajusta os limites do mundo para garantir que o Pengo respeite as bordas de 16px
        this.physics.world.bounds.width = this.game.config.width - 16; // Subtrai 16px de cada lado (esquerda e direita)
        this.physics.world.bounds.height = this.game.config.height - 16; // Subtrai 16px de cada lado (topo e inferior)

        // Após criar o Pengo e as bordas...
        this.criarPengo();
        this.physics.add.collider(this.pengo, this.bordas);
        this.configurePengoAnimations(); // Configura as animações do Pengo

        // Habilita a colisão do Pengo com os limites do mundo ajustado
        this.pengo.setCollideWorldBounds(true);
    }

    update(time, delta) {
        // Verifica se a tecla espaço está pressionada
        const isSpaceDown = this.spaceBar.isDown;
    
        // Identifica qual tecla de direção está pressionada
        let direction = null;
        if (this.cursors.left.isDown) {
            direction = 'left';
        } else if (this.cursors.right.isDown) {
            direction = 'right';
        } else if (this.cursors.up.isDown) {
            direction = 'up';
        } else if (this.cursors.down.isDown) {
            direction = 'down';
        }
    
        // Verifica se o espaço e alguma direção estão pressionados simultaneamente
        if (isSpaceDown && direction) {
            this.createIceBlock(direction); // Passa a direção como argumento
        } else {
            // Movimentação de Pengo baseada apenas na direção, sem criar bloco de gelo
            this.handlePengoMovement(direction);
        }
    }
    
    handlePengoMovement(direction) {
        // Reseta a velocidade para parar o Pengo quando nenhuma tecla direcional está pressionada
        this.pengo.setVelocityX(0);
        this.pengo.setVelocityY(0);
    
        // Define a nova velocidade e animação baseada na direção pressionada
        switch (direction) {
            case 'left':
                this.pengo.setVelocityX(-this.pengoMaxSpeed);
                this.pengo.anims.play('moveLeft', true);
                break;
            case 'right':
                this.pengo.setVelocityX(this.pengoMaxSpeed);
                this.pengo.anims.play('moveRight', true);
                break;
            case 'up':
                this.pengo.setVelocityY(-this.pengoMaxSpeed);
                this.pengo.anims.play('moveUp', true);
                break;
            case 'down':
                this.pengo.setVelocityY(this.pengoMaxSpeed);
                this.pengo.anims.play('moveDown', true);
                break;
            default:
                // Pengo está parado, executa a animação de 'idle'
                this.pengo.anims.play('idle', true);
                break;
        }
    }    

    advanceLevel() {
        // Incrementa o nível
        this.currentLevel++;
        console.log('Nível Atual:', this.currentLevel);

        // Aqui você pode ajustar a dificuldade baseada no nível atual
        // e reiniciar ou atualizar a cena conforme necessário
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
    
        const cols = Math.floor((this.game.config.width) / 40);
        const rows = Math.floor((this.game.config.height) / 40);
        this.labirinto = []; // Inicializa this.labirinto
    
        // Garante espaços para movimentação criando um padrão alternado de blocos
        for (let y = 0; y < rows; y++) {
            let row = [];
            for (let x = 0; x < cols; x++) {
                let isEdge = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
                if (!isEdge && (x % 2 === 1 || y % 2 === 1)) {
                    // Alternância para garantir corredores
                    row.push(Phaser.Math.FloatBetween(0, 1) < 0.75 ? 'blocoGelo' : null); // Aumenta a chance para blocos de gelo, mas deixa espaço
                } else {
                    row.push(null);
                }
            }
            this.labirinto.push(row);
        }
    
        // Adiciona blocos duros em posições estratégicas, evitando bloquear completamente qualquer caminho
        for (let i = 0; i < numberOfEnemies; i++) {
            let x, y;
            do {
                x = Phaser.Math.Between(2, cols - 3); // Evita a primeira e última coluna/linha
                y = Phaser.Math.Between(2, rows - 3);
            } while (this.labirinto[y][x] || ((x % 2 === 0) && (y % 2 === 0))); // Evita sobrepor blocos de gelo e coloca em posições que não formem barreiras intransponíveis
            this.labirinto[y][x] = 'blocoDuro';
        }
    
        // Desenha o labirinto
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (this.labirinto[y][x]) {
                    const posX = x * 40 + 20; // Centraliza o bloco no tile
                    const posY = y * 40 + 20;
                    this.add.image(posX, posY, this.labirinto[y][x]).setOrigin(0.5, 0.5).setScale(1);
                }
            }
        }
    }
    
    criarPengo() {
        const cols = Math.floor(this.game.config.width / 40);
        const rows = Math.floor(this.game.config.height / 40);
        let posX, posY, spaceFound = false;
    
        // Busca por um espaço livre no labirinto
        while (!spaceFound) {
            let x = Phaser.Math.Between(1, cols - 2);
            let y = Phaser.Math.Between(1, rows - 2);
    
            if (!this.labirinto[y][x]) { // Verifica se a célula está vazia
                posX = x * 40 + 20; // Posição centralizada do sprite no tile
                posY = y * 40 + 20;
                spaceFound = true;
            }
        }
    
        // Escolhe um sprite de Pengo aleatoriamente
        const pengoSprites = [
            'redPengo', 'greenPengo', 'yellowPengo', 'pinkPengo', 
            'orangePengo', 'bluePengo', 'lightBluePengo', 'yellow2Pengo'
        ];
        const pengoColor = Phaser.Utils.Array.GetRandom(pengoSprites);
    
        // Cria o Pengo na posição encontrada
        this.pengo = this.physics.add.sprite(posX, posY, pengoColor);
        this.pengo.setOrigin(0.5, 0.5).setScale(1); // Centraliza o sprite
        this.pengo.setCollideWorldBounds(true); // Faz Pengo colidir com as bordas do mundo
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
            key: 'moveRight',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 6, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    
        if (!this.anims.exists('die')) {
            this.anims.create({
                key: 'die',
                frames: this.anims.generateFrameNumbers('pengo', { start: 15, end: 17 }),
                frameRate: 10,
                repeat: 0
            });
        }
    
        this.anims.create({
            key: 'idle',
            frames: [{ key: this.pengo.texture.key, frame: 22 }],
            frameRate: 10
        });
    }

    createIceBlock(direction) {
        if (!this.canCreateIceBlock || this.iceBlocksAvailable <= 0) return;
    
        let blockX = this.pengo.x;
        let blockY = this.pengo.y;
    
        switch (direction) {
            case 'left':
                blockX -= 16; // Ajuste conforme necessário
                break;
            case 'right':
                blockX += 16;
                break;
            case 'up':
                blockY -= 16;
                break;
            case 'down':
                blockY += 16;
                break;
        }
    
        let iceBlock = this.add.sprite(blockX, blockY, 'pengoIceCrystal');
        this.physics.add.existing(iceBlock);
        iceBlock.body.immovable = true;
        if (!this.iceBlocks) {
            this.iceBlocks = this.physics.add.group({ immovable: true });
        }
        this.iceBlocks.add(iceBlock);
        iceBlock.setDepth(3);
    
        this.iceBlocksAvailable -= 1;
    
        this.time.delayedCall(5000, () => {
            iceBlock.destroy();
        }, [], this);
    
        this.canCreateIceBlock = false;
        this.time.delayedCall(3000, () => {
            this.canCreateIceBlock = true;
        }, [], this);
    }
    
    
    configureSnooAnimations() {
        this.anims.create({
            key: 'moveDown',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 8, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'moveLeft',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 10, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'moveUp',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 12, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'moveRight',
            frames: this.anims.generateFrameNumbers(this.pengo.texture.key, { start: 14, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
    
        if (!this.anims.exists('die')) {
            this.anims.create({
                key: 'die',
                frames: this.anims.generateFrameNumbers('pengo', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: 0
            });
        }
    
        this.anims.create({
            key: 'idle',
            frames: [{ key: this.pengo.texture.key, frame: 8 }],
            frameRate: 10
        });
    }
    
}
