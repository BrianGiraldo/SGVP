import { Injectable } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ServiceHttp {

  public ServerUrl:string;
  public headers:any;
  public options:any;
  constructor(private http: Http)
  {
    this.ServerUrl = 'http://localhost:8888/SGVP-BackEnd/handler.php';
  	this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  public get(additionalData:any):Observable<Response>
  {
  	this.options = new RequestOptions({ headers: this.headers, params: additionalData });
  	return this.http.get(`${this.ServerUrl}`, this.options);
  }

  public set(additionalData:any):Observable<Response>
  {
  	additionalData = JSON.stringify(additionalData);
  	this.options = new RequestOptions({ headers: this.headers, params: additionalData });
  	return this.http.post(`${this.ServerUrl}`, this.options);
  }

  public update(additionalData:any):Observable<Response>
  {
  	additionalData = JSON.stringify(additionalData);
  	this.options = new RequestOptions({ headers: this.headers, params: additionalData });
  	return this.http.put(`${this.ServerUrl}`, this.options);
  }

}
