import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor } from '@angular/common/http';

import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';

import { List, Shortlist, Chapters, Notification } from './list';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class ListService {
  
  errorMessage?: string;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // private urlStart = 'http://192.168.86.28:5050/' 
  private urlStart = 'https://api.listdropper.com'
    
  private listUrl = this.urlStart + '/list/';  // URL to web api
  private CommentCountUrl = this.urlStart + '/listcommentcount/';  // URL to web api
  private CommentsByUserCountUrl = this.urlStart + '/commentsbyuser/';  // URL to web api
  private feedUrl = this.urlStart + '/feed/';  // URL to web api
  private savedListsUrl =  this.urlStart + '/getsavedlists/';  // URL to web api
  private shortlistUrl = this.urlStart + '/shortlist/';  // URL to web api
  private updatelistUrl  = this.urlStart + '/addsublist/';  // URL to web api
  private addSavedUrl  = this.urlStart + '/addsaved/';  // URL to web api
  private removeSavedUrl  = this.urlStart + '/removesaved/';  // URL to web api
  private followChapterUrl  = this.urlStart + '/followchapter/';  // URL to web api
  private unfollowChapterUrl  = this.urlStart + '/unfollowchapter/';  // URL to web api
  private getChaptersUrl  = this.urlStart + '/getchapters/';  // URL to web api
  private chapterlistUrl  = this.urlStart + '/chapter/';  // URL to web api
  private userlistUrl  = this.urlStart + '/profile/';  // URL to web api
  private searchUrl  = this.urlStart + '/search/';  // URL to web api
  private commentUrl  = this.urlStart + '/comment/';  // URL to web api
  private emailConfirmUrl  = this.urlStart + '/confirm_email/';  // URL to web api
  private emailResendUrl  = this.urlStart + '/resend_email/';  // URL to web api
  private requestPasswordUrl  = this.urlStart + '/request_password/';  // URL to web api
  private changePasswordUrl  = this.urlStart + '/change_password/';  // URL to web api
  private notificationUrl  = this.urlStart + '/notifications/';  // URL to web api
  private notificationCountUrl  = this.urlStart + '/notification_count/';  // URL to web api
  private notificationChangeReadUrl  = this.urlStart + '/notification/read/';  // URL to web api
  private notificationChangeUnreadUrl  = this.urlStart + '/notification/unread/';  // URL to web api
  private flagCommentUrl  = this.urlStart + '/flag/';  // URL to web api
  private flagListUrl  = this.urlStart + '/flagcomment/';  // URL to web api

  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


 /** GET notification-change from the server */
 flag (id: String | null, creator: String | null): Observable<any> {
  const url = `${this.flagListUrl}${id}${"/"}${creator}`;
  return this.http.get<any>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('flagged lists')),
    );
}

/** GET notification-change from the server */
flagComment (id: String | null, creator: String | null): Observable<any> {
  const url = `${this.flagCommentUrl}${id}${"/"}${creator}`;
  return this.http.get<any>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('flagged comments')),
    );
}


  /** GET notification-change from the server */
changeNotificationToRead (id: String | null): Observable<any> {
  const url = `${this.notificationChangeReadUrl}${id}`;
  return this.http.get<any>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('fetched lists')),
      catchError(this.handleError<Notification[]>('getNotificationsByUser', []))
    );
}


 /** GET notification-change from the server */
changeNotificationToUnread (id: String | null): Observable<any> {
  const url = `${this.notificationChangeUnreadUrl}${id}`;
  return this.http.get<any>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('fetched lists')),
      catchError(this.handleError<Notification[]>('getNotificationsByUser', []))
    );
}


  /** GET notification count from the server */
  getNotificationCount (user: String | null): Observable<number> {
    const url = `${this.notificationCountUrl}${user}`;
    return this.http.get<number>(url)
      .pipe(
        (map((data: any) => data.result )), 
        tap(_ => this.log('fetched lists')),
        catchError(this.handleError<number>('getNotificationCount' ))
      );
  }



/** GET notifications from the server */
getNotifications (user: String | null): Observable<Notification[]> {
  const url = `${this.notificationUrl}${user}`;
  return this.http.get<Notification[]>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('fetched lists')),
      catchError(this.handleError<Notification[]>('getNotificationsByUser', []))
    );
}



