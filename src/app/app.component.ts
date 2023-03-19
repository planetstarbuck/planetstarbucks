import { Component, NgZone} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'listdropper';
  showBottomBar = false

constructor(private router:Router, private zone: NgZone
  ) {
    this.initializeApp();
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
          this.showBottomBar = event.url !== "/";
      }});
    }

  // checkCanOpenUrl()  {
  //     const value  =  AppLauncher.canOpenUrl({ url: 'com.listdropper.app' });
  //     console.log('Can open url: ', value);
  //   };
    


  initializeApp() {
    // this.checkCanOpenUrl() 
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
            const domain = 'listdropper.com';
            const pathArray = event.url.split(domain);
            // The pathArray is now like ['https://devdactic.com', '/details/42']
    
            // Get the last element with pop()
            const appPath = pathArray.pop();
            if (appPath) {
              this.router.navigateByUrl(appPath);
            }
    
            // const slug = event.url.split(".app").pop();
            // if (slug) {
            //     this.router.navigateByUrl(slug);
            // }
            // // If no match, do nothing - let regular routing
            // // logic take over

        });
    });
}
}