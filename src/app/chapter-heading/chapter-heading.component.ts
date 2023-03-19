import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { List } from '../list';

@Component({
  selector: 'app-chapter-heading',
  templateUrl: './chapter-heading.component.html',
  styleUrls: ['./chapter-heading.component.css']
})
export class ChapterHeadingComponent implements OnInit {
  @Input() list: List;
  @Input() showDropLink = false;
  @Input() followed_chapters: any;
  @Output() unfollowChapterEvent = new EventEmitter<string>();
  @Output() followChapterEvent = new EventEmitter<string>();


  unfollowChapter(value: string) {
    this.unfollowChapterEvent.emit(value);
  }

  followChapter(value: string) {
    this.followChapterEvent.emit(value);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
