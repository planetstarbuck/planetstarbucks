import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { List } from '../list';
import { TokenStorageService } from '../token-storage.service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit {
  private roles: string = '';
  isLoggedIn = false;
  username?: string;
  startup?: boolean
  other_button: boolean = true;
  button_text: string = "UNSAVE";


  lists: List[] = [];

  addToSaved(saved_id) {
    this.listService.addSaved(this.username, saved_id);
    window.alert('list added to my stuff!');
  }

  removeFromSaved(saved_id) {
    this.listService.removeSaved(this.username, saved_id);
    window.alert('list removed from my stuff!');
    this.getLists()
  }

  getLists(): void {
    this.listService.getSavedLists()
      .subscribe(lists => 
        {
          this.lists = lists;
          this.startup = false
        });
    }

  ngOnInit() { 
    this.startup = true
    this.getLists();
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
    }
  }


  constructor(
    private saveService: SaveService,
    private listService: ListService,
    private tokenStorageService: TokenStorageService
  ) { }
}