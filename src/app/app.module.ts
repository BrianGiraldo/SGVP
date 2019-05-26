import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { Routes,RouterModule} from "@angular/router";
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
//import { MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdDialogModule, MdProgressBarModule, MdMenuModule, MdToolbarModule, MdIconModule, MatTooltipModule, MatStepperModule, MatCardModule, MatSnackBarModule, MatExpansionModule, MatProgressSpinnerModule, MatRadioModule} from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatDialogModule, MatProgressBarModule, MatMenuModule, MatToolbarModule, MatIconModule, MatTooltipModule, MatStepperModule, MatCardModule, MatSnackBarModule, MatExpansionModule, MatProgressSpinnerModule, MatRadioModule, MatListModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ServiceHttp } from './services/service.http';
import { AuthguardGuard } from './services/authguard.guard';
import { PermissionsGuard } from './services/permissions.guard';
import * as moment from 'moment';
import { MomentModule } from 'angular2-moment';
import { Ng4FilesModule } from 'angular4-files-upload';



import { AppComponent, DialogsComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { UsersComponent } from './users/users.component';
import { OffersComponent } from './offers/offers.component';





const appRoutes: Routes = [
	{
		path:'',
		component:LoginComponent
	},
	{
		path:'inicio',
		component:HomeComponent,
		canActivate: [AuthguardGuard,PermissionsGuard]
		
	},
	{
		path:'usuarios',
		component:UsersComponent,
		canActivate: [AuthguardGuard,PermissionsGuard]
		
	},
	{
		path:'ofertas',
		component:OffersComponent,
		canActivate: [AuthguardGuard,PermissionsGuard]
		
	},
	{ path: '**', redirectTo: 'inicio' }
];




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DialogsComponent,
    MenuComponent,
    UsersComponent,
    OffersComponent
  ],
  entryComponents: [
    DialogsComponent
  ],
  imports: [
  	RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressBarModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatStepperModule,
    MatCardModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatListModule,
    HttpModule,
    MomentModule,
    Ng4FilesModule
  ],
  providers: [
  	ServiceHttp,
  	AuthguardGuard,
  	PermissionsGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

	constructor(){
		moment.locale("es");
	}
}


