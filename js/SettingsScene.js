class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    create() {
        // Adicionar a mesma imagem de fundo da cena de abertura
        this.cameras.main.setBackgroundColor('#000000');
        let graphics = this.add.graphics();
        graphics.fillStyle(0xad82f7, 1); // Cor para as bordas

        // Desenhar as bordas laterais
        graphics.fillRect(0, 0, 16, this.cameras.main.height); // Esquerda
        graphics.fillRect(this.cameras.main.width - 16, 0, 16, this.cameras.main.height); // Direita

        // Desenhar as bordas superiores e inferiores
        graphics.fillRect(0, 0, this.cameras.main.width, 16); // Topo
        graphics.fillRect(0, this.cameras.main.height - 16, this.cameras.main.width, 16); // Base
        
        let bgImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'pengoOpenBG');
        let scaleX = (this.cameras.main.width - 32) / bgImage.width;
        let scaleY = (this.cameras.main.height - 32) / bgImage.height;
        let scale = Math.min(scaleX, scaleY);
        bgImage.setScale(scale).setScrollFactor(0);

        // Opções de dificuldade
        // Recuperar os valores atuais de dificuldade e vidas do registry
        let currentDifficulty = this.game.registry.get('currentDifficulty') || 'Normal'; // Valor padrão: Normal
        let lives = this.game.registry.get('lives') || 4; // Valor padrão: 4

        let difficultyText = this.add.text(420, 200, `Dificuldade: ${currentDifficulty}`, { fontSize: '42px', fill: '#FFF' }).setInteractive();
        let livesText = this.add.text(420, 250, `Vidas: ${lives}`, { fontSize: '42px', fill: '#FFF' }).setInteractive();

        // Botão voltar
        let backButton = this.add.text(420, 300, 'Voltar', { fontSize: '42px', fill: '#FFF' }).setInteractive();

        difficultyText.on('pointerdown', () => this.changeDifficulty(difficultyText));
        livesText.on('pointerdown', () => this.changeLives(livesText));
        backButton.on('pointerdown', () => this.scene.switch('MainMenuScene'));

        // Inicia um evento temporizado que aguarda 15 segundos de inatividade
        this.inactivityTimer = this.time.delayedCall(15000, this.goBackToBootScene, [], this);

        // Adiciona eventos de interação que reiniciam o temporizador
        this.input.on('pointerdown', () => {
            this.resetInactivityTimer();
        });
    }

    changeDifficulty(text) {
        const difficulties = ['Baby', 'Normal', 'Hard'];
        let currentDifficultyIndex = difficulties.indexOf(text.text.split(': ')[1]);
        let newDifficulty = difficulties[(currentDifficultyIndex + 1) % difficulties.length];
        text.setText(`Dificuldade: ${newDifficulty}`);
        this.game.registry.set('currentDifficulty', newDifficulty);
    }

    changeLives(text) {
        let lives = parseInt(text.text.split(': ')[1]);
        let newLives = lives % 8 + 1;
        text.setText(`Vidas: ${newLives}`);
        this.game.registry.set('lives', newLives);
    }

    // Método para voltar para a BootScene
    goBackToBootScene() {
        this.scene.start('BootScene');
    }

    // Método para resetar o temporizador de inatividade
    resetInactivityTimer() {
        // Reinicia o temporizador
        this.inactivityTimer.reset({
            delay: 15000,
            callback: this.goBackToBootScene,
            callbackScope: this
        });
    }

    clickButton() {
        // Lógica para o que acontece quando os botões são clicados
        // Reinicia o temporizador ao clicar em um botão
        this.resetInactivityTimer();
        console.log('Button clicked!');
    }
}
