<?php
// Conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = ""; // Sem senha
$dbname = "games";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Checar conexão
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT scores.pseudo, scores.score FROM scores JOIN games ON scores.game_id = games.id WHERE games.game = 'Pengo' ORDER BY scores.score DESC LIMIT 10";
$result = $conn->query($sql);

$scores = array();

if ($result->num_rows > 0) {
  // Saída de cada linha
  while($row = $result->fetch_assoc()) {
    $scores[] = $row;
  }
  echo json_encode($scores);
} else {
  echo "0 results";
}

$conn->close();
?>
