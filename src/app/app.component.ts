import { Component } from '@angular/core';
import { LoadingbarService } from 'services/loading-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(public loadingbarService: LoadingbarService) {

  }
}
