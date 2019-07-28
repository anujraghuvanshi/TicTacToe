import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';


@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

	constructor(private fb: FormBuilder, public firebaseService: FirebaseService,  private router: Router, private snackBar: MatSnackBar) {
	}

	validation_messages = {
		name: [
			{ type: 'required', message: 'Name is required.' }
		],
		password: [
			{ type: 'required', message: 'Password is required.' }
		]
	};

	registerBtnText = 'Register';

	// Form Object
	registerForm = new FormGroup({
		name 	 : new FormControl('', Validators.required),
		password : new FormControl('', Validators.required)
    });

	ngOnInit() {

	}


	onSubmit(value) {
		this.registerBtnText = 'Please wait...';
		this.firebaseService.createUser(value.name, value.password)
		.then(
			res => {
				if (res.message) {
					this.registerBtnText = 'Register';
					this.snackBar.open(res.message, '', {
				      duration: 4000,
				      verticalPosition: 'top'
				    });
				 return;
				}

				if (res.user && Object.keys(res.user).length > 0) {
					this.resetFields();
					this.snackBar.open('You are registered successfully', '', {
				      duration: 4000,
				      verticalPosition: 'top'
				    });
					setTimeout(() => {
						this.router.navigate(['login']);
					}, 200);
				}
			}
		);
	}

	resetFields() {
		this.registerForm = this.fb.group({
			name: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required),
		});
	}

}
