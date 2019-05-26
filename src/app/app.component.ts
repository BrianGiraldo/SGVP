import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ServiceHttp } from './services/service.http';
import { LocationStrategy} from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Ng4FilesService, Ng4FilesConfig } from 'angular4-files-upload';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
 	  

  constructor(public router: Router,public dialog: MatDialog,public service: ServiceHttp,private url:LocationStrategy,public _formBuilder: FormBuilder, public ng4FilesService: Ng4FilesService, public snackBar: MatSnackBar) { 
        this.LogInLogin();
  }

  ngOnInit() {
  	
  }

  private LogInLogin()
  {
    if(this.url.path() == '/' && localStorage.getItem('ustk_token') != null){
      this.router.navigate(['/inicio']);
    }
  }
   
}

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs/dialogs.component.html',
  styleUrls: ['./dialogs/dialogs.component.css']
})
export class DialogsComponent{

  public nc;
  public cp;
	constructor(public dialogRef: MatDialogRef<DialogsComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
		  this.nc = {
        emailnew:'',
        passnew:''
      };
      this.cp = {
        passold:'',
        passnew:''
      }
	}

 
    
}