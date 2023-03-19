import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.css']
})
export class RegisterSuccessComponent implements OnInit {

  email: string | null;
  token: string | null;
  errorMessage: string | null;
  success: boolean = false
  loaded: boolean = false
  send_successful: boolean = false
  isBusy: boolean = false
  send: boolean = false

  constructor(
    private route: ActivatedRoute,
    private listService: ListService
  ) { }


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


  ngOnInit(): void {
    this.email  = this.route.snapshot.paramMap.get('email');
    this.token  = this.route.snapshot.paramMap.get('token');
    console.log(this.email)
    console.log(this.token)

    this.listService.checkEmailValidation(this.token, this.email).subscribe(data => {
      this.success = true;
      this.loaded = true;
      console.log("eerst succes hieronder, dan loaded, succesvolle flow")
      console.log(this.success)
      console.log(this.loaded)
    },
    (err: HttpErrorResponse) => { 
      console.log(err.message)
      this.errorMessage = err.error.message;
      this.success = false;
      this.loaded = true;
      console.log("eerst succes hieronder, dan loaded,NIET succesvolle flow")
      console.log(this.success)
      console.log(this.loaded)
    });




  //   this.listService.checkEmailValidation(this.token, this.email).subscribe((data: any) => {
  //     this.user;
  //     this.success = true
  //     console.log("check validation is done lijkt het")
  //   },
  //   (error) => {                              //Error callback
  //     console.error('error caught in component')
  //     this.success = false;

  //     //throw error;   //You can also throw the error to a global error handler
  //   }
  // )


}
}