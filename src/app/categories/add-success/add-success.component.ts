import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-success',
  templateUrl: './add-success.component.html',
  styleUrls: ['./add-success.component.css']
})
export class AddSuccessComponent implements OnInit {
  url: any;
  status :any;
  constructor(private route: ActivatedRoute, router: Router) {
    router.events.subscribe((url: any) => console.log(url));
    console.log(router.url);
    this.url = router.url;
  }

  ngOnInit() {
    console.log(this.url);
    if(this.url == '/admin/categories/updated'){
      console.log("dffdgfd");
      
      this.status ='updated'
      console.log(this.status);
      
    }
    else{
       
      this.status ='added'
      console.log(this.status);
    }
  }
}