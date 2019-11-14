import { Component, OnInit } from '@angular/core';
import { ConfirmationPopupComponent } from 'shared/confirmation-popup/confirmation-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductsService } from 'services/products.service';
import { PopupService } from 'services/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  text: string = '';
  note: string = '';
  category: string = '';

  categories: Array<any> = [];
  products: Array<any> = [];

  length: number = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  pageNo = 1;
  pageEvent: PageEvent;
  categoryImg:String;
  constructor(public dialog: MatDialog,
    private productsService: ProductsService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private router: Router) { }
  // products: Array<any> = [1, 2, 3]
  role: String;
  showActionItems: Boolean = false;
  ngOnInit() {
    this.pageNo = 1;
    this.role = localStorage.getItem('role');
    if (this.role === "admin") {
      this.showActionItems = true;
    } else {
      this.showActionItems = false;
    }

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.category = params['id'];
        this.getAllCategories();
        this.getAllProducts();
      } else {
        this.getAllCategories();
        this.getAllProducts();
      }

    });

  }

  getAllCategories() {
    this.productsService.getAllCategories().subscribe((res: any) => {
      console.log(res);

      this.categories = res.data;
      if(res.data && res.data.length){
        this.categories.forEach(ele=>{
          if(ele._id==this.category){
            if(ele.imageUrl)
            this.categoryImg=ele.imageUrl
          }
        })
      }
     

    }, err => {
      console.log(err)
    })
  }
  getProductsOfCategory() {
    if (this.showActionItems) {
      this.router.navigate(['/admin/products/' + this.category])

    } else {
      this.router.navigate(['/user/products/' + this.category])

    }
  }
  getAllProducts() {
    var data = {
      categoryId: this.category,
      size: this.pageSize,
      page: this.pageNo
    }
    this.productsService.getAllProducts(data).subscribe((res: any) => {
      console.log(res);
      this.length = res.data.count;
      this.products = res.data.products;
    }, err => {
      console.log(err)
    })
  }

  publish(id, attributePresent) {
    if (attributePresent) {
      this.text = "Are you sure you want to publish the product?"

      this.openDialog('publish', id);
    } else {
      this.text = "Would you like to add attributes to this product before publishing?"

      this.openWithOutPublishDialog('withOutpublish', id);
    }

  }
  unPublish(id) {
    this.text = "Are you sure you want to unpublish the product?"

    this.openDialog('unpublish', id);
  }
  // Author: Sateesh, Date: 14 / 03 / 2019
  // publishing product without attributes confirmation
  openWithOutPublishDialog(data, id) {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == true) {

        if (data == "withOutpublish") {
          this.router.navigate(['/admin/products/add-attribute/' + id])

        }

      } else if (result == false) {
        this.publishOrUnpublish(id, true)
      }

    });
  }
  openDialog(data, id): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        if (data == "publish") {
          this.publishOrUnpublish(id, true)
        }
        if (data == "unpublish") {
          this.publishOrUnpublish(id, false)

        }
        if (data == "deleteProduct") {
          this.deleteProductConfirmed(id)

        }

      }

    });
  }

  publishOrUnpublish(id, publish) {
    this.productsService.publishUnpublish(id, publish).subscribe((res: any) => {
      console.log(res)
      if (publish) {
        this.popupService.show('Successfully Published the product')
      } else {
        this.popupService.show('Successfully Unpublished the product')

      }
      this.getAllProducts()
    }, err => {
      console.log(err)
    })
  }


  deleteProducts(id) {
    this.text = "Are you sure you want to delete this product"

    this.openDialog('deleteProduct', id)
  }

  deleteProductConfirmed(id) {
    this.productsService.deleteProduct(id).subscribe((res: any) => {
      console.log(res)
      this.getAllProducts()
    }, err => {
      console.log(err)
    })
  }

  categoryChanged() {

  }
  pageChangeEvent(event) {
    console.log(event);
    this.length = event.length;
    this.pageSize = event.pageSize
    this.pageNo = event.pageIndex + 1;
    this.getAllProducts();
  }

}
