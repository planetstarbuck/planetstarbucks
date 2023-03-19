import { Component, TemplateRef, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { List } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from "@angular/common";


@Component({
selector: 'app-list-details',
templateUrl: './list-details.component.html',
styleUrls: ['./list-details.component.css']
})

export class ListDetailsComponent implements OnInit {
    private roles: string[] = [];
    isLoggedIn = false;
    showDropLink = false;
    commentsloading = true
    loading?: boolean
    username?: string;
    copy = false;
    listid?: string;
    flagged = false;
    commentflagged = false;
    showEditlink;
    saved_lists: Array<string>;
    followed_chapters: any
    public isCollapsed: boolean[] = [];
    firstItem?: string[];
    secondItem?: string[];
    thirdItem?: string[];
    modalRef?: BsModalRef;
    creator?: string | null;
    listcount: number[]
    show_max: number | undefined = undefined;
    show_max_clicked = true;


    @Input() list: List;


constructor(
private route: ActivatedRoute,
private saveService: SaveService,
private listService: ListService,
private tokenStorageService: TokenStorageService,
private modalService: BsModalService,
private location: Location
) { }


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

copied(event) {
  this.copy = event.isSuccess;
}

goBack(): void {
  this.location.back();
}

getList(): void {
  const listId = this.route.snapshot.paramMap.get('listId');
  this.creator = this.route.snapshot.paramMap.get('list_creator');
  console.log("het list-id = " + listId);
  this.listService.getListNo404(listId)
    .subscribe(list => 
      {this.list = list;
        const subList = this.list.sublist;
        const listcreator = subList.map((listEl) => listEl.subListCreator);
        const itemList = subList.map((listEl) => listEl.item);
        this.listcount = itemList.map((items) => items.length);
        this.showEditlink = listcreator.find(element => element === this.username); 
        this.loading = false
        // this.firstItem = itemList.map((item) => item[0].itemTitle );
        // this.secondItem = itemList.map((item) => item[1].itemTitle );
        // this.thirdItem = itemList.map((item) => item[2].itemTitle );
        this.listService.getListNo404CommentCount(listId)
      .subscribe((list => 
        {this.list = list; 
        this.loading = false
        this.commentsloading = false
      })
      )
      this.loading = false
    },
      );


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
  
  // dit is handig om bij SAVE enzo weer op dezelfde page uit te komen na inloggen
  this.tokenStorageService.redirectUrl = this.route.snapshot['_routerState'].url

  this.getList();
  this.isLoggedIn = !!this.tokenStorageService.getToken();
   this.listid  = this.route.snapshot.paramMap.get('listId');

  if (this.isLoggedIn) {
    const user = this.tokenStorageService.getUser();
    this.username = user.username;
    this.followed_chapters = user.followed_chapters;
    this.saved_lists = this.tokenStorageService.getSavedList();
    this.showDropLink = true
}
  console.log("de user is " + this.username)


}}