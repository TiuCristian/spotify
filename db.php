<?php
$pdo = new PDO('mysql:host=localhost', 'root', '');
$pdo->exec("CREATE DATABASE IF NOT EXISTS spotify_db;");
echo "Database created successfully\n";
