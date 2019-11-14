import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'services/categories.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  constructor(private categoriesService: CategoriesService) { }
  role: String;
  categories: Array<any> = [];
  showActionItems: Boolean = false;
  products: Array<any> = [];
  routeOnId: String;
  ngOnInit() {
    this.role = localStorage.getItem('role');
    if (this.role === "admin") {
      this.showActionItems = true;
    } else {
      this.showActionItems = false;
    }
    this.getCategories()
  }
  getCategories() {
    this.categoriesService.getCategories().subscribe((res: any) => {
      console.log('sdssssssssssssssssssssssssssssssssssssssssssssssssssssss', res);
      this.categories = res.data;
      var i = 0;
      this.categories.forEach(element => {
        this.getProducts(element._id, i)
        i++
      })
    }, err => {
      console.log(err)
    })
  }

  getProducts(id, i) {
    this.categoriesService.getAllProducts({ categoryId: id }).subscribe((res: any) => {
      console.log(res.json().data);
      this.categories[i].products = res.json().data.products;
      this.products = res.json().data.products
    }, err => {
      console.log(err)
    })
  }

  roteOn(id) {
    this.routeOnId = id
  }
}