/** GET resendEmailValidation from the server */
resendEmailValidation (email: string): Observable<List[]> {
  const url = `${this.emailResendUrl}${email}`;
  return this.http.get<List[]>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('confirmation send')),
      // catchError(this.handleError<any>(`email confirmation for ${email}`))
    );
}

/** GET requestPasswordLink from the server */
requestPasswordLink (email: string): Observable<List[]> {
  const url = `${this.requestPasswordUrl}${email}`;
  return this.http.get<List[]>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('confirmation send')),
      // catchError(this.handleError<any>(`email confirmation for ${email}`))
    );
}


updatePassword(email: string | null, password: string | null, username: string | null, token: string | null,): Observable<any> {
  return this.http.post(this.changePasswordUrl, {
    email,
    password,
    username,
    token
  }, this.httpOptions);
}


  
/** GET checkEmailValidation from the server */
checkEmailValidation (token: string | null, email: string | null): Observable<any> {
  const url = `${this.emailConfirmUrl}${token}${"/"}${email}`;
  return this.http.get<any>(url)
    .pipe(
      map((data: any) => data), 
      tap(_ => this.log('fetched email confirmation')),
      // catchError(this.handleError<any>(`email confirmation for ${email}`))
    );
}
  


  /** GET lists from the server */
  getLists (start: number, limit: number): Observable<List[]> {
    const url = `${this.feedUrl}${start}${"/"}${limit}`;
    return this.http.get<List[]>(url)
      .pipe(
        map((data: any) => data), 
        tap(_ => this.log('fetched lists')),
        catchError(this.handleError<List[]>('getLists', []))
      );
  }

   /** GET lists from the server */
   getSavedLists (): Observable<List[]> {
    return this.http.get<List[]>(this.savedListsUrl)
      .pipe(
        map((data: any) => data), 
        tap(_ => this.log('fetched lists')),
        catchError(this.handleError<List[]>('getLists', []))
      );
  }

 /** GET lists from the server */
 getListsByChapter (chapter: string): Observable<List[]> {
  const url = `${this.chapterlistUrl}${chapter}`;
  return this.http.get<List[]>(url)
    .pipe(
      (map((data: any) => data )), 
      tap(_ => this.log('fetched lists')),
      catchError(this.handleError<List[]>('getListsByChapter', []))
    );
}



