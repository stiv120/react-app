<?php
class Ciudad {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getAllCiudades() {
        $stmt = $this->conn->prepare('SELECT * FROM ciudad ORDER BY nombre ASC');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}