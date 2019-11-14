import { Component, OnInit } from '@angular/core';
import { AboutusService } from 'services/aboutus.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private aboutusService: AboutusService) { }
  aboutUs: Array<any> = [];
  ngOnInit() {
    this.getAboutUs()
  }
  getAboutUs() {
    this.aboutusService.getAboutUs().subscribe((res: any) => {
      this.aboutUs = res.data
    }, err => {
      console.log(err);
    })
  }

}
