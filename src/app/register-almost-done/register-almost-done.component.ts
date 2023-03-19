import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { HttpErrorResponse } from '@angular/common/http';

 
@Component({
  selector: 'app-register-almost-done',
  templateUrl: './register-almost-done.component.html',
  styleUrls: ['./register-almost-done.component.css']
})
export class RegisterAlmostDoneComponent implements OnInit {

  gmail: boolean = false
  check_email: string  = '[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com)'; 
  email: string ;
  username: string | null;
  errorMessage: string | null;
  send_successful: boolean = false
  send: boolean = false

  resendEmail (email: string | null): any {
    this.listService.resendEmailValidation(this.email).subscribe(data => {
    this.send_successful = true;
    this.send = true;
    console.log("eerst succes hieronder, dan loaded, succesvolle flow")
    console.log(this.send_successful)
    console.log(this.send)
  },
  (err: HttpErrorResponse) => { 
    console.log(err.message)
    this.errorMessage = err.error.message;
    this.send_successful = false;
    this.send = true;
    console.log("eerst succes hieronder, dan loaded,NIET succesvolle flow")
    console.log(this.send_successful)
    console.log(this.send)
  });
  }

  constructor(
    private route: ActivatedRoute,
    private listService: ListService
    ) {  }


  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email');
    this.username  = this.route.snapshot.paramMap.get('username');
    const patt = RegExp(this.check_email)
    this.gmail = patt.test(this.email);
  }

}
