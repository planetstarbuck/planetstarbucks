import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ListService } from '../list.service';
import { TokenStorageService } from '../token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';



@Component({
  template: '',
  selector: 'app-dropupdate',
  templateUrl: './dropupdate.component.html',
  styleUrls: ['./dropupdate.component.css']
})
export class DropupdateComponent {

  @Input() list
  newList: FormGroup;
  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;
  id?: any;
  isBusy: boolean;
  submitted = false;
  startup: boolean;
  options: string[];
  isCollapsed: boolean = false;
  templist: any[];
  list_id: string | null;


  
   constructor(
      private tokenStorageService: TokenStorageService,
      private fb: FormBuilder,
      private listService: ListService,
      private route: ActivatedRoute,
      private router: Router
    ) { }
  
   ngOnInit() {
  
      this.isLoggedIn = !!this.tokenStorageService.getToken();
  
      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        this.roles = user.roles;
        this.username = user.username;
      }
  
      this.list_id = this.route.snapshot.paramMap.get('listId');


  //  --------------------- LIST CREATION ------------------------   //
  

     this.newList = this.fb.group({
       listTitle: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
       id:  '',
       chapters: ['', [Validators.maxLength(25)]],
       sublist: this.fb.array([])
     })
    this.addSublist()
    this.addItem(0)
    this.addItem(0)
    this.addItem(0)
    this.prefillList();

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

    getOnTop(){
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
  


   
  //  -------------- GET LIST TITLE FROM URL ------------------   //
  

  prefillList(): void {
    const listId = this.route.snapshot.paramMap.get('listId');
    this.listService.getListNo404(listId)
          .subscribe(list=> {
           this.list = list;

            //  maak sublist om hierna te kunnen checken op user-match // 
           const sublist = this.list.sublist
            // maak een result op basis van de user match //
           const result = sublist.filter(({subListCreator}) => subListCreator.includes(this.username));
            // als de user match er is, dan redirecten naar het edit component zodat je niet per ongeluk je bestaande lijst overschrijft
           if(result.length){
            this.router.navigateByUrl(this.router.parseUrl('/edit/' + listId))
           }
           
           this.newList.patchValue({
            listTitle: this.list.listTitle,
            id: this.route.snapshot.paramMap.get('listId'),
           });     
           this.startup = true
         }
       );

      //  this.listService.getShortlist(listId)
      //  .subscribe(list => 
      //    {this.list = list;
      //     console.log(this.list);
      //     const allsubLists = this.list.shortlistItem.map(itemTitle => itemTitle);
      //     this.options = allsubLists.map((listEl) => listEl.itemTitle);
      //     console.log("de lijst-item-opties zijn: " + this.options);          
      //    });

      this.listService.getShortlist(listId).subscribe(list => {
        this.list = list;
        console.log(this.list);
        const filteredShortlistItems = this.list.shortlistItem.filter(item => {
            // Filter out items that have comments created by the specific username
            const commentsCreatedByUser = item.itemComment.filter(comment => {
                return comment.itemCommentCreator === this.username;
            });
            return commentsCreatedByUser.length === 0;
        });
        const allsubLists = filteredShortlistItems.map(itemTitle => itemTitle);
        this.options = allsubLists.map((listEl) => listEl.itemTitle);
        // console.log("de lijst-item-opties zijn: " + this.options);                      
    });

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
  this.isBusy=true
  this.listService.updateList(this.newList.value)
    .subscribe(list => {
      console.log(list)
      const listId = this.route.snapshot.paramMap.get('listId');
      this.router.navigate(['lists/', listId], { skipLocationChange: true })
    }
  )

}

  }

