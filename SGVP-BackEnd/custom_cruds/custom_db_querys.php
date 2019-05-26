<?php

include("./custom_cruds/defualt_img_profile.php");


function db_LoginUser($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_email = $data["email"];
	$us_pass = $data["password"];
	$us_type = $data["type_u"];
	$additional_data = [];

	$SQL = "SELECT * FROM users WHERE us_email = '$us_email' AND us_type = '$us_type' ";
	$query_res = $db->query($SQL);

	if(!empty($query_res)){

		if($query_res[0]["us_pass"] == $us_pass){

			if($query_res[0]["us_state"] == 1){
				$token = db_GenerateToken($query_res[0]["us_id"]);
				$query_res2 = $token;
				$additional_data = [
					'us_id' => $query_res[0]["us_id"],
					'us_email' => $query_res[0]["us_email"],
					'us_names' =>  $query_res[0]["us_names"],
					'us_lastnames' =>  $query_res[0]["us_lastnames"],
					'us_type' =>  $query_res[0]["us_type"],
					'us_img' =>  $query_res[0]["us_img"]
					];
			}
			else{
				$query_res2 = 'account_disabled';
			}

		}
		else{
			$query_res2 = 'unauthorized';
		}
	}
	else{
		$query_res2 = 'unauthorized';
	}



	return array('data' => $query_res2,'additional_data' => $additional_data);
}


function db_GenerateToken($us_id){

    $cadena = "abcdefghijklmnopqrstuvwxyz1234567890";
    $longitudCadena=strlen($cadena);
    $token = "";
    $longitudPass=128;
    for($i=1 ; $i<=$longitudPass ; $i++){
        $pos=rand(0,$longitudCadena-1);
        $token .= substr($cadena,$pos,1);
    }

    $db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$current_date = new DateTime();
    $current_date = $current_date->format('Y-m-d H:i:s');

	$SQL = "INSERT INTO users_tokens(ustk_us_id, ustk_token) VALUES ('$us_id','$token')";
	$SQL2 = "UPDATE users SET us_last_login = '$current_date' WHERE us_id = '$us_id'";

	try {
		$query_res = $db->query($SQL);
		$query_res2 = $db->query($SQL2);
		$data_response = ['ustk_us_id' => $us_id, 'ustk_token' => $token];
		return $data_response;
	} catch (Exception $e) {
		return 'error-token';
	}

}

function db_Auth($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_id = $data['us_id'];
	$token = $data['token'];
	$us_type = $data['us_type'];

	$SQL = "SELECT us_type FROM users WHERE us_id = '$us_id'";
	$query_res = $db->query($SQL);

	if(!empty($query_res))
	{
		if($query_res[0]['us_type'] != $us_type)
		{
			$data_logout = ['us_id' => $us_id, 'ustk_token' => $token];
			db_Logout($data_logout);
			return array('data' => 'unauthorized');
		}
	}


	$SQL = "SELECT ustk_us_id FROM users_tokens WHERE ustk_us_id = '$us_id' AND ustk_token = '$token' ";
	$query_res = $db->query($SQL);

	if(!empty($query_res))
	{
		return array('data' => 'authorized');
	}
	else
	{
		$SQL = "DELETE FROM users_tokens WHERE  ustk_token = '$token' ";
		$query_res = $db->query($SQL);
		return array('data' => 'unauthorized');
	}

}

//

function db_Forgot($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$email = $data['emailforgot'];

	$SQL = "SELECT US.us_id,US.us_names,US.us_lastnames FROM users AS US WHERE US.us_email = '$email' ";
   	$query_res = $db->query($SQL);

   	if(empty($query_res))
   	{

    	return array('data' => "no-exist");
   	}
   	else
   	{
   		$newPass = db_GeneratePassword();
   		$newPassSave = md5($newPass);
   		$SQL2 = "UPDATE users SET us_pass = '$newPassSave' WHERE us_email = '$email' ";
   		$query_res2 = $db->query($SQL2);
   		sendMail($email,$newPass,$query_res);
   		return array('data' => 'reset-password');
   	}


}


function db_NewCompany($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$email = $data['emailnew'];
	$pass = $data['passnew'];

	$SQL = "SELECT US.us_id FROM users AS US WHERE US.us_email = '$email' ";
   	$query_res = $db->query($SQL);

   	if(!empty($query_res))
   	{

    	return array('data' => "exist");
   	}
   	else
   	{
   		$newPassSave = md5($pass);
   		$SQL2 = "INSERT INTO users(us_email, us_pass,us_type) VALUES ('$email','$newPassSave', 2)";
   		$query_res2 = $db->query($SQL2);
   		$SQL = "SELECT * FROM users WHERE us_email = '$email' ";
		$query_res = $db->query($SQL);
		$token = db_GenerateToken($query_res[0]["us_id"]);
		$query_res2 = $token;
		//CREAR EN LA TABLA COMPANY INFO
		$us_id = $query_res[0]["us_id"];
   		$SQL3 = "INSERT INTO company_info(comin_usersid) VALUES ('$us_id')";
   		$query_res3 = $db->query($SQL3);
   		///
		$additional_data = [
			'us_id' => $query_res[0]["us_id"],
			'us_email' => $query_res[0]["us_email"],
			'us_type' =>  $query_res[0]["us_type"],
			'us_img' =>  $query_res[0]["us_img"]
			];
   		return array('data' => $query_res2,'additional_data' => $additional_data);
   	}


}

