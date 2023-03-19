import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ListService } from '../list.service';
import { TokenStorageService } from '../token-storage.service';
import { Observable, Observer, tap, map, of, switchMap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Shortlist } from '../list';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Location } from "@angular/common";


@Component({
  selector: 'app-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.css']
})
export class DropComponent {
  
    search?: string;
    errorMessage?: string;
  
    @Input() list
    newList: FormGroup;
    private roles: string[] = [];
    isLoggedIn = false;
    submitted = false;
    username?: string;
    listId?: string;
    templist?: any[];
    id?: any;
    isBusy: boolean;
    lists$?: Observable<Shortlist[]>;
    suggestions$?: Observable<string[]>;
    isCollapsed: boolean = false;
    term?: string;
    titles: any
    selectedList: any;
    options: string[];


    onSelect(event: TypeaheadMatch): void {
      this.selectedList = event.item;
      console.log(this.selectedList)
      console.log(this.lists$)
      this.lists$.subscribe(list => 
        {this.list = list;
         console.log(this.list);
         const allsubLists = this.list[0].shortlist
         console.log(allsubLists);
         this.options = allsubLists.map((listEl) => listEl.itemTitle);
         console.log("de lijst-item-opties zijn: " + this.options);          
        });
    }
    



    
    constructor(
      private tokenStorageService: TokenStorageService,
      private fb: FormBuilder,
      private listService: ListService,
      private route: ActivatedRoute,
      private router: Router,
      private location: Location
    ) { }
  
  
    goBack(): void {
      this.location.back();
    }
  
  
  
    ngOnInit() {
  
      this.lists$ = new Observable((observer: Observer<string | undefined>) => {
        observer.next(this.search);
      }).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (query) {
            return this.listService.searchLists(query)
            // .pipe(
            //   map((listEl) => listEl.map( (listEl) => listEl.listTitle)) )
          }
          return of([]);
        })
      );

      this.suggestions$ = this.lists$.pipe(
        map((listEl) => listEl.map( (listEl) => listEl.listTitle)),
         ),
    

     
  
  
      this.isLoggedIn = !!this.tokenStorageService.getToken();
  
      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        this.roles = user.roles;
        // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
        this.username = user.username;
      }    
  
  
  
  
      //  --------------------- LIST CREATION ------------------------   //
  
  
      this.newList = this.fb.group({
        listTitle: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
        chapters: ['', [Validators.maxLength(25)]],
        sublist: this.fb.array([])
      })
      this.addSublist()
      this.addItem(0)
      this.addItem(0)
      this.addItem(0)
  
  
  
  
    }
  
  
  
    //  --------------------- SUBLIST CREATION ---------------------   //
  
    get sublistArray() {
      return this.newList.get('sublist') as FormArray
    }
  
    addSublist() {
      const sublistGroup = this.fb.group({
        subListCreator: this.username,
        subListHidden: false,
        item: this.fb.array([])
      })
      this.sublistArray.push(sublistGroup);
    }
  
    deleteSublist(i) {
      this.sublistArray.removeAt(i);
    }
  
  
    //  ---------------------- ITEM CREATION ------------------------   //
  
    getItemArray(index) {
      return this.sublistArray.get([index, 'item']) as FormArray;
    }
  
    addItem(index: number) {
      const itemGroup = this.fb.group({
        itemTitle: ['', [Validators.required, Validators.maxLength(100)]],
        itemContext: []
      })
  
      this.getItemArray(index).push(itemGroup);
    }
  
    deleteItem(userIndex: number, colorIndex: number) {
      this.getItemArray(userIndex).removeAt(colorIndex)
    }
  
  
  
    //  -------- SHOW COMMENTS + SET PUBLIC / PRIVATE -------   //
  
    showComments(): void {
      this.isCollapsed = !this.isCollapsed;
    }
  
    setPrivate(): void {
    console.log("setPrivate")
    this.sublistArray.controls[0].patchValue({'subListHidden': true})
  }

    setPublic(): void {
      console.log("setPublic")
      this.sublistArray.controls[0].patchValue({'subListHidden': false})
    }
  
    //  ---------------------- SWAP PLACES ------------------------   //
  
    getOnTop() {
      const extrasFormArray = this.getItemArray(0);
      this.templist = extrasFormArray.value;
      let last = this.templist.pop();
      this.templist.unshift(last);
      this.getItemArray(0).setValue(this.templist)
    }
  
  
    moveUp(index: number) {
      if (index > 0) {
        const extrasFormArray = this.getItemArray(0);
        const extras = extrasFormArray.value;
        const newExtras = this.swap(extras, index - 1, index);
        this.getItemArray(0).setValue(newExtras);
      }
    }
  
    moveDown(index: number) {
      const extrasFormArray = this.getItemArray(0);
      const extras = extrasFormArray.value;
      if (index < extras.length - 1) {
        const newExtras = this.swap(extras, index, index + 1);
        extrasFormArray.setValue(newExtras);
      }
    }
  
    swap(arr: any[], index1: number, index2: number): any[] {
      arr = [...arr];
      const temp = arr[index1];
      arr[index1] = arr[index2];
      arr[index2] = temp;
      return arr;
    }
  



    //  ----- REMOVE SELECTION FROM TYPEAHEAD OPTIONS -----   //


    onSelectItem(event: TypeaheadMatch): void {
      this.options = this.options.filter(obj => {return obj !== event.item});
    }


    //  ---------------------- SUBMISSION! ------------------------   //
  
    onSubmit() {
      this.submitted = true;
      if (this.newList.invalid) {
        return;
      }
      this.isBusy = true
      this.listService.dropList(this.newList.value)
        .subscribe(list => {
          console.log(list)
          this.id = list._id
          this.id = this.id.$oid
          console.log(this.id)
          this.router.navigate(['lists/', this.id], { skipLocationChange: true });
          this.isBusy = false
        })
    }
  
  }
  