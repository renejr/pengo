class ScoreScene extends Phaser.Scene {
    constructor() {
        super('ScoreScene');
    }

    create() {
        fetch('http://localhost/getScores.php')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Exibir scores no console
            // Aqui você pode criar textos na cena para exibir os scores
            data.forEach((score, index) => {
                this.add.text(100, 100 + 20 * index, `${score.pseudo}: ${score.score}`, { fontSize: '20px', fill: '#FFF' });
            });
        })
        .catch(error => console.error('Erro ao buscar scores:', error));
    }
}
