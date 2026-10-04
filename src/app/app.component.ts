import { Component, OnInit } from '@angular/core';
import { FirebaseNotificationsService } from './notifications/firebase-notifications.service';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RouterExtensions } from '@nativescript/angular';

@Component({ selector: 'ns-app', templateUrl: './app.component.html', standalone: false })
export class AppComponent implements OnInit {
  constructor(private router: RouterExtensions, public notifications: FirebaseNotificationsService) {}
  ngOnInit(): void { void this.notifications.start(); }
  abrir(): void {
    this.router.navigate(['/alumnos']);
    (Application.getRootView() as RadSideDrawer).closeDrawer();
  }
}
