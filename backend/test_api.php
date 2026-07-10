<?php
$ch = curl_init('http://127.0.0.1:8000/api/playlists');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email'=>'tiucrs@gmail.com', 'name'=>'Test Playlist']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "RESPONSE: " . $res . "\n";
$info = curl_getinfo($ch);
echo "STATUS: " . $info['http_code'] . "\n";
