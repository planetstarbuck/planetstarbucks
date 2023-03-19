import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.css']
})
export class PasswordForgotComponent  implements OnInit {

  newEmail: FormGroup;
  email: string = '';
  errorMessage: string | null;
  send_successful: boolean = false
  isBusy: boolean = false
  send: boolean = false
  gmail: boolean = false
  check_email: string  = '[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com)'; 

  
  requestPassword (email: string | null): any {
    this.isBusy = true     
    this.listService.requestPasswordLink(email).subscribe(data => {
    this.send_successful = true;
    this.send = true     
    this.isBusy = false     
    console.log("eerst succes hieronder, dan loaded, succesvolle flow")
    console.log(this.send_successful)
  },
  (err: HttpErrorResponse) => { 
    console.log(err.message)
    this.errorMessage = err.error.message;
    this.send_successful = false;
    this.send = true     
    this.isBusy = false     
    console.log("eerst succes hieronder, dan loaded,NIET succesvolle flow")
    console.log(this.send_successful)
  });
  }

  onSubmit() {
    this.isBusy=true
    console.log(this.newEmail.value['email'])
    this.email = this.newEmail.value['email']
    this.requestPassword(this.email )
    const patt = RegExp(this.check_email)
    this.gmail = patt.test(this.email);
          }
  

  constructor(
    private listService: ListService,
    private fb: FormBuilder

    ) {  }


  ngOnInit(): void {
  this.newEmail = this.fb.group({
    email: '',
  })
  }

}
