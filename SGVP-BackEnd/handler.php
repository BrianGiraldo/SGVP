<?php 

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); 
header('Access-Control-Allow-Headers: Content-Type, application/json');


include('./lib/handler/params.php');
include('./lib/pdo-dc/Db.class.php');
include('./custom_cruds/custom_db_querys.php');

$params  = new Params();

//print json_encode(array('data' => 'update'));
//return false;

//ini_set('display_errors', 1);
//error_reporting(E_ALL | E_STRICT);


switch ($params->getmethod()) {

		case 'GET':

		$query = $params->getall();
		
	
		if (isset($query['function']))
		{
			switch ($query['function']) 
			{
					case 'LoginUser':

						$func_status = db_LoginUser($query);
						print json_encode($func_status);

					break;
					case 'Auth':

						$func_status = db_Auth($query);
						print json_encode($func_status);
						
					break;
					case 'Forgot':

						$func_status = db_Forgot($query);
						print json_encode($func_status);
					break;
					case 'NewCompany':

						$func_status = db_NewCompany($query);
						print json_encode($func_status);
					break;
					case 'GetUsers':

						$auth = db_Auth($query);
						if($auth == 'unauthorized')
						{
							print json_encode(array('data' => 'unauthorized'));
						}
						else
						{
							$func_status = db_GetUsers($query);
							print json_encode($func_status); 
						}
					break;
					case 'GetPrograms':

						$auth = db_Auth($query);
						if($auth == 'unauthorized')
						{
							print json_encode(array('data' => 'unauthorized'));
						}
						else
						{
							$func_status = db_GetPrograms($query);
							print json_encode($func_status); 
						}
					break;

			}

		}


		break;
		case 'POST':

		$query = $params->getall();
		$decode_json = json_decode($query['raw'],true);
		$decode_json = json_decode($decode_json['params']['rawParams'],true);
		
		if (isset($decode_json['function']))
		{
			switch ($decode_json['function']) 
			{
					
			
					case 'NewUser':

						$auth = db_Auth($decode_json);
						if($auth == 'unauthorized')
						{
							print json_encode(array('data' => 'unauthorized'));
						}
						else
						{
							$func_status = db_NewUser($decode_json);
							print json_encode($func_status); 
						}
					break;

			}

		}
		

		break;
		case 'PUT':

		$query = $params->getall();
		$decode_json = json_decode($query['raw'],true);
		$decode_json = json_decode($decode_json['params']['rawParams'],true);


		if (isset($decode_json['function']))
		{
			switch ($decode_json['function']) 
			{
					case 'Logout':

						$func_status = db_Logout($decode_json);
						print json_encode($func_status);
					break;
					case 'ChangePassWord':

						$auth = db_Auth($decode_json);
						if($auth == 'unauthorized')
						{
							print json_encode(array('data' => 'unauthorized'));
						}
						else
						{
							$func_status = db_ChangePassWord($decode_json);
							print json_encode($func_status); 
						}

					break;
					case 'ChangePhoto':

						$auth = db_Auth($decode_json);
						if($auth == 'unauthorized')
						{
							print json_encode(array('data' => 'unauthorized'));
						}
						else
						{
							$func_status = db_ChangePhoto($decode_json);
							print json_encode($func_status); 
						}

					break;
					
			}

		}

		break;
		case 'DELETE':
		break;

}


 ?>
