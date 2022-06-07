import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe( (isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated
    });
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
