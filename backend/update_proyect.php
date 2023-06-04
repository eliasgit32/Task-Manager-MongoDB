<?php include 'connection.php';

//Obtener los datos
$ID = $_POST['ID'];
$name = $_POST['name'];
$description = $_POST['description'];

//Operación de actualización
$collection = $connection->projects;
$result = $collection->updateOne(
    ['_id' =>  new MongoDB\BSON\ObjectID($ID)],
    ['$set' => ['nombre' => $name, 'descripcion' => $description]]
);


if($result->getModifiedCount() === 1) {
    echo 'Record updated';
} else {
    echo 'Error executing the query: ' . $connection->error;
}

?>