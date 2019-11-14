import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { LoadingbarService } from '../../services/loading-bar.service';
import { PopupService } from '../../services/popup.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.css']
})
export class AddCategorieComponent implements OnInit {
  id: any;
  url: any;
  mobileUrl:any;
  routerUrl: any;
  isValid: boolean = false;
  isMobileValid:boolean=false;
  isInputCategory: boolean = false;
  width: any;
  mobileWidth:any;
  mobileHeight:any;
  height: any;
  imgFormData: any;
  mobileimgFormData:any;
  image: any;
  mobileimage:any;
  bannerImageKey: any;
  bannerImageKeyMobile:any;
  category = {
    categoryName: '',

  }
  @ViewChild('categoryName') categoryName: any;
  constructor(private categoriesService: CategoriesService,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    router.events.subscribe((url: any) => console.log(url));
    console.log(router.url);
    this.routerUrl = router.url;
  }

  ngOnInit() {
    this.width = 1300;
    this.height = 400;
    this.mobileHeight=369;
    this.mobileWidth=960;
    if (this.routerUrl != "/admin/categories/add") {
      this.route.params.subscribe(params => {

        this.id = params['id'];
        console.log("iddddd", this.id, params);


        this.categoriesService.getCategory(this.id)
          .subscribe(
            (response) => {
              console.log(response);
              this.category.categoryName = response.data.categoryName;
              this.url = response.data.imageUrl;
this.mobileUrl=response.data.imageMobileUrl;

            }, err => {
              console.log(err);
            })

      })
    }
  }

  onSelectFile(event) { // called each time file input changes
    console.log(event.target.files[0]);
    this.imgFormData = new FormData();
    this.image = event.target.files[0]
    console.log(this.image)

    this.imgFormData.append("bannerImage", this.image);
    this.isValid = false;
    this.url = '';
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => {
        var img: any = new Image();
        img.src = reader.result;


        img.onload = () => {
          this.width = img.width;
          this.height = img.height;
          console.log("hw", img.width,this.width, this.height);
          if (this.width == 1300 && this.height == 400) {
            this.url = event.target.result;
            console.log(this.url);
          }
        };
      }
    }
  }


  onSelectFileMobile(event) { // called each time file input changes
    console.log(event.target.files[0]);
    this.mobileimgFormData = new FormData();
    this.mobileimage = event.target.files[0]
    console.log(this.image)

    this.mobileimgFormData.append("bannerImage", this.mobileimage);
    this.isMobileValid = false;
    this.mobileUrl = '';
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => {
        var img: any = new Image();
        img.src = reader.result;


        img.onload = () => {
          this.mobileWidth = img.width;
          this.mobileHeight = img.height;
          console.log("hw",this.mobileWidth,  this.mobileHeight);
           if (this.mobileWidth == 960 && this.mobileHeight == 369) {
            this.mobileUrl = event.target.result;
            console.log(this.mobileUrl);
           }
        };
      }
    }
  }
  addCategory() {
    this.isInputCategory = true
    if (!this.url) {
      this.isValid = true;
    }

    // if(!this.mobileUrl){
    //   this.isMobileValid=true;
    // }

    if (this.category.categoryName && this.url &&  this.category.categoryName.length <= 40) {
      this.categoriesService.uplaodImage(this.imgFormData)
        .subscribe(
          (response) => {
            console.log("image", response)
            if (response.status == true) {
              this.bannerImageKey = response.bannerImageKey;
              this.categoriesService.uplaodImage(this.mobileimgFormData)
        .subscribe(
          (response) => {
            console.log("image", response)
            if (response.status == true) {
              this.bannerImageKeyMobile = response.bannerImageKey;
              this.isCategoryAdd()
            }

          },
          err => {
            console.log(err)
          })
            }

          },
          err => {
            console.log(err)
          })

    }

  }



  isCategoryAdd(){
    var postData = {
      categoryName: this.category.categoryName,
      bannerImageKey: this.bannerImageKey,
      bannerImageKeyMobile:this.bannerImageKeyMobile
    }
    this.categoriesService.addCategory(postData)
      .subscribe(
        (response) => {
          console.log("category-add", response);
          if (response.status == true) {
            this.router.navigate(['admin/categories/success'])
          }
        }, err => {
          console.log(err);
        })
  }

  
  updateCategory() {
    if (this.category.categoryName && this.url  && this.category.categoryName.length <= 40) {
      console.log(this.imgFormData);
      if (this.imgFormData != undefined) {
       this.uploadCategory();
      }else if(this.mobileimgFormData != undefined){
        this.uploadCategoryMobileImg();
      }
      else {
        var postData: any = {
          id: this.id,
          categoryName: this.category.categoryName,
        }
        console.log(postData);
this.finalupdate(postData);
      
      }
    }
  }

  uploadCategory(){
    this.categoriesService.uplaodImage(this.imgFormData)
    .subscribe(
      (response) => {
        console.log("image", response)
        if (response.status == true) {
          this.bannerImageKey = response.bannerImageKey;
if(this.mobileimgFormData != undefined){
  this.uploadCategoryMobileImg()
}else{
  var postData: any = {
    id: this.id,
    categoryName: this.category.categoryName,
    bannerImageKey: this.bannerImageKey
  }
  console.log(postData);
  this.finalupdate(postData)
}
        
        }
      })
  }

  uploadCategoryMobileImg(){
    this.categoriesService.uplaodImage(this.mobileimgFormData)
    .subscribe(
      (response) => {
        console.log("image", response)
        if (response.status == true) {
          this.bannerImageKeyMobile = response.bannerImageKey;

          var postData: any = {
            id: this.id,
            categoryName: this.category.categoryName,
            bannerImageKeyMobile: this.bannerImageKeyMobile
          }

          if(this.bannerImageKey){
            postData.bannerImageKey=this.bannerImageKey
          }
          console.log(postData);
          this.finalupdate(postData)
        }
      })
  }

  finalupdate(postData){

    this.categoriesService.updateCategory(postData)
    .subscribe(
      (response) => {
        console.log("update", response)
        this.router.navigate(['admin/categories/updated'])

      }, err => {
        console.log(err);
      })
  }
  cancelCategory() {
    // this.isValid = false;
    this.url = '';
    this.mobileUrl='';
    this.category.categoryName = '';
  }
  cancelEditCategory(){
    this.router.navigate(['admin/categories'])
  }

}
