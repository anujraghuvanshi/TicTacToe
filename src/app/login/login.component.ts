import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import { FirebaseService } from '../services/firebase.service';
import { SharedService } from '../services/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

    allUsers: Observable<any[]>;

    constructor(private fb: FormBuilder,
        public firebaseService: FirebaseService,
        private router: Router,
        private snackBar: MatSnackBar,
        private data: SharedService) {

    }

    validation_messages = {
        name: [
            { type: 'required', message: 'Name is required.' }
        ],
        password: [
            { type: 'required', message: 'Password is required.' }
        ]
    };

    loginBtnText = 'Log In';

    // Form Object
    loginForm = new FormGroup({
        name 	 : new FormControl('', Validators.required),
        password : new FormControl('', Validators.required)
    });

    ngOnInit() {
        this.loginBtnText = 'Log In';
    }

    onSubmit = (value) => {
        this.loginBtnText = 'Please wait...';
        this.firebaseService.login(value.name, value.password)
        .then(
        res => {

            if (res.message) {
                this.loginBtnText = 'Log In';
                this.snackBar.open(res.message, '', {
                    duration: 4000,
                    verticalPosition: 'top'
                });
                return;
            }

            if (res.user && Object.keys(res.user).length > 0) {
                this.data.changeStatus(res.user.email);
                this.snackBar.open('You are logged in successfully', '', {
                    duration: 4000,
                    verticalPosition: 'top'
                });
                localStorage.setItem('user_email', res.user.email);
                setTimeout(() => {
                    this.router.navigate(['single-player']);
                }, 200);
            }
        });
    }

    resetFields() {
        this.loginForm = this.fb.group({
            name: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    doGoogleLogin() {
        this.firebaseService.doGoogleLogin()
        .then(res => {
            this.data.changeStatus(res.user.email);
            localStorage.setItem('user_email', res.user.email);
            setTimeout(() => {
                this.router.navigate(['single-player']);
            }, 200);
        })
    }
}
