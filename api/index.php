<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configurar los encabezados CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Asegúrate de manejar solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // Salir para evitar procesar solicitudes OPTIONS
}

include 'DbConnect.php';
include 'Historial.php';

$objDb = new DbConnect();
$conn = $objDb->connect();

$historial = new Historial($conn);

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

switch ($method) {
    case "GET":
        if ($requestUri === '/react-app/api/historial/ver') {
            $result = $historial->getAllHistorial();
            echo json_encode($result);
        }
        break;
    case "POST":
        if ($requestUri === '/api/historial/guardar') {
            $historial->insertHistorial();
            echo json_encode(["message" => "Datos guardados con éxito"]);
        }
        break;
    default:
        http_response_code(405); // Método no permitido
        echo json_encode(["error" => "Método no permitido"]);
}
