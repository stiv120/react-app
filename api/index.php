<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuramos los encabezados CORS
header("Access-Control-Allow-Origin: https://react-app-stiven.vercel.app"); // Aquí pones el origen de tu app React en Vercel
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include 'DbConnect.php';
include 'Historial.php';

$objDb = new DbConnect();
$conn = $objDb->connect();

if (!$conn) {
    http_response_code(500);
    exit;
}

$historial = new Historial($conn);

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$action = $_GET['action'] ?? '';

// Soporta tanto /api/historial/ver (con .htaccess) como /api/index.php?action=ver (sin mod_rewrite)
$isVer = (strpos($requestUri, 'historial/ver') !== false) || ($action === 'ver');
$isGuardar = (strpos($requestUri, 'historial/guardar') !== false) || ($action === 'guardar');

header('Content-Type: application/json');

switch ($method) {
    case "GET":
        if ($isVer) {
            $result = $historial->getAllHistorial();
            echo json_encode($result);
        }
        break;
    case "POST":
        if ($isGuardar) {
            $historial->insertHistorial();
            echo json_encode(["message" => "Datos guardados con éxito"]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
