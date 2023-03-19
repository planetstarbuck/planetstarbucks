import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  username: string = '';
  hide : boolean = true;


  passwordHideSwitch() {
    this.hide = !this.hide;
  }

  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  rerouteAndReloadPage(): void {
    this.router.navigate(['/profile'])
  .then(() => {
    window.location.reload();
  });}

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe(
      data => {
        console.log(data);
        this.isSignUpFailed = false;
        this.router.navigate(['/register', 'almost-done', email, username])

        // this.authService.login(username, password).subscribe(
        //   data => {
        //     this.tokenStorage.saveToken(data.accessToken);
        //     this.tokenStorage.saveUser(data);
        //     this.isSuccessful = true;
        //     this.username = this.tokenStorage.getUser().username;
        //     this.rerouteAndReloadPage();
        //   },
        // );
      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
        this.isSignUpFailed = true;
      }
    );
  }
}



