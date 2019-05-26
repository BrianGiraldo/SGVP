import { Component, OnInit } from '@angular/core';
import { AppComponent, DialogsComponent } from '../app.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends AppComponent implements OnInit {

  public HCemail:string;
  private uspss:string;
  ngOnInit() {
    this.HCemail = localStorage.getItem('us_email');
    this.uspss = localStorage.getItem('us_type');
  }

  public logout() {

    let data = {
        function:'Logout',
        ustk_token: localStorage.getItem('ustk_token'),
        us_id: localStorage.getItem('us_id'),
          
    };
    this.service.update(data).subscribe(res => {
      let response = res.json();
      if(response.data == 'no-logout'){
        const dialogRef = this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Espera...', msg: 'Imposible cerrar sesion ahora.'}
        });
      } else{
          localStorage.clear();
          this.router.navigate(['/']);
      }

    });
    
  }

}
