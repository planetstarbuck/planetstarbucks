import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe } from '@angular/common';
import { authInterceptorProviders } from './auth.interceptor';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FeedComponent } from './feed/feed.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { DropComponent } from './drop/drop.component';
import { SavedComponent } from './saved/saved.component';
import { CommonModule } from "@angular/common";
import { MessagesComponent } from './messages/messages.component';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { ShortlistComponent } from './shortlist/shortlist.component';
import { OrdinalPipe } from './ordinal.pipe';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { DropupdateComponent } from './dropupdate/dropupdate.component';
import { ChapterComponent } from './chapter/chapter.component';
import { UserComponent } from './user/user.component';
import { SearchComponent } from './search/search.component';
import { EditComponent } from './edit/edit.component';
import { DropsComponent } from './drops/drops.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { LonglistComponent } from './longlist/longlist.component';
import { ListComponent } from './list/list.component';
import { LoadingComponent } from './loading/loading.component';
import { ClickableurlsPipe } from './clickableurls.pipe';
import { CopytoclipboardDirective } from './copytoclipboard.directive';
import { DateagoPipe } from './dateago.pipe';
import { AutofocusDirective } from './autofocus.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChapterHeadingComponent } from './chapter-heading/chapter-heading.component';
import { RoutingGuardGuard } from './routing-guard.guard';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegisterAlmostDoneComponent } from './register-almost-done/register-almost-done.component';
import { RegisterCheckMailComponent } from './register-check-mail/register-check-mail.component';
import { PasswordForgotComponent } from './password-forgot/password-forgot.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';
import { MyStuffComponent } from './my-stuff/my-stuff.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NewNotificationsService } from './new-notifications.service';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { FeedShellComponent } from './feed-shell/feed-shell.component';
import { SupportComponent } from './support/support.component';
import { MarketingComponent } from './marketing/marketing.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { NgxPullToRefreshModule } from 'ngx-pull-to-refresh';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPullToRefreshModule,
    FlexLayoutModule,
    ClipboardModule,
    TypeaheadModule.forRoot(),
    RouterModule.forRoot([
    { path: '', component: FeedComponent },
    { path: 'drop/:listId', component: DropupdateComponent, canActivate: [RoutingGuardGuard] },
    { path: 'drop', component: DropComponent, canActivate: [RoutingGuardGuard]  },
    { path: 'edit/:listId', component: EditComponent, canActivate: [RoutingGuardGuard]  },
    // { path: 'item/:listId/:list_creator/:position_id', component: ItemDetailsComponent},
    { path: 'item/:listId/:list_creator/:item_id', component: ItemDetailsComponent },
    { path: 'listdetails/:listId/:list_creator', component: ListDetailsComponent },
    { path: 'longlist/:listId', component: LonglistComponent },
    { path: 'lists/:listId', component: ListComponent },
    { path: 'my-stuff', component: SavedComponent, canActivate: [RoutingGuardGuard]   },
    { path: 'my-stuff/drops', component: DropsComponent, canActivate: [RoutingGuardGuard]   },
    { path: 'my-stuff/chapters', component: ChaptersComponent, canActivate: [RoutingGuardGuard]   },
    { path: 'my-stuff/profile', component: ProfileComponent, canActivate: [RoutingGuardGuard]   },
    { path: 'my-stuff/notifications', component: NotificationsComponent, canActivate: [RoutingGuardGuard]   },
    { path: 'profile/:user', component: UserComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register/almost-done/:email/:username', component: RegisterAlmostDoneComponent },
    { path: 'register/check-mail', component: RegisterCheckMailComponent },
    { path: 'forgotpassword', component: PasswordForgotComponent },
    { path: 'changepassword/:username/:email/:token', component: PasswordUpdateComponent },
    { path: 'confirm/:email/:token', component: RegisterSuccessComponent },
    { path: 'login', component: LoginComponent },
    { path: 'chapter/:chapter', component: ChapterComponent },
    { path: 'search/:search_term', component: SearchComponent },
    { path: 'search', component: SearchComponent },
    { path: 'support', component: SupportComponent },
    { path: 'marketing', component: MarketingComponent }, 
    { path: 'privacy-policy', component: PrivacypolicyComponent }, 
], {
    initialNavigation: 'enabledNonBlocking'
}),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => getMessaging()),

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // )
  ],
  exports: [
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    FeedComponent,
    ListDetailsComponent,
    ItemDetailsComponent,
    DropComponent,
    SavedComponent,
    MessagesComponent,
    BottomBarComponent,
    ShortlistComponent,
    OrdinalPipe,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    DropupdateComponent,
    ChapterComponent,
    UserComponent,
    SearchComponent,
    EditComponent,
    DropsComponent,
    ChaptersComponent,
    LonglistComponent,
    ListComponent,
    LoadingComponent,
    ClickableurlsPipe,
    CopytoclipboardDirective,
    DateagoPipe,
    AutofocusDirective,
    ChapterHeadingComponent,
    RegisterSuccessComponent,
    RegisterAlmostDoneComponent,
    RegisterCheckMailComponent,
    PasswordForgotComponent,
    PasswordUpdateComponent,
    MyStuffComponent,
    NotificationsComponent,
    FeedShellComponent,
    SupportComponent,
    MarketingComponent,
    PrivacypolicyComponent,
  ],
  providers: [authInterceptorProviders, DatePipe, NewNotificationsService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/


