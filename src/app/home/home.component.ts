import { Component, OnInit, NgZone } from '@angular/core';
import { AppComponent, DialogsComponent } from '../app.component';
import { FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import { Md5 } from 'ts-md5/dist/md5';
import { Ng4FilesStatus,Ng4FilesSelected, Ng4FilesConfig } from 'angular4-files-upload';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent extends AppComponent implements OnInit {

    isLinear = true;
    basicInfoFormGroup: FormGroup;
    documentsFormGroup: FormGroup;
    private greeting:string;
    private img_profile:string;
    private first_name:string;
    private uspss:string;
    private email:string;
    private testConfig: Ng4FilesConfig = {
    acceptExtensions: ['png', 'jpg', 'jpeg'],
    maxFilesCount: 1,
    maxFileSize: 5000000,
    totalFilesSize: 5000000
    };


  ngOnInit( ) {

    this.first_name = localStorage.getItem('us_names');
    this.uspss = localStorage.getItem('us_type');
    this.email = localStorage.getItem('us_email');
    this.ng4FilesService.addConfig(this.testConfig);

    this.basicInfoFormGroup = this._formBuilder.group({
        us_names: ['', Validators.required],
        us_lastnames: ['', Validators.required],
        st_idnumber:['', Validators.required],
        st_celphone:['', Validators.required],
        st_phone:['', Validators.required],
        st_address:['', Validators.required],
        st_schedule:['', Validators.required]
    });

    this.documentsFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.time();
    setInterval(()=>{
      this.time();
 	},60000);

    if(localStorage.getItem('us_img') == 'null' || localStorage.getItem('us_img') == ''){
        this.img_profile = './assets/profile.png';
    }
    else{
      this.img_profile = localStorage.getItem('us_img');
    }

  }

  private time(){
  	var now = moment(new Date());
  	var aux = parseInt(now.format('H'));
    if (aux <= 11) {
        this.greeting = "Buenos Días";
    } else if (aux >= 12 && aux <= 18) {
        this.greeting = "Buenas Tardes";
    } else if (aux > 18) {
        this.greeting = "Buenas Noches";
    }

  }

  public changePassWord(){

    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'change-password', title: 'Cambiar contraseña', msg: 'Por favor ingresa tu contraseña antigua para verificar tu identidad.'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        if(result.passold != '' && result.passnew != ''){

          let data = {
            function:'ChangePassWord',
            passnew: Md5.hashStr(result.passnew),
            passold: Md5.hashStr(result.passold),
            us_id: localStorage.getItem('us_id'),
            token: localStorage.getItem('ustk_token'),
            us_type: localStorage.getItem('us_type')
          };
          this.service.update(data).subscribe(res => {
            let response = res.json();
            if(response.data == 'oldpass-incorrect'){
              const dialogRef = this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña antigua es incorrecta'}
              });
            } else if(response.data == 'change-ok'){
              const dialogRef = this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Completado', msg: 'La contraseña se ha actualizado'}
              });

            } else{
              const dialogRef = this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña no se ha actualizado'}
              });
            }
          });
        }
      }
    });
  }

  public changePhoto():void{
    document.getElementById('input-home-photo').click();
  }

  public selectedFiles;

  public filesSelect(selectedFiles: Ng4FilesSelected): void {
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
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Extensión de archivo no permitido (JPG,PNG,JPEG).'}
        });
        return;
    }
    else if(selectedFiles.status == Ng4FilesStatus.STATUS_SUCCESS){
        this.selectedFiles = selectedFiles.files;
        let reader = new FileReader();
        let base64Image = '';
        reader.readAsDataURL(this.selectedFiles[0]);
        reader.onload = (e) => {
          base64Image = reader.result;
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = 300;
          canvas.height = 300;
          var image = document.createElement('img');
          image.src = base64Image;
          image.onload = (e)  => {
            context.drawImage(image, 0, 0, 300, 300);
            this.savePhoto(canvas.toDataURL('image/png', 1.0));
          };

        }
    }


  }


  public savePhoto(base64Image){

    let data = {
      function:'ChangePhoto',
      base64Image: base64Image,
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('ustk_token'),
      us_type: localStorage.getItem('us_type')
    };
    this.service.update(data).subscribe(res => {
        let response = res.json();
        if(response.data == 'change-ok'){
          document.getElementById('img-profile-1').setAttribute('src',base64Image);
          localStorage.setItem('us_img',base64Image);
          const dialogRef = this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Completado', msg: 'Foto de perfil actualizada'}
          });
        } else{
          const dialogRef = this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se pudo cambiar la foto.'}
          });
        }
    });
  }


}
