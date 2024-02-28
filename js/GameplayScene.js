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

    create() {
        // Acessa valores do registry
        let currentDifficulty = this.game.registry.get('currentDifficulty') || 'Normal';
        let lives = this.game.registry.get('lives') || 4;

        console.log('Dificuldade Atual:', currentDifficulty);
        console.log('Vidas:', lives);

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
