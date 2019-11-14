import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'services/categories.service';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from 'shared/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sales-person',
  templateUrl: './sales-person.component.html',
  styleUrls: ['./sales-person.component.css']
})
export class SalesPersonComponent implements OnInit {
  role: String;
  categories: Array<any> = [];
  text: String;
  empName : any;
  userId : any;
  constructor(private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private router: Router) { }
  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.userId = localStorage.getItem('id')
    this.empName = localStorage.getItem('firstName')
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
      // this.products = res.json().data.products
    }, err => {
      console.log(err)
    })
  }


  // onLogout() {
  //   localStorage.clear();
  //   this.router.navigate(['/login']);
  // }

  onLogout() {
    this.text = "Are you sure you want to Logout?"
    this.openDialog('logout');
  }
  openDialog(data): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        if (data == 'logout') {
          this.oLogout()
        }
      }

    });
  }
  oLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
