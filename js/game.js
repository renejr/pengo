const config = {
    type: Phaser.AUTO,
    width: 800, // substitua pela largura desejada
    height: 600, // substitua pela altura desejada
    parent: 'game-container',
    audio: {
        disableWebAudio: false
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [BootScene, MainMenuScene, SettingsScene, GameplayScene] // Adicione sua nova cena aqui
};

window.onload = () => {
    const game = new Phaser.Game(config);
}
