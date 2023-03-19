import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewNotificationsService {
  public notificationcount: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);
  constructor() { }
}
