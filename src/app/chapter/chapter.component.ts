import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { List } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { Location } from "@angular/common";


@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {


  private roles: string[] = [];
  isLoggedIn = false;
  showDropLink = false;
  chapter?: string;
  username?: string;
  lists: List[] = [];
  followed_chapters: any;
  saved_lists: Array<string>;
  button_text: string = "UNSAVE";
  startup: boolean;



  goBack(): void {
    this.location.back();
  }


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


  unfollowChapter(chapter) {
    this.listService.unfollowChapter(chapter);
    this.tokenStorageService.removeSavedChapter(chapter)
    const user = this.tokenStorageService.getUser();
    this.followed_chapters = user.followed_chapters;
  }
  
  followChapter(chapter) {
    this.listService.followChapter(chapter);
    this.tokenStorageService.addSavedChapter(chapter)
    const user = this.tokenStorageService.getUser();
    this.followed_chapters = user.followed_chapters;
  }

  getListsByChapter(): void {
    const chapter = this.route.snapshot.paramMap.get('chapter');
    this.chapter = chapter
    // console.log("het chapter = " + chapter);
    this.listService.getListsByChapter(chapter)
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

    this.getListsByChapter();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
  const user = this.tokenStorageService.getUser();
  this.followed_chapters = user.followed_chapters;
  this.username = user.username;
  this.saved_lists = this.tokenStorageService.getSavedList()
  this.showDropLink = true

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





