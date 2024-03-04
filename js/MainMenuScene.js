class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
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

        // Criar botões
        let playButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'Play', { fontSize: '42px', fill: '#FFF' }).setInteractive();
        let optionsButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, 'Options', { fontSize: '42px', fill: '#FFF' }).setInteractive();
        optionsButton.on('pointerdown', () => this.scene.start('SettingsScene'));
        optionsButton.setOrigin(0.5);

        playButton.on('pointerdown', () => {
            // Inicia a cena de gameplay
            this.scene.start('GameplayScene');
        });        
        
        playButton.setOrigin(0.5);

        // Inicia um evento temporizado que aguarda 15 segundos de inatividade
        this.inactivityTimer = this.time.delayedCall(15000, this.goBackToBootScene, [], this);

        // Adiciona eventos de interação que reiniciam o temporizador
        this.input.on('pointerdown', () => {
            this.resetInactivityTimer();
        });

        // Exibir valores no console
        let currentDifficulty = this.game.registry.get('currentDifficulty') || 'Normal'; // Valor padrão: Normal
        let lives = this.game.registry.get('lives') || 4; // Valor padrão: 4
        console.log('Dificuldade Atual:', currentDifficulty);
        console.log('Vidas:', lives);

    }

    clickButton() {
        // Lógica para o que acontece quando os botões são clicados
        console.log('Button clicked!');
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
