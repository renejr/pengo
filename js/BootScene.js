class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Carregar a imagem que será usada na abertura
        this.load.image('pengoOpenBG', './assets/atari26/pengoOpenBG.png');
        
        this.load.spritesheet('pengo', './assets/arcade/PengoSnooBees.png', {
            frameWidth: Math.floor(16),
            frameHeight: Math.floor(16)
        }); // Arcade
    }

    create(){
        this.cameras.main.setBackgroundColor('#000000');
        let graphics = this.add.graphics();
        graphics.fillStyle(0xad82f7, 1); // Cor para as bordas
        
        // Desenhar as bordas laterais
        graphics.fillRect(0, 0, 16, this.cameras.main.height); // Esquerda
        graphics.fillRect(this.cameras.main.width - 16, 0, 16, this.cameras.main.height); // Direita


        // Desenhar as bordas superiores e inferiores
        graphics.fillRect(0, 0, this.cameras.main.width, 16); // Topo
        graphics.fillRect(0, this.cameras.main.height - 16, this.cameras.main.width, 16); // Base

        // Adicionar a imagem centralizada no mundo
        let image = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'pengoOpenBG');

        // Ajustar a imagem para que ela fique centralizada dentro dos limites, considerando as bordas
        let scaleX = (this.cameras.main.width - 32) / image.width;
        let scaleY = (this.cameras.main.height - 32) / image.height;
        let scale = Math.min(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        // Definições das animações do Pengo
        if (!this.anims.exists('up')) {
            // Animação de movimento para cima
            this.anims.create({
                key: 'up',
                frames: this.anims.generateFrameNumbers('pengo', { start: 4, end: 5 }),
                frameRate: 10,
                repeat: -1, // Repetir infinitamente
                overwrite: true // Sobrescreve a animação existente com a mesma chave
            });
        }

        if (!this.anims.exists('down')) {
            // Animação de movimento para baixo
            this.anims.create({
                key: 'down',
                frames: this.anims.generateFrameNumbers('pengo', { start: 0, end: 1 }),
                frameRate: 10,
                repeat: -1,
                overwrite: true // Sobrescreve a animação existente com a mesma chave
            });
        }

        if (!this.anims.exists('left')) {
            // Animação de movimento para a esquerda
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('pengo', { start: 2, end: 3 }),
                frameRate: 10,
                repeat: -1,
                overwrite: true // Sobrescreve a animação existente com a mesma chave
            });
        }

        if (!this.anims.exists('right')) {
            // Animação de movimento para a direita
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('pengo', { start: 6, end: 7 }),
                frameRate: 10,
                repeat: -1,
                overwrite: true // Sobrescreve a animação existente com a mesma chave
            });
        }

        if (!this.anims.exists('die')) {
            // Animação de morte
            this.anims.create({
                key: 'die',
                frames: this.anims.generateFrameNumbers('pengo', { start: 80, end: 81 }),
                frameRate: 10,
                repeat: 0,
                overwrite: true // Sobrescreve a animação existente com a mesma chave
            });
        }

        // Criação do Pengo no centro do mundo do jogo com a animação 'up'
        let pengo = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'pengo');

        // Iniciar com a animação de andar para cima
        pengo.anims.play('up', true);

        // Aumentar a escala do Pengo em 1.5
        pengo.setScale(3.27);

        // Definir o depth do Pengo em 10
        pengo.setDepth(10);

        // Configurar limites do mundo com uma borda de 16 pixels
        this.physics.world.bounds.setTo(16, 16, this.cameras.main.width - 32, this.cameras.main.height - 32);

        // Fazer com que o Pengo respeite os limites do mundo
        pengo.setCollideWorldBounds(true);

        // Função para mover o Pengo aleatoriamente
        const movePengoRandomly = () => {
            // Velocidades aleatórias para X e Y
            let velocityX = Phaser.Math.Between(-100, 100);
            let velocityY = Phaser.Math.Between(-100, 100);

            pengo.setVelocity(velocityX, velocityY);

            // Escolher animação baseada na direção
            if (Math.abs(velocityX) > Math.abs(velocityY)) {
                pengo.anims.play(velocityX > 0 ? 'right' : 'left', true);
                pengo.setDepth(10);
            } else {
                pengo.anims.play(velocityY > 0 ? 'down' : 'up', true);
                pengo.setDepth(10);
            }
        };

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('MainMenuScene');
        });

        // Adiciona o evento de clique com o botão direito do mouse
        this.input.on('pointerdown', (pointer) => {
            this.scene.start('MainMenuScene');
        });

        // Desabilita o menu de contexto do botão direito para permitir a captura do clique
        this.game.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Mover o Pengo aleatoriamente a cada 2 segundos
        this.time.addEvent({
            delay: 2000,
            callback: movePengoRandomly,
            loop: true
        });

        // Carrega e exibe scores
        this.loadAndDisplayScores();
    }

    loadAndDisplayScores() {
        fetch('http://localhost/pengo/getScores.php')
        .then(response => response.json())
        .then(scores => {
            // Aqui você define como os scores serão exibidos
            // Por exemplo, exibir os top 5 scores
            scores.slice(0, 5).forEach((score, index) => {
                this.add.text(350, 43 * (index + 5), `Rank ${index + 1}: ${score.pseudo} - ${score.score}`, { fontSize: '42px', fill: '#FFF' });
            });
        })
        .catch(error => console.error('Erro ao buscar scores:', error));
    }
}
