import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { ListService } from '../list.service';
import { NewNotificationsService } from '../new-notifications.service';
import { Notification } from '../list';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  private roles: string = '';
  isLoggedIn = false;
  username: string | null;
  notifications: Notification[] | null
  loading?: boolean = true
  notificationcount: Number | null


goToLinkAndMarkSeen(id, link)  {
  this.markSeen(id)
  this.router.navigateByUrl(link)
}

markSeen(id){
  this.listService.changeNotificationToRead(id).subscribe(data => {
      data = data
      this.getNotificationCount();
      this.listService.getNotifications(this.username).subscribe(notifications => 
        {
          this.notifications = notifications;
          console.log(this.notifications)
          this.loading = false
        });
    })
}


markUnseen(id){
  this.listService.changeNotificationToUnread(id).subscribe(data => {
    data = data
    this.getNotificationCount();
    this.listService.getNotifications(this.username).subscribe(notifications => 
        {
          this.notifications = notifications;
          console.log(this.notifications)
          this.loading = false
        });
    })
}


getNotificationCount(){
this.listService.getNotificationCount(this.username).subscribe(notificationcount => 
  {
    this.notificationcount = notificationcount;
    console.log(this.notificationcount)
    this.newNotificationsService.notificationcount.next(this.notificationcount);
  });
}


  ngOnInit(): void {
    this.loading = true
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
    }
    this.listService.getNotifications(this.username).subscribe(notifications => 
      {
        this.notifications = notifications;
        console.log(this.notifications)
        this.loading = false
      });
  }

  constructor(
    private listService: ListService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private newNotificationsService: NewNotificationsService
    ) {   
      this.newNotificationsService.notificationcount.subscribe( value => {
      this.notificationcount = value; 
    });
}
}


