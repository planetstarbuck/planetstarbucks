import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { ListService } from '../list.service';
import { Chapters } from '../list';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent implements OnInit {
  currentUser: any;
  chapters: Chapters[] = [];
  loading?: boolean

  constructor(
    private tokenStorageService: TokenStorageService,
    private listService: ListService,
) { }

unfollowChapter(chapter) {
  this.listService.unfollowChapter(chapter);
  this.tokenStorageService.removeSavedChapter(chapter);
  this.getChapters();
}



  getChapters(): void {
    this.listService.getChapters()
      .subscribe(chapters => {
        this.chapters = chapters;
        this.loading = false
      });
      console.log("Chapters opgehaald" + this.chapters)
    }


  ngOnInit(): void {
    this.loading = true
    this.currentUser = this.tokenStorageService.getUser();
    this.getChapters()
  }
}