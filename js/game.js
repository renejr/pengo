const config = {
    type: Phaser.AUTO,
    width: 1280, // substitua pela largura desejada
    height: 640, // substitua pela altura desejada
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
