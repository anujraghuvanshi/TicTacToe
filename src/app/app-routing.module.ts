import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MultiPlayerComponent } from './multi-player/multi-player.component';
import { SinglePlayerComponent } from './single-player/single-player.component';

let useLoggedIn = localStorage.getItem('user_email');

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'single-player', component: SinglePlayerComponent },
	{ path: 'multi-player', component: MultiPlayerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
