import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from 'services/products.service';
import { Form } from '@angular/forms';
import { ConfirmationPopupComponent } from 'shared/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from 'services/popup.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @ViewChild('f') subForm: HTMLFormElement;
  f: Form;
  constructor(private productsService: ProductsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private router: Router) { }
  productnotAdded: boolean = true;
  imgsrc: string = '';
  categories: Array<any> = [];
  text: string = '';
  width: number;
  height: number;
  imageError: boolean = false;
  formSubmitAttempt: boolean = false;
  //form start
  category: string = ''
  productDescription: string = '';
  productTitle: string = '';
  file: FormData;
  productImageKey: string;
  productImageKeyMobile:String;
  id: string;

  fileMobile:FormData;
  imageErrorMobile:boolean=false;
  imgsrcMobile:string="";
  widthMobile:number;
  heightMobile:number;

  //end
  ngOnInit() {
    this.getAllCategories();

    this.route.params.subscribe((params) => {
      this.id = params['id'];
      if (params['categoryId']) {
        this.category = params['categoryId']

      }
      console.log("Add Page ", this.id);

      if (this.id) {
        console.log("eeeeeeeeeeeeeeeeeeee ", this.id);
        // this.loadingBarService.show()
        this.getProductDetails(this.id)

      }
    });

  }

  getProductDetails(id) {
    this.productsService.getProductDetails(id).subscribe((res: any) => {
      console.log(res);
      var productData = res.data;
      this.category = productData.categoryId._id;
      this.productDescription = productData.description;
      this.productTitle = productData.productName;
      this.imgsrc = productData.imageUrl;
      this.productImageKey = productData.productImageKey;
      this.productImageKeyMobile=productData.productImageKeyMobile;
      this.imgsrcMobile = productData.imageMobileUrl;

    }, err => {
      console.log(err)
    })
  }
  getAllCategories() {
    this.productsService.getAllCategories().subscribe((res: any) => {
      console.log(res)
      this.categories = res.data;
    }, err => {
      console.log(err)
    })
  }
  fileUpload(e) {
    console.log(e)
    let files = e.target.files;
    let image = e.target.files[0]
    this.file = new FormData();
    this.file.append('productImage', image);
    console.log(this.file, image)
    // if (files) {
    //   for (let file of files) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      var img:any = new Image();
      img.onload = () => {
        this.width = img.width;
        this.height = img.height;
        // console.log(this.width, this.height);
        if (this.width == 750 && this.height == 300) {
          this.imgsrc = e.target.result;
          this.imageError = false

        } else {
          this.imageError = true
        }
      };

      img.src = reader.result;

    }
    reader.readAsDataURL(files[0]);
    //   }
    // }
  }


  fileUpload2(e){
    console.log(e)
    let files = e.target.files;
    let image = e.target.files[0]
    this.fileMobile = new FormData();
    this.fileMobile.append('productImage', image);
    console.log(this.fileMobile, image)
    // if (files) {
    //   for (let file of files) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      var img:any = new Image();
      img.onload = () => {
        this.widthMobile = img.width;
        this.heightMobile = img.height;
       console.log(this.widthMobile, this.heightMobile);
        if (this.widthMobile == 750 && this.heightMobile == 300) {
          this.imgsrcMobile = e.target.result;
          // this.imageErrorMobile = false

        } else {
          // this.imageErrorMobile = true
        }
      };

      img.src = reader.result;

    }
    reader.readAsDataURL(files[0]);
    //   }
  }



  addProduct() {
    this.formSubmitAttempt = true;
    var data = this.file;
    console.log(this.fileMobile)
    if (this.subForm.form.valid && this.file ) {
      this.productsService.uploadImage(data).subscribe((res: any) => {
        console.log(res);
        this.productImageKey = res.productImageKey;

        if(this.fileMobile){
          this.productsService.uploadImage(this.fileMobile).subscribe((res: any) => {
            console.log(res);
            this.productImageKeyMobile = res.productImageKey;
            this.addProductWithImage()
          },err=>{
            console.log(err)
          })
        }else{
          this.addProductWithImage()
        }
        

      }, err => {
        console.log(err);
      })
    } else if(this.subForm.form.valid && this.fileMobile ){
      this.productsService.uploadImage(this.fileMobile).subscribe((res: any) => {
        console.log(res);
        this.productImageKeyMobile = res.productImageKey;
        this.addProductWithImage()
      },err=>{
        console.log(err)
      })
    }
    
    
    else if (this.subForm.form.valid && this.id) {
      
      this.addProductWithImage()
    }



  }
  addProductWithImage() {
    var data: any = {
      "productName": this.productTitle,
      "productImageKey": this.productImageKey,
      "description": this.productDescription,
      "categoryId": this.category,
      productImageKeyMobile:this.productImageKeyMobile
    }
    if (this.id) {
      data.id = this.id;
      this.productsService.updateProduct(data).subscribe((res: any) => {
        console.log(res);
        this.popupService.show('Product updated successfully');

        this.clearForm();
        this.router.navigate(["/admin/products"])
        this.productnotAdded = false;

      }, err => {
        console.log(err);
      })
    } else {
      this.productsService.addProduct(data).subscribe((res: any) => {
        console.log(res);
        this.id = res.data._id
        this.popupService.show('Product added successfully')

        this.clearForm();
        this.productnotAdded = false;

      }, err => {
        console.log(err);
      })
    }

  }

  addNewProduct() {
    this.productnotAdded = true;
    this.id = ''

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
        if (data == "cancelProduct") {
          this.clearForm()
        }
      }

    });
  }
  cancelProduct() {
    if (this.id) {
      this.router.navigate(["/admin/products"])
    } else {
      this.text = "Are you sure you want to cancel?"
      this.openDialog('cancelProduct')
    }

  }

  clearForm() {
    this.category = '';
    this.productDescription = '';
    this.productTitle = '';
    this.imgsrc = "";
    this.imgsrcMobile=""
    this.width = null;
    this.widthMobile=null;
    this.height = null;
    this.heightMobile=null;

    this.imageError = false;
    this.imageErrorMobile = false;

    this.formSubmitAttempt = false;

    // this.subForm.form.controls['category'].markAsUntouched();
    // this.subForm.form.controls['category'].setErrors(null);
    // this.subForm.form.controls['category'].markAsUntouched();
    // this.subForm.form.controls['category'].setErrors(null);
    this.subForm.form.markAsPristine();
    this.subForm.form.markAsUntouched();
    this.subForm.form.updateValueAndValidity();
  }

}
