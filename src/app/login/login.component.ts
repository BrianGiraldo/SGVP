import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AppComponent, DialogsComponent } from '../app.component';
import { Md5 } from 'ts-md5/dist/md5';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends AppComponent implements OnInit {

  
  private typeuser = [
    {value: '1', viewValue: 'Estudiante'},
    {value: '2', viewValue: 'Empresa'},
    {value: '3', viewValue: 'Administrador'},
    {value: '4', viewValue: 'Docente'}
  ];

  private typeuserDefault:any = '2';
  private username:string;
  private password:string;
  private login_method_state:boolean;
  	
  ngOnInit() {
  	this.username = '';
  	this.password = ''; 
  	this.login_method_state = false;

  }

  public login(email: string, password: string) {


  	if(this.login_method_state == true)
  	{
  		return false;
  	}

  	this.login_method_state = true;
  	let md5 = new Md5();
  	let data = {
  		function:'LoginUser',
  		email: email,
  		password:md5.appendStr(password).end(),
  		type_u:this.typeuserDefault
  	};
  	if(email == '')
  	{
  		const dialogRef = this.dialog.open(DialogsComponent, {
      		width: '350px',
      		height: 'auto',
      		data: { typeDialog: 'alert', title: 'Espera...', msg: 'La dirección de correo electrónico esta vacia.'}
    	});
    	this.login_method_state = false;
    	return false;
  	}
  	if(password == '')
  	{
  		const dialogRef = this.dialog.open(DialogsComponent, {
      		width: '350px',
      		height: 'auto',
      		data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña esta vacia.'}
    	});
    	this.login_method_state = false;
    	return false;
  	}

  	this.service.get(data).subscribe(res => {
        let response = res.json();
        if(response.data == 'unauthorized'){
        	const dialogRef = this.dialog.open(DialogsComponent, {
	      		width: '350px',
	      		height: 'auto',
	      		data: { typeDialog: 'alert', title: 'Espera...', msg: 'Correo electrónico o contraseña no validos.'}
    		});
        }
        else if(response.data == 'account_disabled'){
        	const dialogRef = this.dialog.open(DialogsComponent, {
	      		width: '350px',
	      		height: 'auto',
	      		data: { typeDialog: 'alert', title: 'Espera...', msg: 'La cuenta esta deshabilitada.'}
    		});
        }
        else if(response.data == 'error-token'){
        	const dialogRef = this.dialog.open(DialogsComponent, {
	      		width: '350px',
	      		height: 'auto',
	      		data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se ha podido iniciar, inténtalo mas tarde'}
    		});
        }
        else{
        	
        	localStorage.setItem('ustk_token',response.data.ustk_token);
        	localStorage.setItem('us_email',response.additional_data.us_email);
        	localStorage.setItem('us_id',response.additional_data.us_id);
        	localStorage.setItem('us_names',response.additional_data.us_names);
        	localStorage.setItem('us_lastnames',response.additional_data.us_lastnames);
        	localStorage.setItem('us_type',response.additional_data.us_type);
        	localStorage.setItem('us_img',response.additional_data.us_img);
        	this.router.navigate(['/inicio']);
          this.snackBar.open("Bienvenid@ a SGVP "+response.additional_data.us_names, "Cerrar", {
            duration: 4000
          });
        }
        this.login_method_state = false;
    });

  }

  public openForgot(): void{
  	const dialogRef = this.dialog.open(DialogsComponent, {
  		width: '350px',
  		height: 'auto',
  		data: { typeDialog: 'forgot', title: 'Restablecer Contraseña', msg: 'Ingresa el correo electrónico con el que inicias sesión'}
	});
	dialogRef.afterClosed().subscribe(result => {
      	  
	      if(result != undefined){
	      	let data = {
	      		function:'Forgot',
  				  emailforgot: result
	      	};
	      	this.service.get(data).subscribe(res => {
	      		let response = res.json();
	      		if(response.data == 'no-exist'){
	      			const dialogRef = this.dialog.open(DialogsComponent, {
			      		width: '350px',
			      		height: 'auto',
			      		data: { typeDialog: 'alert', title: 'Espera...', msg: 'El correo ingresado no pertenece a ninguna cuenta.'}
		    		});
	      		} else if(response.data == 'reset-password'){
	      			const dialogRef = this.dialog.open(DialogsComponent, {
			      		width: '350px',
			      		height: 'auto',
			      		data: { typeDialog: 'alert', title: 'Restablecer Contraseña', msg: 'La contraseña se ha restablecido, revisa tu correo por favor.'}
		    		});
	      		}
	      	});
	      }
    });

  }

  public newCompany(): void {
  	const dialogRef = this.dialog.open(DialogsComponent, {
  		width: '350px',
  		height: 'auto',
  		data: { typeDialog: 'new-company', title: 'Crear cuenta empresa', msg: 'Ingresa un correo electrónico y una contraseña para crear tu cuenta '}
	  });
	  dialogRef.afterClosed().subscribe(result => {

      if(result != undefined){
    		if(result.emailnew != '' && result.passnew != ''){
    			    let data = {
    	      		function:'NewCompany',
      				  emailnew: result.emailnew,
      				  passnew: result.passnew
    	      	};
    	      	this.service.get(data).subscribe(res => {
    	      		let response = res.json();
    	      		if(response.data == 'exist'){
    	      			const dialogRef = this.dialog.open(DialogsComponent, {
    			      		width: '350px',
    			      		height: 'auto',
    			      		data: { typeDialog: 'alert', title: 'Espera...', msg: 'La cuenta ya esta en uso.'}
    		    		});
    	      		} else{
    	      			localStorage.setItem('ustk_token',response.data.ustk_token);
    		        	localStorage.setItem('us_email',response.additional_data.us_email);
    		        	localStorage.setItem('us_id',response.additional_data.us_id);
    		        	localStorage.setItem('us_type',response.additional_data.us_type);
    		        	localStorage.setItem('us_img',response.additional_data.us_img);
    		        	this.router.navigate(['/inicio']);
                  this.snackBar.open("Bienvenid@ a SGVP", "Cerrar", {
                    duration: 4000
                  });
    	      		}
    	      	});
    		}
      }
  	});
  }


}