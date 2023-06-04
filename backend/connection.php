<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/producto-integrador-mongodb/vendor/autoload.php";

//Crear conexión
class Connection {
  public function connect() {
    try {
        
        $server =  "127.0.0.1";
        $user = "mongoadmin"; 
        $password = "123456";
        $db = "taskManager";
        $port = "27017";

        $stringConnection = "mongodb://" .
                            $user . ":" .
                            $password . "@" .
                            $server . ":" .
                            $port . "/" .
                            $db;
        
        $client =  new MongoDB\Client($stringConnection);
        return $client->selectDatabase($db);
    }catch(\Throwable $error) {
        return $error->getMessage();
    }
  }
}

$conn =  new Connection();
$connection = $conn->connect();
?>