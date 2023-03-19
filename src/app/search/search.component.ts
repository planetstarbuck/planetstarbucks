import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { ListService } from '../list.service';
import { Shortlist } from '../list';
import { TokenStorageService } from '../token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';


import {
   debounceTime, distinctUntilChanged, switchMap, tap, startWith
 } from 'rxjs/operators';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  lists$!: Observable<Shortlist[]>;
  private roles: string = '';
  isLoggedIn = false;
  loading = false;
  term?: string|undefined ='';
  username?: string;
  saved_lists: Array<string>;
  private searchTerms = new Subject<string|undefined>();

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private router: Router
    ) {}

  // Push a search term into the observable stream.
  search(term: string|undefined): void {
    this.searchTerms.next(term);
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

  
  ngOnInit(): void {
    
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { searchterm: "popular" }
        if(params){this.term = params.searchterm;}
        if(params.searchterm===undefined){this.term = '';}
        console.log(this.term); // popular
      }
    );


    // dit is handig om bij SAVE enzo weer op dezelfde page uit te komen na inloggen
    this.tokenStorageService.redirectUrl = this.route.snapshot['_routerState'].url

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.saved_lists = this.tokenStorageService.getSavedList()
    }

    this.lists$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      startWith(this.term),

      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      tap(() => (this.loading = true)),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.listService.searchLists(term)),
      
      tap(() => (
        this.loading = false
        
        
        ,
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            searchterm: this.term
          },
          // preserve the existing query params in the route
          // do not trigger navigation
        })

        )),


    );
  }
}