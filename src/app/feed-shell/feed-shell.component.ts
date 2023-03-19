import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from "rxjs";

import { List } from '../list';

@Component({
  selector: 'app-feed-shell',
  templateUrl: './feed-shell.component.html',
  styleUrls: ['./feed-shell.component.css']
})
export class FeedShellComponent implements OnInit {


  @Input() lists: List[] = [];
  @Input() isLoggedIn = false;
  @Input() loading = true;
  @Input() saved_lists: Array<string>;
  @Input() isFollowedCollapsed: boolean[] = [];
  @Input() isUnfollowedCollapsed: boolean[] = [];
  @Input() startup: boolean;
  @Input() other_button: boolean;
  @Input() button_text: string;
  @Input() button_target: string;
  @Input() lists$: Observable<any>;
  @Output() unSaveEvent = new EventEmitter<string>();
  @Output() saveEvent = new EventEmitter<string>();


  removeFromSaved(value: string) {
    this.unSaveEvent.emit(value);
  }

  addToSaved(value: string) {
    this.saveEvent.emit(value);
  }

  constructor() { }

  ngOnInit(): void {
  }

}







