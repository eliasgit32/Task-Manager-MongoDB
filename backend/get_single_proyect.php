<?php include 'connection.php';

//Obtener los datos
$ID = $_GET['ID'];

$collection = $connection->projects;
$cursor = $collection->find(['_id' => new MongoDB\BSON\ObjectID($ID)]);

//Convertir cursor a array
$result = iterator_to_array($cursor);
echo json_encode($result);
?>