/** GET lists from the server */
getListsByUser (user: string): Observable<List[]> {
  const url = `${this.userlistUrl}${user}`;
  return this.http.get<List[]>(url)
    .pipe(
      (map((data: any) => data.result )), 
      tap(_ => this.log('fetched lists')),
      catchError(this.handleError<List[]>('getListsByUser', []))
    );
}



  /** GET list by listId. Return `undefined` when listId not found */
  getListNo404<Data>(id: string): Observable<List> { 
    const url = `${this.listUrl}${id}`;
    return this.http.get<List[]>(url)
      .pipe(
        map((data: any) => data, 
        lists => lists[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} list listId=${id}`);
        }),
        catchError(this.handleError<List>(`getList listId=${id}`))
      );
  }


  getListNo404CommentCount<Data>(id: string): Observable<List> { 
    const url = `${this.CommentCountUrl}${id}`;
    return this.http.get<List[]>(url)
      .pipe(
        map((data: any) => data, 
        lists => lists[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} list listId=${id}`);
        }),
        catchError(this.handleError<List>(`getList listId=${id}`))
      );
  }


  getCommentCountbyUser<Data>(username: string): Observable<List> { 
    const url = `${this.CommentsByUserCountUrl}${username}`;
    return this.http.get<List[]>(url)
      .pipe(
        map((data: any) => data, 
        lists => lists[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} list listId=${username}`);
        }),
        catchError(this.handleError<List>(`getList listId=${username}`))
      );
  }





  /** GET shortlist by listId. Return `undefined` when listId not found */
  getShortlist<Data>(id: string): Observable<Shortlist> { 
    const url = `${this.shortlistUrl}${id}`;
    return this.http.get<Shortlist[]>(url)
      .pipe(
        map((data: any) => data, 
        lists => lists[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} list listId=${id}`);
        }),
        catchError(this.handleError<Shortlist>(`getList listId=${id}`))
      );
  }




  /** GET list by id. Will 404 if id not found */
  getList(id: number): Observable<List> {
    const url = `${this.listUrl}/${id}`;
    return this.http.get<List>(url).pipe(
      tap(_ => this.log(`fetched list id=${id}`)),
      catchError(this.handleError<List>(`getList id=${id}`))
    );
  }








  /* GET lists whose name contains search term */
  searchLists(term: string): Observable<Shortlist[]> {
    if (!term.trim()) {
      // if not search term, return empty list array.
      return of([]);
    }
    return this.http.get<Shortlist[]>(`${this.searchUrl}${term}`).pipe(
      tap(x => x.length ?
         this.log(`found lists matching "${term}"`) :
         this.log(`no lists matching "${term}"`)),
      catchError(this.handleError<Shortlist[]>('searchLists', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new list to the server */
  dropList(list: List): Observable<List> {
    console.log(list) 
    return this.http.post<List>(this.listUrl, list, this.httpOptions)
    .pipe(
      catchError(this.handleError<List>('addList')),
      tap((list: List) => this.log(`Yes lijst gemaakt! met id=${list.listId}`))
    );
  }

  /** POST: add a new list to the server */
  editList(list: List): Observable<List> {
    console.log(list) 
    return this.http.put<List>(this.listUrl, list, this.httpOptions)
    .pipe(
      catchError(this.handleError<List>('addList')),
      tap((list: List) => this.log(`Yes lijst gemaakt! met id=${list.listId}`))
    );
  }



   /** PUT: update the list on the server */
   updateList (list: List): Observable<List> {
    const url = `${this.updatelistUrl}`;
    return this.http.put(url, list, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateList')),
      tap(_ => this.log(`updated list id=${list.id}`))
    );
  }
  

 /** POST: add a new list to the server */
 createComment(comment: Comment): Observable<Comment> {
  console.log(comment) 
  return this.http.post<Comment>(this.commentUrl, comment, this.httpOptions)
  .pipe(
    catchError(this.handleError<Comment>('addList')),
    tap((list: Comment) => this.log(`Yes comment gemaakt!`))
  );
}

getCommentsByItemId<Data>(id: string): Observable<Comment> { 
  const url = `${this.commentUrl}${id}`;
  return this.http.get<Comment[]>(url)
    .pipe(
      map((data: any) => data, 
      comments => comments[0]), // returns a {0|1} element array
      tap(h => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} list listId=${id}`);
      }),
      catchError(this.handleError<Comment>(`getList listId=${id}`))
    );
}




  addSaved(user, saved_id){
    const url = `${this.addSavedUrl}`;
    this.http.put(url,JSON.stringify({"user": user, "id": saved_id}))
        .subscribe(data => {
            if(data != null) {
                console.log("saved succesfully");
            } else {
                console.log("saved failed");
            }
        })
    }

    removeSaved(user, saved_id){
      const url = `${this.removeSavedUrl}`;
      this.http.put(url,JSON.stringify({"user": user, "id": saved_id}))
          .subscribe(data => {
              if(data != null) {
                  console.log("saved succesfully");
              } else {
                  console.log("saved failed");
              }
          })
      }

      followChapter(chapter){
        const url = `${this.followChapterUrl}`;
        this.http.put(url,JSON.stringify({"chapter": chapter}))
            .subscribe(data => {
                if(data != null) {
                    console.log("followed succesfully");
                } else {
                    console.log("follow failed");
                }
            })
        }
    
        unfollowChapter(chapter){
          const url = `${this.unfollowChapterUrl}`;
          this.http.put(url,JSON.stringify({ "chapter": chapter}))
              .subscribe(data => {
                  if(data != null) {
                      console.log("followed succesfully");
                  } else {
                      console.log("follow failed");
                  }
              })
          }
          
  
  /** GET lists from the server */
  getChapters (): Observable<Chapters[]> {
    return this.http.get<Chapters[]>(this.getChaptersUrl)
      .pipe(
        map((data: any) => data), 
        tap(_ => this.log('fetched lists')),
        catchError(this.handleError<Chapters[]>('getChapters', []))
      );
  }

  /** DELETE: delete the list from the server */
  deleteList (list: List | number): Observable<List> {
    const id = typeof list === 'number' ? list : list.id;
    const url = `${this.listUrl}/${id}`;

    return this.http.delete<List>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted list id=${id}`)),
      catchError(this.handleError<List>('deleteList'))
    );
  }

 

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ListService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ListService: ${message}`);
  }
}