<?php include 'connection.php';

//Obtener los datos
$ID_proyect = $_POST['ID_proyect'];
$name = $_POST['name'];

//Operación de eliminación
$collection = $connection->projects;
$result = $collection->updateOne(
    ['_id' =>  new MongoDB\BSON\ObjectID($ID_proyect),],
    ['$pull' => ['tareas' => ['nombre' => $name]]]
);


if($result->getModifiedCount() === 1) {
    echo 'Record deleted';
} else {
    echo 'Error executing the query: ' . $conn->error;
}

?>