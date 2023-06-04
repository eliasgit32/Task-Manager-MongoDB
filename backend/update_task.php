<?php include 'connection.php';

//Obtener los datos
$ID_proyect = $_POST['ID_proyect'];
$name = $_POST['name'];
$finished = $_POST['finished'];

//Operación de actualización
$collection = $connection->projects;
$result = $collection->updateOne(
    [
        '_id' =>  new MongoDB\BSON\ObjectID($ID_proyect),
        'tareas' => ['$elemMatch' => ['nombre' => $name]]
    ],
    ['$set' => ['tareas.$.terminado' => $finished]]
);


if($result->getModifiedCount() === 1) {
    echo 'Record updated';
} else {
    echo $result->getModifiedCount();
    echo 'Error executing the query: ' . $connection->error;
}

?>