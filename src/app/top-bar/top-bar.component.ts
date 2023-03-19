import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { ListService } from '../list.service';
import { NewNotificationsService } from '../new-notifications.service';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  private roles: string = '';
  isLoggedIn = false;
  username: string | null;
  notificationcount: Number | null

  constructor(
    private tokenStorageService: TokenStorageService,
    private listService: ListService,
    private newNotificationsService: NewNotificationsService
    ) {   
      this.newNotificationsService.notificationcount.subscribe( value => {
      this.notificationcount = value; 
    });
}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.listService.getNotificationCount(this.username).subscribe(notificationcount => 
        {
          this.notificationcount = notificationcount;
          console.log(this.notificationcount)
          this.newNotificationsService.notificationcount.next(this.notificationcount);
        });
    }
  }
}






