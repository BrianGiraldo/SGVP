import { Component, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { ServiceHttp } from '../services/service.http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { DialogsComponent } from '../app.component';
import { Ng4FilesStatus,Ng4FilesSelected, Ng4FilesConfig, Ng4FilesService } from 'angular4-files-upload';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  private typeuser:any;
  private typeuserDefault:any = '1';
  private newu:any;
  private newuser_method_state:boolean;
  private getuser_method_state:boolean;
  private testConfig: Ng4FilesConfig = {
    acceptExtensions: ['xls','xlsx'],
    maxFilesCount: 1,
    maxFileSize: 5000000,
    totalFilesSize: 5000000
  };
  private users:any;
  private programs:any;
  private total_users:number;
  private getUsersParam:any;
  private getUsersOffset:number;
  private listFilter = [
	    {value: '0', viewValue: 'Todos'},
	    {value: '1', viewValue: 'Estudiantes'},
	    {value: '2', viewValue: 'Empresas'},
	    {value: '3', viewValue: 'Admin'},
	    {value: '4', viewValue: 'Docente'},
	    {value: '5', viewValue: 'Est. con Contrato'},
	    {value: '6', viewValue: 'Est. sin Contrato'}
   ];
  private currentUview:any;


 
  constructor(public service: ServiceHttp,public dialog: MatDialog, public ng4FilesService: Ng4FilesService) {
  	this.typeuser = [
	    {value: '1', viewValue: 'Estudiante'},
	    {value: '2', viewValue: 'Empresa'},
	    {value: '3', viewValue: 'Administrador'},
	    {value: '4', viewValue: 'Docente'}
    	];
    	this.newu = {
    		email:'',
    		pass:'',
    		names:'',
    		lastnames:'',
    		us_type: '',
        st_career:''
    	};
    	this.getUsersParam = {
    		text:'',
    		rol: '0'
    	};
    	this.getUsersOffset = 0;
    	this.newuser_method_state = false;
    	this.getuser_method_state = false;
    	this.users = [];
      this.programs = [];
    	this.total_users = 0;
    	this.ng4FilesService.addConfig(this.testConfig);
      this.getPrograms();
    	this.getUsers(10,this.getUsersOffset,this.getUsersParam);
    	this.currentUview = { us_img: null };
  }

  ngOnInit() {
  }


  public createUser(typeuserDefault){

  	this.newu.us_type = typeuserDefault;
  	if(this.newu.email != '' && this.newu.pass != '' && this.newu.names != '' && this.newu.lastnames != '' && this.newu.us_type != ''){
  		this.newu.pass = Md5.hashStr(this.newu.pass);
	  	let data = {
	        function:'NewUser',
	        query: this.newu,
	        us_id: localStorage.getItem('us_id'), 
	        token: localStorage.getItem('ustk_token'),
	        us_type: localStorage.getItem('us_type')
      	};
      	this.newuser_method_state = true;
      	this.service.set(data).subscribe(res => {
            let response = res.json();
            setTimeout(()=>{    
		       this.newuser_method_state = false;
		 	},500);
            if(response.data == 'user-exist'){
            	const dialogRef = this.dialog.open(DialogsComponent, {
		          width: '350px',
		          height: 'auto',
		          data: { typeDialog: 'alert', title: 'Espera...', msg: 'El correo electrónico ya ha sido usado en otra cuenta.'}
		        });
		        return;
            }
            else if(response.data == 'user-create'){
            	const dialogRef = this.dialog.open(DialogsComponent, {
		          width: '350px',
		          height: 'auto',
		          data: { typeDialog: 'alert', title: 'Completado', msg: 'Nuevo usuario registrado.'}
		        });
            }
            this.newu = {
				email:'',
				pass:'',
				names:'',
				lastnames:''
			};
			this.getUsers(10,this.getUsersOffset,this.getUsersParam);
        });
	  
  	}

  }

  public createUserExcel(){
  	document.getElementById('input-users-excel').click();
  	
  }

  public selectedFiles;
 
  public filesSelectcreateUserExcel(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILES_COUNT_EXCEED) {
      
      const dialogRef = this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Espera...', msg: 'Numero máximo de archivos excedido.'}
      });
      return;
      
    }
    else if(selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED){
        const dialogRef = this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Peso máximo de archivo excedido (5MB).'}
        });
        return;
    }
    else if(selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILES_TOTAL_SIZE_EXCEED){
        const dialogRef = this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Peso máximo de todos los archivos excedido (5MB).'}
        });
        return;
    }
    else if(selectedFiles.status == Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS){
        const dialogRef = this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Extensión de archivo no permitido (XLS,XLSX).'}
        });
        return;
    }
    else if(selectedFiles.status == Ng4FilesStatus.STATUS_SUCCESS){
        this.selectedFiles = selectedFiles.files[0];
        //CONVERTIR A BASE 64       
        
    }
 
    
  }


  public getUsers(limit,offset,param){
  	
  	this.getuser_method_state = true;
  	let data = {
        function:'GetUsers',
        limit:limit,
        offset:offset,
        param:param,
        us_id: localStorage.getItem('us_id'), 
        token: localStorage.getItem('ustk_token'),
        us_type: localStorage.getItem('us_type')
  	};
  	this.service.get(data).subscribe(res => {
            let response = res.json();
            this.getuser_method_state = false;
            if (this.getUsersOffset != 0) {
              this.users = this.users.concat(response.data);
            } else {
              this.users = response.data;
              this.total_users = response.data_length;
            }
    });
  }

  public getUsersMore() {
  	
  	this.getUsersOffset = this.users.length;
  	this.getUsers(10,this.getUsersOffset,this.getUsersParam);
  	
  }

  public searchUser(ev){
  	this.getUsersOffset = 0;
  	this.getUsers(10,this.getUsersOffset,this.getUsersParam);
  }

  public searchUserRol(ev){
  	this.getUsersOffset = 0;
  	this.getUsers(10,this.getUsersOffset,this.getUsersParam);
  }


  public viewUser(data){

  	this.currentUview = data;
  	document.getElementById('view-u').style.width = "420px";
  	document.getElementById('view-u').style.padding = "20px";
    console.log(data);

  }

  public closeviewUser(){
  	document.getElementById('view-u').style.width = "0px";
  	document.getElementById('view-u').style.padding = "0px";
  }


  public getPrograms() {

    let data = {
      function: 'GetPrograms',
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('ustk_token'),
      us_type: localStorage.getItem('us_type')
    };
    this.service.get(data).subscribe(res => {
      let response = res.json();
        this.programs = response.data;
    });
  }

}
