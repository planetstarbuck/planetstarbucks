import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { ListService } from '../list.service';
import { NewNotificationsService } from '../new-notifications.service';


@Component({
  selector: 'app-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.css']
})
export class MyStuffComponent implements OnInit {

  private roles: string = '';
  isLoggedIn = false;
  username: string | null;
  notificationcount: Number | null


  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
    }
    this.listService.getNotificationCount(this.username).subscribe(notificationcount => 
      {
        this.notificationcount = notificationcount;
        console.log(this.notificationcount)
        this.newNotificationsService.notificationcount.next(this.notificationcount);
      });
  }

  constructor(
    private listService: ListService,
    private tokenStorageService: TokenStorageService,
    private newNotificationsService: NewNotificationsService
    ) {   
      this.newNotificationsService.notificationcount.subscribe( value => {
      this.notificationcount = value; 
    });
}

}
