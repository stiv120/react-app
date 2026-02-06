<?php
/**
 * Database Connection
 * Usa config.php en InfinityFree, o variables de entorno en Vercel
 */
class DbConnect {
    private $pass;
    private $user;
    private $server;
    private $dbname;

    public function __construct() {
        // Intentar cargar config.php (para InfinityFree)
        $configFile = __DIR__ . '/config.php';
        if (file_exists($configFile)) {
            $config = require $configFile;
            $this->server = $config['DB_HOST'];
            $this->user = $config['DB_USER'];
            $this->pass = $config['DB_PASS'];
            $this->dbname = $config['DB_NAME'];
        } else {
            // Variables de entorno (para Vercel u otros)
            $this->server = getenv('DB_HOST');
            $this->user = getenv('DB_USER');
            $this->pass = getenv('DB_PASS');
            $this->dbname = getenv('DB_NAME');
        }
    }

    public function connect() {
        try {
            $conn = new PDO('mysql:host=' . $this->server . ';dbname=' . $this->dbname, $this->user, $this->pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (Exception $e) {
            echo json_encode(['error' => 'Database Error: ' . $e->getMessage()]);
            return null;
        }
    }
}
