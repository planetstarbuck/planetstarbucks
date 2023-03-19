import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.localStorage.clear();
  }

    redirectUrl: string | null = null;


  public removeSavedChapter(savedToRemove: any): void {
    console.log(savedToRemove)
    const user = this.getUser();
    let new_followed_chapters: Array<string>= user.followed_chapters.replaceAll(' ', '').replaceAll('\'', '').replaceAll(']', '').replaceAll('[', '').replaceAll('"', '').split(',').map(String);
    var removeIndex = new_followed_chapters.indexOf(savedToRemove);
    console.log(removeIndex);
    console.log(new_followed_chapters.splice(removeIndex, 1));
    console.log(new_followed_chapters);
    user.followed_chapters = new_followed_chapters.toString()
    console.log(user);
    this.saveUser(user);
  }

  public addSavedChapter(addToSaved: any): void {
    console.log(addToSaved)
    const user = this.getUser();
    console.log(typeof user.followed_chapters);
    let new_followed_chapters: Array<string>= user.followed_chapters.replaceAll(' ', '').replaceAll('\'', '').replaceAll(']', '').replaceAll('[', '').replaceAll('"', '').split(',').map(String);
    console.log(new_followed_chapters.length);
    console.log(typeof new_followed_chapters);
    new_followed_chapters.push(addToSaved)
    console.log(new_followed_chapters);
    user.followed_chapters = new_followed_chapters.toString()
    console.log(user);
    this.saveUser(user);
  }


  public getSavedList(): Array<string> {
    const user = this.getUser();
    let new_saved_lists: Array<string>= user.saved_lists.replaceAll('ObjectId(', '').replaceAll('\'', '').replaceAll(']', '').replaceAll('[', '').replaceAll('"', '').replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').split(',').map(String);
    console.log(new_saved_lists);
    return new_saved_lists
  }

  public addSavedList(addToSaved: any): void {
    console.log(addToSaved)
    const user = this.getUser();
    let new_saved_lists: Array<string>= user.saved_lists.replaceAll('ObjectId(', '').replaceAll('\'', '').replaceAll(']', '').replaceAll('[', '').replaceAll('"', '').replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').split(',').map(String);
    new_saved_lists.push(addToSaved)
    console.log(new_saved_lists);
    user.saved_lists = new_saved_lists.toString()
    console.log(user);
    this.saveUser(user);
  }

  public removeSavedList(removeFromSaved: any): void {
    console.log(removeFromSaved)
    const user = this.getUser();
    let new_saved_lists: Array<string>= user.saved_lists.replaceAll('ObjectId(', '').replaceAll('\'', '').replaceAll(']', '').replaceAll('[', '').replaceAll('"', '').replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').split(',').map(String);
    var removeIndex = new_saved_lists.indexOf(removeFromSaved);
    console.log(new_saved_lists.splice(removeIndex, 1));
    console.log(new_saved_lists);
    user.saved_lists = new_saved_lists.toString()
    console.log(user);
    this.saveUser(user);
  }

  


  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}