function db_Logout($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$us_id = $data['us_id'];
	$ustk_token = $data['ustk_token'];

	$SQL = "SELECT ustk_us_id FROM users_tokens WHERE ustk_us_id = '$us_id' AND ustk_token = '$ustk_token' ";
   	$query_res = $db->query($SQL);

   	if(empty($query_res))
   	{

    	return array('data' => "no-logout");
   	}
   	else
   	{


   		$SQL = "DELETE FROM users_tokens WHERE ustk_us_id = '$us_id' AND ustk_token = '$ustk_token' ";
		$query_res = $db->query($SQL);
   		return array('data' => 'logout-ok');
   	}


}

function db_ChangePassWord($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$passnew =  $data['passnew'];
	$passold =  $data['passold'];
	$us_id =  $data['us_id'];



	$SQL = "SELECT us_id FROM users WHERE us_id = '$us_id' AND us_pass = '$passold'";
   	$query_res = $db->query($SQL);

   	if(empty($query_res))
   	{

    	return array('data' => "oldpass-incorrect");
   	}
   	else
   	{


   		$SQL = "UPDATE users SET us_pass = '$passnew' WHERE us_id = '$us_id' ";
		$query_res = $db->query($SQL);
   		return array('data' => 'change-ok');
   	}


}

function db_ChangePhoto($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$base64Image =  $data['base64Image'];
	$us_id =  $data['us_id'];
	$SQL = "UPDATE users SET us_img = '$base64Image' WHERE us_id = '$us_id' ";
	$query_res = $db->query($SQL);
   	return array('data' => 'change-ok');


}



function db_NewUser($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_email =  $data['query']['email'];
	$us_pass =  $data['query']['pass'];
	$us_names =  $data['query']['names'];
	$us_lastnames =  $data['query']['lastnames'];
	$us_type =  $data['query']['us_type'];
	$st_career =  $data['query']['st_career'];

	$SQL = "SELECT us_id FROM users WHERE us_email = '$us_email' AND us_type = '$us_type' ";
	$query_res = $db->query($SQL);
	if(!empty($query_res))
	{
		return array('data' => 'user-exist');
	}
	else
	{
		$SQL = "INSERT INTO users(us_email, us_pass, us_names, us_lastnames, us_type) VALUES ('$us_email','$us_pass','$us_names','$us_lastnames','$us_type')";
		$query_res = $db->query($SQL);
		if($us_type == 2){
			//CREAR EN LA TABLA COMPANY INFO
			$us_id = $query_res;
	   		$SQL3 = "INSERT INTO company_info(comin_usersid) VALUES ('$us_id')";
	   		$query_res3 = $db->query($SQL3);
   			///
		}
		if($us_type == 1){
			//CREAR EN LA TABLA STUDENT INFO
			$us_id = $query_res;
	   		$SQL3 = "INSERT INTO student_info(st_usersid,st_career) VALUES ('$us_id','$st_career')";
	   		$query_res3 = $db->query($SQL3);
   			///
		}
		return array('data' => 'user-create');
	}


}


