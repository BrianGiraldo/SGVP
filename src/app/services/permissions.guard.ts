import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class PermissionsGuard implements CanActivate {

  constructor(private router : Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  	let uspss = parseInt(localStorage.getItem('us_type'));

  	if(state.url == '/usuarios'){
  		if(uspss == 3){
  			return true;
  		}else{
  			this.router.navigate(['/inicio']);
  			return false;
  		}
  	}
  	else if(state.url == '/ofertas'){
  		if(uspss == 3 || uspss == 2){
  			return true;
  		}else{
  			this.router.navigate(['/inicio']);
  			return false;
  		}
  	}
  	else if(state.url == '/inicio'){
  		return true;
  	}
  	else{
  		return false;
  	}


  }
}
