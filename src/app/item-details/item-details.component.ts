import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../list.service';
import { SaveService } from '../../save.service';
import { Item, List } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { FormArray, FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";


@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})




export class ItemDetailsComponent implements OnInit {
    private roles: string[] = [];
    isLoggedIn = false;
    showDropLink = false;
    loading?: boolean
    username?: string;
    copy?: boolean;
    listid?: string;
    saved_lists: Array<string>;
    followed_chapters: any
    public isCollapsed: boolean = true;
    position: any
    newComment: FormGroup;
    item: any
    commentId: any
    isBusy: boolean;
    @Input() list: List;
    comment: Comment;
    position_id: number
    listcount: number[]

constructor(
private route: ActivatedRoute,
private saveService: SaveService,
private listService: ListService,
private tokenStorageService: TokenStorageService,
private fb: FormBuilder,
private location: Location
) { }


copyToClipboard(item) {
  navigator.clipboard.writeText(item)
  this.copy = true
}

goBack(): void {
  this.location.back();
}

getList(): void {
  const listId = this.route.snapshot.paramMap.get('listId');
  const creator = this.route.snapshot.paramMap.get('list_creator');
  this.commentId = this.route.snapshot.paramMap.get('item_id');
  // this.position_id = +this.route.snapshot.paramMap.get('position_id');
  console.log("het list-id = " + listId);
  this.listService.getListNo404(listId)
    .subscribe(list => 
      {this.list = list;
        const subList = this.list.sublist;
        const itemList = subList.map((listEl) => listEl.item);
        this.listcount = itemList.map((items) => items.length);
        console.log(this.listcount);
        this.list.sublist = this.list.sublist.filter(sublist => sublist.subListCreator.includes(creator));
        const sublist =  this.list.sublist
        console.log(sublist)
        // console.log(typeof(this.position_id))
      // this.position_id =  this.position_id + 1
      // console.log("het position id is " + this.position_id)
        this.item = sublist[0].item.find(item => {
         return this.commentId == item.commentId
       })
      // console.log(this.item)
      // // this.commentId = this.item.commentId.$uuid
      // this.commentId = this.item.commentId
      console.log(this.commentId)
      console.log("het comment id is" + this.commentId)
    
      this.listService.getCommentsByItemId(this.commentId)
    .subscribe((comment => 
      {this.comment = comment; 
    })
    )
    if (this.isLoggedIn) {
      this.newComment.patchValue({
        itemCommentId: this.commentId
    })}
      this.loading = false
    },
      )

      ;
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

  this.isLoggedIn = !!this.tokenStorageService.getToken();
  this.listid  = this.route.snapshot.paramMap.get('listId');
  // this.position = this.route.snapshot.paramMap.get('position_id');

  if (this.isLoggedIn) {
    const user = this.tokenStorageService.getUser();
    // this.roles = user.roles;
    this.username = user.username;
    this.followed_chapters = user.followed_chapters;
    this.saved_lists = this.tokenStorageService.getSavedList();
    this.showDropLink = true

    this.newComment = this.fb.group({
      itemCommentId: '',
      commentContent: '',
      
    })



}
this.getList();

  console.log("de user is " + this.username)
  

}





onSubmit() {
  this.isBusy=true
  this.listService.createComment(this.newComment.value)      
      .subscribe(comment => {
      console.log(comment)
      window.location.reload()
    })      
}



}







