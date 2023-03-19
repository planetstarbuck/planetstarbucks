import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.css']
})
export class PasswordUpdateComponent  implements OnInit {

  newPassword: FormGroup;
  password: string | null = '';
  errorMessage: string | null;
  username: string | null;
  token: string | null;
  email: string | null;
  send_successful: boolean = false
  isBusy: boolean = false
  send: boolean = false
  hide : boolean = true;

  passwordHideSwitch() {
    this.hide = !this.hide;
  }
  
  changePassword (password: string | null): any {
    this.listService.updatePassword(this.email, password, this.username, this.token).subscribe(data => {
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
    console.log(this.newPassword.value['password'])
    const password = this.newPassword.value['password']
    this.changePassword(password)
          }
  

  constructor(
    private listService: ListService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    ) {  }


  ngOnInit(): void {
    this.username  = this.route.snapshot.paramMap.get('username');
    this.token  = this.route.snapshot.paramMap.get('token');
    this.email  = this.route.snapshot.paramMap.get('email');

    this.newPassword = this.fb.group({
      password: '',
    })
  }

}
