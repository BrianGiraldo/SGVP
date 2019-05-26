import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ServiceHttp } from './service.http';
import 'rxjs/add/operator/map'


@Injectable()
export class AuthguardGuard implements CanActivate {

  constructor(private router: Router,private service: ServiceHttp){}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
 
    let data = {
		function:'Auth',
		us_id: localStorage.getItem('us_id'), 
		token: localStorage.getItem('ustk_token'),
        us_type: localStorage.getItem('us_type')
	};

	if (data.token != null) {
        return this.service.get(data).map(res => {
            let response = res.json();

            if (response.data == 'unauthorized') {
                localStorage.clear();
                this.router.navigate(['/']);
                return false;
            } else {
                return true;
            }
        });
    } else {

        this.router.navigate(['/']);
        return false;
    }    
  }
}
