import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { List } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { BehaviorSubject, forkJoin, fromEvent, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';

// import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  private roles: string = '';
  isLoggedIn = false;
  public isFollowedCollapsed: boolean[] = [];
  public isUnfollowedCollapsed: boolean[] = [];
  username?: string;
  startup: boolean;
  loading: boolean;
  saved_lists: Array<string>

  currentPage: number = 0;
  pageSize: number = 10;
  listArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  lists$: Observable<any> = this.listArray.asObservable();

  lists: List[] = [];


  doRefresh(event) {
    setTimeout(() => {
      this.getLists();
      event.target.complete();
    }, 2000);
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

  getLists(): void {

    this.listService.getLists(this.currentPage, this.pageSize)
    .subscribe((data: any) => {
      this.listArray.next(data);
      this.startup = true
    });
    const content = document.querySelector('.lists');
    const scroll$ = fromEvent(content!, 'scroll').pipe(map(() => { return content!.scrollTop; }));
    scroll$.subscribe((scrollPos) => {
      let limit = content!.scrollHeight - content!.clientHeight;
      if (scrollPos > limit) {
       this.loading = true
        this.currentPage += this.pageSize;
        forkJoin([this.lists$.pipe(take(1)), this.listService.getLists(this.currentPage, this.pageSize)]).subscribe((data: Array<Array<any>>) => {
          const newArr = [...data[0], ...data[1]];
          this.listArray.next(newArr);
          this.loading = false;
        }
        )
      }  
    }
    );
    }
      // lists =>  this.lists = lists


  ngOnInit() { 
    this.getLists();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    // dit is handig om bij SAVE enzo weer op dezelfde page uit te komen na inloggen
    this.tokenStorageService.redirectUrl = this.route.snapshot['_routerState'].url

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.saved_lists = this.tokenStorageService.getSavedList()
      console.log(this.saved_lists)
    }
  }


  constructor(
    private route: ActivatedRoute,
    private listService: ListService,
    private tokenStorageService: TokenStorageService
  ) { }
}
