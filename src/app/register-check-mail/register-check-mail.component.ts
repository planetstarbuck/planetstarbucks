import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder } from "@angular/forms";


@Component({
  selector: 'app-register-check-mail',
  templateUrl: './register-check-mail.component.html',
  styleUrls: ['./register-check-mail.component.css']
})
export class RegisterCheckMailComponent implements OnInit {

  newEmail: FormGroup;
  email: string | null = '';
  errorMessage: string | null;
  send_successful: boolean = false
  isBusy: boolean = false
  send: boolean = false


  
  resendEmail (email: string | null): any {
    this.listService.resendEmailValidation(email).subscribe(data => {
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
    const email = this.newEmail.value['email']
    this.resendEmail(email)
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
