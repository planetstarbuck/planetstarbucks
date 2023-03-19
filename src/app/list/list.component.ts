import { Component, TemplateRef, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../list.service';
import { List, Sublist, Item } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { Meta } from '@angular/platform-browser';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from "@angular/common";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  isLoggedIn = false;
  showDropLink = false;
  shortlistloading = false;
  loading?: boolean
  commentsloading = true
  copy = false;
  flagged = false;
  commentflagged = false;
  saved_lists: Array<string>
  username?: string;
  listid?: string;
  // sublist?: Sublist
  item?: Array<any>
  showEditlink
  listcount: number[]
  followed_chapters: any
  @Input() list: List;
  public isCollapsed: boolean[] = [];
  firstItem?: string[];
  secondItem?: string[];
  thirdItem?: string[];
  modalRef?: BsModalRef;
  show_max: number | undefined = 3;
  show_max_clicked = false;
  shortlistCreated = false;


constructor(
private route: ActivatedRoute,
private listService: ListService,
private tokenStorageService: TokenStorageService,
private metaService:Meta,
private modalService: BsModalService,
private location: Location,
) { }


shortlistCreation(shortlistFinalized: boolean) {
  this.shortlistCreated = shortlistFinalized;
  // console.log("shortlist is gemaakt:")
  // console.log(this.shortlistCreated)
  // console.log("shortlist is gemaakt:")
}

goBack(): void {
  this.location.back();
}

showMax() {
  this.show_max = undefined;
  this.show_max_clicked = true
}

showMin() {
  this.show_max = 3
  this.show_max_clicked = false
}

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}

flag(id, creator) {
  this.listService.flag(id,creator).subscribe((outcome => 
    {
      this.flagged = true;
}))
}

flagComment(id, creator) {
  this.listService.flagComment(id,creator).subscribe((outcome => 
    {
      this.commentflagged = true;
}))
}


copied(event) {
  this.copy = event.isSuccess;
}

getList(): void {
const listId = this.route.snapshot.paramMap.get('listId');
console.log("het list-id = " + listId);
this.listService.getListNo404(listId)
  .subscribe((list => 
    {this.list = list; 
    const subList = this.list.sublist;
    const creator = subList.map((listEl) => listEl.subListCreator);
    const itemList = subList.map((listEl) => listEl.item);
    this.listcount = itemList.map((items) => items.length);
    this.showEditlink = creator.find(element => element === this.username);
    if (creator.length>1 && this.shortlistCreated === false){this.shortlistloading = true}
    // console.log("this.shortlistloading");
    // console.log(this.shortlistloading);
    // console.log(this.listcount);
    // console.log(this.metaService.getTag("name='description'"));
    this.loading = false
    // this.firstItem = itemList.map((item) => item[0].itemTitle );
    // this.secondItem = itemList.map((item) => item[1].itemTitle );
    // this.thirdItem = itemList.map((item) => item[2].itemTitle );
    // this.metaService.updateTag( { name:'description', content:'1. ' + this.firstItem + '  2. ' + this.secondItem + '  3. ...' },"name='description'");
    console.log(this.metaService.getTag("name='description'"));
    this.listService.getListNo404CommentCount(listId)
    .subscribe((list => 
      {this.list = list; 
      this.loading = false
      this.commentsloading = false
    })
    )
  })
  )

  
  }

  changeToClicked() {
    this.copy = true
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


ngOnInit() {
this.loading = true
this.isLoggedIn = !!this.tokenStorageService.getToken();
 this.listid  = this.route.snapshot.paramMap.get('listId');

 // dit is handig om bij SAVE enzo weer op dezelfde page uit te komen na inloggen
 this.tokenStorageService.redirectUrl = this.route.snapshot['_routerState'].url

if (this.isLoggedIn) {
  const user = this.tokenStorageService.getUser();
  this.followed_chapters = user.followed_chapters;
  this.saved_lists = this.tokenStorageService.getSavedList()
  this.username = user.username;
  this.showDropLink = true
}
console.log("de user is " + this.username)
console.log("de chapters zijn" + this.followed_chapters)
this.getList();


}}
