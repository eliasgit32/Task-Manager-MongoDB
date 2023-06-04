<?php include 'connection.php';


$collection = $connection->projects;
$cursor = $collection->find();

//Convertir cursor a array
$result = iterator_to_array($cursor);
echo json_encode($result);

?>