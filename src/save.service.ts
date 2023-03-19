import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveService {
  savedlists = [];

  addToSaved(list) {
    this.savedlists.push(list);
  }

  getSavedLists() {
    return this.savedlists;
  }

  deleteAll() {
    this.savedlists = [];
    return this.savedlists;
  }
  constructor() { }
}
