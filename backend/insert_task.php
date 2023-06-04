<?php include 'connection.php';

//Obtener los datos
$ID_proyect = $_POST['ID_proyect'];
$name = $_POST['name'];

//Operación de inserción
$collection = $connection->projects;
$result = $collection->updateOne(
    ['_id' =>  new MongoDB\BSON\ObjectID($ID_proyect)],
    ['$push' => ['tareas' => ['nombre' => $name, 'terminado' => 0]]]
);

if($result->getModifiedCount() === 1) {
    echo 'Record inserted';
} else {
    echo 'Error executing the query: ' . $connection->error;
}
?>