import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { List } from '../list';
import { TokenStorageService } from '../token-storage.service';

@Component({
  selector: 'app-drops',
  templateUrl: './drops.component.html',
  styleUrls: ['./drops.component.css']
})
export class DropsComponent implements OnInit {

  isLoggedIn = false;
  username: string;
  lists: List[] = [];
  startup?: boolean
  saved_lists: Array<string>;
  button_text: string = "EDIT";
  button_target: string = "/edit";

  addToSaved(saved_id) {
    this.listService.addSaved(this.username, saved_id);
    this.tokenStorageService.addSavedList(saved_id)
    this.saved_lists = this.tokenStorageService.getSavedList()
  }
  
  removeFromSaved(saved_id) {
    const user = this.tokenStorageService.getUser();
    const username = user.username;
    this.listService.removeSaved(username, saved_id);
    this.tokenStorageService.removeSavedList(saved_id);
    this.saved_lists = this.tokenStorageService.getSavedList();
  }



  getListsByUser(): void {
    this.listService.getListsByUser(this.username)
    .subscribe(lists => 
      {this.lists = lists;
        this.startup = false})
    }

  ngOnInit() { 
    this.startup = true
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
      this.saved_lists = this.tokenStorageService.getSavedList()
    }
    this.getListsByUser();
  }


  constructor(
      private saveService: SaveService,
      private tokenStorageService: TokenStorageService,
      private listService: ListService,
      private route: ActivatedRoute

  ) { }
}






