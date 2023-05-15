<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
include 'Ciudad.php';
include 'Historial.php';

$objDb = new DbConnect();
$conn = $objDb->connect();

// Crear instancias de las clases Ciudades y Historial
$ciudades = new Ciudad($conn);
$historial = new Historial($conn);

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case "GET":
        $result = [];
        // Obtiene la información de las ciudades
        if ($_SERVER['REQUEST_URI'] == '/api/ciudad/cargar-ciudades') {
            $result = $ciudades->getAllCiudades();
        }
        // Obtiene el historial
        elseif ($_SERVER['REQUEST_URI'] == '/api/historial/ver') {
            $result = $historial->getAllHistorial();
        }
        echo json_encode($result);
        break;
    case "POST":
        if ($_SERVER['REQUEST_URI'] == '/api/historial/guardar') {
            $historial->insertHistorial();
        }
        break;
}
