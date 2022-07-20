<?php
	header('Content-Type: application/json');
	$arr = json_decode(file_get_contents('php://input'), true);
	
	if ($arr) {
		echo json_encode(TRUE);
	} else {
		echo json_encode(FALSE);
	}
?>