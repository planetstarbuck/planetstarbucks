import { Component, TemplateRef, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { List, Shortlist } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from "@angular/common";


@Component({
  selector: 'app-longlist',
  templateUrl: './longlist.component.html',
  styleUrls: ['./longlist.component.css']
})
export class LonglistComponent  implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showDropLink = false;
  listid?: string;
  copy = false;
  username?: string;
  showEditlink
  loading?: boolean
  followed_chapters: any
  saved_lists: Array<string>
  public isCollapsed: boolean[] = [];
  modalRef?: BsModalRef;



  @Input() list: Shortlist;
constructor(
  private route: ActivatedRoute,
  private saveService: SaveService,
  private listService: ListService,
  private tokenStorageService: TokenStorageService,
  private modalService: BsModalService,
  private location: Location
) { }

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}

copied(event) {
  this.copy = event.isSuccess;
}

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
 
getShortlist(): void {
  const listId = this.route.snapshot.paramMap.get('listId');
  console.log("het list-id = " + listId)
  this.listService.getShortlist(listId)
    .subscribe(list => 
      {this.list = list;
      this.showEditlink = this.list.sublistCreators.find(element => element === this.username);
      this.loading = false
      });
}

getListId(): string {
const listId = this.route.snapshot.paramMap.get('listId');
return listId
}

ngOnInit() {
  this.loading = true
  this.isLoggedIn = !!this.tokenStorageService.getToken();
  this.listid  = this.route.snapshot.paramMap.get('listId');

  if (this.isLoggedIn) {
    const user = this.tokenStorageService.getUser();
    this.roles = user.roles;
    this.followed_chapters = user.followed_chapters;
    this.saved_lists = this.tokenStorageService.getSavedList();
    this.showDropLink = true;
    this.username = user.username;
}
this.getShortlist();
}
}
