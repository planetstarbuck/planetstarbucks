import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { SavePassword } from 'capacitor-ios-autofill-save-password';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  username: string = '';
  isBusy: boolean = false; 
  submitted: boolean = false; 
  returnUrl: string;
  tokenvalue: string; 
  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService, 
    private router: Router, 
    private route: ActivatedRoute,
    private fb: FormBuilder,


    ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.username = this.tokenStorage.getUser().username;
    }
    this.returnUrl = this.tokenStorage.redirectUrl!;


    this.loginform = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })

  }


  LogOn(username, password, tokenvalue): void {
  this.authService.login(username, password, tokenvalue).subscribe(
    data => {
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser(data);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.username = this.tokenStorage.getUser().username;
      if (Capacitor.getPlatform() === 'ios') {
        SavePassword.promptDialog({
            username: username,
            password: password,
        })
        .then(() => console.log('promptDialog success'))
        .catch((err) => console.error('promptDialog failure', err));
    }
      this.isBusy = false
      this.router.navigateByUrl(this.returnUrl).then(() => {
        window.location.reload();
      });
      // this.reloadPage();
    },
    err => {
      this.errorMessage = err.error.message;
      console.log("er is een error" + this.errorMessage)
      this.isLoginFailed = true;
      this.isBusy = false
    }
  );
}

onSubmit(): void {
  this.submitted = true;
  if (this.loginform.invalid) {
    return;
  }
  this.isBusy = true;
  const username = this.loginform.controls['username'].value;
  const password = this.loginform.controls['password'].value;
  this.tokenvalue = '';

  const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
  if (isPushNotificationsAvailable) {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        this.LogOn(username, password, this.tokenvalue);
      }
    });
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      this.tokenvalue = token.value;
      this.LogOn(username, password, this.tokenvalue);
    });
  } else {
    this.LogOn(username, password, this.tokenvalue);
  }
}



  onSubmitNotInUse(): void {
    this.submitted = true
    if (this.loginform.invalid) {
      return;
    }
    this.isBusy = true
    const username = this.loginform.controls['username'].value;
    const password = this.loginform.controls['password'].value;


    // UNCOMMENT IN CASE OF TESTING XCODE TESTING
          //  this.tokenvalue = ""
          //  this.LogOn(username, password, this.tokenvalue)


// COMMENT IN CASE OF TESTING XCODE TESTING
            const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
            
            if (isPushNotificationsAvailable) {
              PushNotifications.requestPermissions().then(result => {
                if (result.receive === 'granted') {
                  // Register with Apple / Google to receive push via APNS/FCM
                  PushNotifications.register();
                } else {
                  this.tokenvalue = ""
                  this.LogOn(username, password, this.tokenvalue);
                }
              });
              PushNotifications.addListener('registration', (token: Token) => {
                console.log('Push registration success, token: ' + token.value);
                this.tokenvalue = token.value;
                this.LogOn(username, password, this.tokenvalue)
              });    }

              else {
                this.tokenvalue = "";
                this.LogOn(username, password, this.tokenvalue)
              }
  // END OF COMMENT IN CASE OF TESTING XCODE TESTING
            console.log('Push notification token vlak na logOn call: ' + this.tokenvalue);


   }
  
  reloadPage(): void {
    window.location.reload();
  }
}