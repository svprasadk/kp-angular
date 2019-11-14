import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductAttributeService } from 'services/product-attributes.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationPopupComponent } from 'shared/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material';
import { PopupService } from 'services/popup.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  isDisabled: Boolean = true;
  toggle = {};
  showAccordion: boolean = false;

  constructor(private route: ActivatedRoute,
    private productAttributeService: ProductAttributeService,
    private router: Router,
    public sanitizer: DomSanitizer,
    private popupService: PopupService,
    private dialog: MatDialog) { }
  id: string;
  productAttributesDetail: Array<any> = [];
  productDetail: any = {
    productName: '',
    imageUrl: '',
    description: ''
  }
  text: string = '';
  mainHeadingId: string = ''
  subheaded: any = [];
  indexExpanded: number = -1;
  role: String;
  showActionItems: Boolean = false;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(" Page ", this.id);

      if (this.id) {
        console.log("eeeeeeeeeeeeeeeeeeee ", this.id);
        // this.loadingBarService.show()
        this.getProductDetails(this.id);
        this.getAttributesofProduct(this.id);
      }
    });
    this.role = localStorage.getItem('role');
    if (this.role === "admin") {
      this.showActionItems = true;
    } else {
      this.showActionItems = false;
    }
  }
  getYouTubeUrlSanatize(id) {
    console.log(id)
    var uri = "https://www.youtube.com/embed/" + id
    return this.sanitizer.bypassSecurityTrustResourceUrl(uri)
  }
  // getSatnetize(url) {
  //   console.log(url)
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }
  getProductDetails(id) {
    this.productAttributeService.getProductDetails(id).subscribe((res: any) => {
      console.log(res);
      var productData = res.data;
      this.productDetail = productData

    }, err => {
      console.log(err)
    })
  }

  getAttributesofProduct(id) {
    this.productAttributeService.getAttributesofProduct(id).subscribe((res: any) => {
      console.log(res);
      if (res.data && res.data.data) {
        var productData = res.data.data;
        this.productAttributesDetail = productData
      }


    }, err => {
      console.log(err)
    })
  }

  openSubHead(event, i, j, id) {
    // event.stopPropagation();
    this.subheaded = [];
    console.log(event, i, j, id);
    this.productAttributeService.getsubAttributesofProduct(id).subscribe((res: any) => {
      console.log(res);
      this.productAttributesDetail[i].subHeadingData[j].url = res.data
      // this.subheaded = res.data
      console.log(this.productAttributesDetail[i].subHeadingData[j].url);
      // this.indexExpanded = i + j == this.indexExpanded ? -1 : j;

    }, err => {
      console.log(err)
    })
  }

  Edithead(data) {
    // event.stopPropagation();
    console.log(data)
    this.router.navigate(['/admin/products/edit-attribute/' + data.productId._id + '/' + data._id])
  }
  openDialog(type, data): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        if (type == "heading") {
          this.deleteHeadingApi(data)
        }
      }

    });
  }
  deletehead(data) {
    this.text = "Are you sure you want to delete this Attribute"
    this.openDialog('heading', data)
  }

  expandAttribute(data){
    if(data._id === this.mainHeadingId)
    {
      this.mainHeadingId = ''
    }else{
      this.mainHeadingId = data._id
    }
  }

  deleteHeadingApi(data) {
    this.productAttributeService.deleteHeading(data._id).subscribe((res: any) => {
      console.log(res);
      this.popupService.show(res.message);
      this.ngOnInit();
    }, err => {
      console.log(err);
      this.popupService.showServerError(err.error.message)
    })
  }
  getWithBr(str) {
    str = str.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return str;
  }
  openDiv() {
    this.showAccordion = !this.showAccordion;
    console.log('hiii')
  }
}
