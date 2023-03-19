import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { ListService } from '../list.service';
import { Chapters, List } from '../list';
import { finalize } from 'rxjs/operators';
import { Device } from '@capacitor/device';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  chapters: Chapters[] = [];
  lists: List[] = [];
  comments: any;
  date_joined: any;
  username: string;
  chaptersgathered: boolean = false; 
  listsgathered: boolean = false; 
  commentsgathered: boolean = false; 


  constructor(
    private tokenStorageService: TokenStorageService,
    private listService: ListService,
) { }

unfollowChapter(chapter) {
  this.listService.unfollowChapter(chapter);
  this.tokenStorageService.removeSavedChapter(chapter);
  this.getChapters();
}

getListsByUser(): void {
  this.listService.getListsByUser(this.username).pipe(
    finalize(() =>  {this.listsgathered = true
    console.log("Lists opgehaald")}
    )
  )
  .subscribe(lists => 
    {this.lists = lists;})
  }


  getCommentsByUser(): void {
    this.listService.getCommentCountbyUser(this.username)
    .pipe(
      finalize(() =>  {this.commentsgathered = true
      console.log("Comments opgehaald")}
      )
    )
    .subscribe(comments => 
      {this.comments = comments })
    }


  getChapters(): void {
    this.listService.getChapters().pipe(
      finalize(() => {
        this.chaptersgathered = true
        console.log("Chapters opgehaald")
      }
      )
    )
      .subscribe(chapters => {
        this.chapters = chapters;
      });
    }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }


  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.date_joined = this.currentUser.joined_listdropper
    this.username = this.currentUser.username
    this.getChapters()
    this.getListsByUser()
    this.getCommentsByUser()
    const id = Device.getId();
    console.log("Devices opgehaald")
    console.log(id);  

  }
}