<?php include 'connection.php';

//Obtener los datos
$name = $_POST['name'];
$description = $_POST['description'];

//Operación de inserción
$collection = $connection->projects;
$result = $collection->insertOne([
    'nombre' => $name,
    'descripcion' => $description,
    'tareas' => []
]);

if($result->getInsertedCount() === 1) {
    echo 'Record inserted';
} else {
    echo 'Error executing the query: ' . $conn->error;
}

?>