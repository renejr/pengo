class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
        this.currentLevel = 1; // Inicia no nível 1
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
    }

    create() {
        // Acessa valores do registry
        let currentDifficulty = this.game.registry.get('currentDifficulty') || 'Normal';
        let lives = this.game.registry.get('lives') || 4;

        console.log('Dificuldade Atual:', currentDifficulty);
        console.log('Vidas:', lives);

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

        // Configura o jogo baseado na dificuldade selecionada
        this.configureGameplay(currentDifficulty);

        // Implementa a lógica do gameplay aqui...
        // Exemplo de como avançar de nível
        this.advanceLevel();
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

    advanceLevel() {
        // Incrementa o nível
        this.currentLevel++;
        console.log('Nível Atual:', this.currentLevel);

        // Aqui você pode ajustar a dificuldade baseada no nível atual
        // e reiniciar ou atualizar a cena conforme necessário
    }
}
