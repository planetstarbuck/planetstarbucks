import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { List } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { Location } from "@angular/common";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {



  lists: List[] = [];
  private roles: string[] = [];
  isLoggedIn = false;
  showDropLink = false;
  username?: string;
  saved_lists: Array<string>
  startup: boolean
  button_text: string = "SAVE";
  
  goBack(): void {
    this.location.back();
  }


  addToSaved(saved_id) {
    this.tokenStorageService.addSavedList(saved_id)
    this.saved_lists = this.tokenStorageService.getSavedList()
    this.listService.addSaved(this.username, saved_id);
  }

  removeFromSaved(saved_id) {
    this.tokenStorageService.removeSavedList(saved_id);
    this.saved_lists = this.tokenStorageService.getSavedList();
    const user = this.tokenStorageService.getUser();
    const username = user.username;
    this.listService.removeSaved(username, saved_id);
  }



  getListsByUser(): void {
    const user2 = this.route.snapshot.paramMap.get('user');
    console.log("de user = " + user2);
    this.listService.getListsByUser(user2)
        .subscribe(lists => 
        {
          this.lists = lists;
          this.startup = false
        });
    }

  ngOnInit() { 
    this.startup = true
    // dit is handig om bij SAVE enzo weer op dezelfde page uit te komen na inloggen
    this.tokenStorageService.redirectUrl = this.route.snapshot['_routerState'].url

    this.getListsByUser();
    this.isLoggedIn = !!this.tokenStorageService.getToken();  
    if (this.isLoggedIn) {
      this.saved_lists = this.tokenStorageService.getSavedList();
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showDropLink = true;
      this.username = user.username;
  }



  }


  constructor(
    private route: ActivatedRoute,
    private saveService: SaveService,
    private listService: ListService,
    private tokenStorageService: TokenStorageService,
    private location: Location
  ) { }
}






