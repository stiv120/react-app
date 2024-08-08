<?php
	/**
	* Database Connection
	*/
	class DbConnect {
		private $pass;
		private $user;
		private $server;
		private $dbname;
	
		public function __construct() {
			$this->pass = getenv('DB_PASS');
			$this->user = getenv('DB_USER');
			$this->server = getenv('DB_HOST');
			$this->dbname = getenv('DB_NAME');
		}
	
		public function connect() {
			try {
				$conn = new PDO('mysql:host=' . $this->server . ';dbname=' . $this->dbname, $this->user, $this->pass);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				return $conn;
			} catch (Exception $e) {
				echo "Database Error: " . $e->getMessage();
			}
		}
	}
?>