function db_GetUsers($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);


	$limit =  $data['limit'];
	$offset =  $data['offset'];
	$param =  json_decode($data['param'], true);
	$us_id = $data['us_id'];


	$SQL = "SELECT us_id FROM users";
	$query_res = $db->query($SQL);
	if(empty($query_res))
	{
		return array('data' => '','data_length' => '');
	}
	else
	{

		$SQL2 = "SELECT
					US.us_id,
					US.us_email,
					US.us_names,
					US.us_lastnames,
					US.us_img,
					US.us_type,
					US.us_state,
					US.us_last_login,
					CI.comin_id,
					CI.comin_usersid,
					CI.comin_name,
					CI.comin_nit,
					CI.comin_address,
					CI.comin_phone,
					CI.comin_commerce,
					CI.comin_cardid,
					CI.comin_possesion,
					CI.comin_id,
					CI.comin_agreement,
					CI.comin_resolution,
					ST.st_id,
					ST.st_usersid,
					ST.st_idnumber,
					ST.st_career,
					ST.st_isfree,
					ST.st_teacherassc,
					ST.st_celphone,
					ST.st_phone,
					ST.st_address,
					ST.st_schedule,
					ST.st_hv,
					ST.st_cardid,
					ST.st_eps,
					ST.st_enrollment,
					ST.st_practice,
					PR.pro_name
					FROM users AS US
					LEFT JOIN company_info AS CI
					ON US.us_id = CI.comin_usersid
					LEFT JOIN student_info AS ST
					ON US.us_id = ST.st_usersid
					LEFT JOIN programs AS PR
					ON ST.st_career = PR.pro_id
					WHERE US.us_id != $us_id

					";

		$SQL = "SELECT COUNT(*) AS data_length FROM users AS US
					LEFT JOIN company_info AS CI
					ON US.us_id = CI.comin_usersid
					LEFT JOIN student_info AS ST
					ON US.us_id = ST.st_usersid  WHERE us_id != $us_id ";

		if($param['text'] != '') //FILTRO POR CORREO CEDULA O NIT
		{
			$p = $param['text'];
			$SQL2 .= " AND (US.us_email LIKE '%$p%' OR ST.st_idnumber = '$p' OR  CI.comin_nit = '$p')";
			$SQL .= " AND (US.us_email LIKE '%$p%' OR ST.st_idnumber = '$p' OR  CI.comin_nit = '$p')";
		}

		if($param['rol'] != "0") //FILTRO DE ROL
		{
			$r = $param['rol'];
			if($param['rol'] != "5" AND $param['rol'] != "6")
			{
				$SQL2 .= " AND US.us_type = '$r'";
				$SQL .= " AND US.us_type = '$r'";
			}
			else
			{
				if($param['rol'] == "5")
				{
					$SQL2 .= " AND ST.st_isfree = 1";
					$SQL .= " AND ST.st_isfree = 1";
				}
				else
				{
					$SQL2 .= " AND ST.st_isfree = '0'";
					$SQL .= " AND ST.st_isfree = '0'";
				}

			}

		}

		$SQL2 .= " ORDER BY US.us_id DESC";


		if($limit)
		{

			$SQL2 .= " LIMIT $limit";
		}

		if($offset)
		{
			$SQL2 .= " OFFSET $offset";
		}


		//echo $SQL;
		$query_res = $db->query($SQL);
		$query_res2 = $db->query($SQL2);
		$data = $query_res2;
		$data_length = $query_res[0]['data_length'];
		return array('data' => $data,'data_length' => $data_length);
	}



}


function db_GetPrograms($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$SQL = "SELECT * FROM programs";
	$query_res = $db->query($SQL);
	return array('data' => $query_res);
}




//RETORNAR ZONA HORARIA

function zoneH()
{
	$zone = 'America/Bogota';
	return $zone;
}
 ///

//GENERAR PASSWORD
function db_GeneratePassword(){

    $cadena = "abcdefghijklmnopqrstuvwxyz1234567890";
    $longitudCadena=strlen($cadena);
    $pass = "";
    $longitudPass=8;
    for($i=1 ; $i<=$longitudPass ; $i++){
        $pos=rand(0,$longitudCadena-1);
        $pass .= substr($cadena,$pos,1);
    }
    return $pass;
}

//

//ENVIAR MAIL

function sendMail($destinatario,$data,$data2)
{

	require_once("./lib/PHPMailer/class.phpmailer.php");
	require_once("./lib/PHPMailer/class.smtp.php");
	$mail = new PHPMailer();
	$mail->IsSMTP();
	$mail->SMTPAuth = true;
	$mail->SMTPSecure = 'ssl';
	$mail->Host = "smtp.gmail.com";
	$mail->Port = 465;
	$mail->Username = 'sgvpulp@gmail.com';
	$mail->Password = 'sgvpulp2017';
	$mail->From = 'brian.giraldo.m@gmail.com';
	$mail->FromName = "SGVP";
	$mail->Subject = "Recuperacion clave de acceso - Sistema de Gestión de Practicas Virtuales";
	$content = '<!DOCTYPE html>';
	$content .= '<html lang="en">';
	$content .= '<head>';
	$content .=  '<meta charset="UTF-8">';
	$content .=  '<title>SGVP</title>';
	$content .=  '</head>';
	$content .=  '<body style="background:linear-gradient(45deg, rgba(131,172,174,0.7) 0%, rgba(255,250,250,0.7) 100%);background-attachment: fixed;background-position: center center;background-size: cover;background-repeat: no-repeat;padding:1em;">';

	$content .= "<p style='background-color:white;padding:1em;width:90%;color:gray;'>";
	$content .= "<span style='font-size:1.4em;'>Hola ".$data2[0]["us_names"]."!</span><br><br>";
	$content .= "<span>Su nueva clave de acceso es: <span> ".$data."</span>";
	$content .= "</p>";

	$content .= "<p style='background-color:white;padding:1em;width:90%;color:gray;'>";
	$content .= "Este correo electronico se ha generado automaticamente. Por favor, no conteste a este correo electronico. Si tiene alguna pregunta o necesita ayuda, por favor dirigase a la universidad<br><br>";
	$content .= "Atentamente,<br><br>";
	$content .= "<span>SGVP</span><br>";
	$content .= "<span>Universidad Libre Pereira</span>";
	$content .= "</p>";

	$content .= '</body>';
	$content .=  '</html>';
	$mail->MsgHTML($content);
	$mail->AddAddress($destinatario, $data2[0]["us_names"]);
	$mail->IsHTML(true);
	if(!$mail->Send()) {
	echo "Error: " . $mail->ErrorInfo;
	} else {
	//echo "Mensaje enviado correctamente";
	}

}
















?>
