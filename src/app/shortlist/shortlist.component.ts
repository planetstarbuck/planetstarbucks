import { Component, TemplateRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { List, Shortlist } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-shortlist',
  templateUrl: './shortlist.component.html',
  styleUrls: ['./shortlist.component.css']
})
export class ShortlistComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showDropLink = false;
  listid?: string | null;
  copy = false;
  show_max: number | undefined = 3;
  show_max_clicked = false
  username?: string;
  saved_lists: Array<string>
  showEditlink
  listcount : number;
  loading?: boolean
  followed_chapters: any
  public isCollapsed: boolean[] = [];
  modalRef?: BsModalRef;
  @Input() shortlistloading = false;
  @Output() shortlistFinalized = new EventEmitter<boolean>();



 list: Shortlist;
constructor(
  private route: ActivatedRoute,
  private saveService: SaveService,
  private listService: ListService,
  private tokenStorageService: TokenStorageService,
  private modalService: BsModalService
) { }


openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}

copied(event) {
  this.copy = event.isSuccess;

}

showMax() {
  this.show_max = undefined;
  this.show_max_clicked = true
}

showMin() {
  this.show_max = 3
  this.show_max_clicked = false
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
  this.listService.getShortlist(listId)
  .pipe(
    //Finalize to always unlock UI no matter what. 
    finalize(() =>  this.shortlistloading = false
    ) 
).subscribe(list => 
      {this.list = list;
      this.showEditlink = this.list.sublistCreators.find(element => element === this.username);
      this.listcount = this.list.shortlistItem.length;
      this.loading = false
      this.shortlistloading = false
      this.shortlistFinalized.emit(true);
      });
}

getListId(): string {
const listId = this.route.snapshot.paramMap.get('listId');
return listId
}


ngOnInit() {
  this.loading = true

  // dit is handig om bij SAVE enzo weer op dezelfde page uit te komen na inloggen
  this.tokenStorageService.redirectUrl = this.route.snapshot['_routerState'].url
  
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



