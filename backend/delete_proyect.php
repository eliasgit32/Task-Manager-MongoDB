<?php include 'connection.php';

//Obtener los datos
$ID = $_POST['ID'];

//Operación de eliminación
$collection = $connection->projects;
$result = $collection->deleteOne(
    ['_id' =>  new MongoDB\BSON\ObjectID($ID)]
);


if($result->getDeletedCount() === 1) {
    echo 'Record deleted';
} else {
    echo 'Error executing the query: ' . $conn->error;
}

?>