import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'MqttTraceLog';
  public isDarkMode: boolean = false;

  constructor(private cookieService: CookieService)
  {
    this.isDarkMode = this.cookieService.get('MqttTraceLog.isDarkMode') == 'TRUE';
    if(this.isDarkMode)
      document.body.classList.add('darkMode');
    else
      document.body.classList.remove('darkMode');
  }

  public SetToogleMode()
  {
    if(this.isDarkMode)
      document.body.classList.remove('darkMode');
    else
      document.body.classList.add('darkMode');
    this.isDarkMode = !this.isDarkMode;
    const expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 1);
    this.cookieService.set('MqttTraceLog.isDarkMode', this.isDarkMode ? 'TRUE' : 'FALSE', expiration);
  }
}
