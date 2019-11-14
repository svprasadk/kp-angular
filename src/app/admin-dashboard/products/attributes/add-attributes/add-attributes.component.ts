import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Form } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductAttributeService } from 'services/product-attributes.service';
import { PopupService } from 'services/popup.service';
import { Location } from '@angular/common';
import { ConfirmationPopupComponent } from 'shared/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-add-attributes',
  templateUrl: './add-attributes.component.html',
  styleUrls: ['./add-attributes.component.css']
})
export class AddAttributesComponent implements OnInit {
  cityCtrl: FormControl;
  filteredCities: Observable<any[]>;
  citiesArray = [];




  constructor(public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private productAttributeService: ProductAttributeService,
    private _location: Location,
    private popupService: PopupService,
    private dialog: MatDialog) {

  }
  @ViewChild('f') subForm: HTMLFormElement;
  f: Form;
  doPublish: boolean = false;
  productAttributenotAdded: boolean = true;
  myImages: any = [];
  editIndex: number = null;
  submitted: boolean = false;
  videoUrl: string;
  loadingvideo: boolean = false;
  fileKeys: Array<any> = [];
  imagesUpload: Array<any> = [];
  videosUpload: Array<any> = [];
  subHeadingArray: Array<any> = [];
  videoReg = '^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$';
  productTitle: string;
  //model
  pdfData: Array<any> = [];
  heading: string = '';
  subHeading: string = '';
  isLocationChecked: boolean = false;
  zone: string = '';
  city: string = '';
  contenttype: string = '';
  subheadDescription: String = '';
  myFiles: any = [];
  urls = [];
  videoUrlsUrl = [];
  finalFiles: FormData;
  productDetail: any = {
    productName: ''

  }
  productId: string;

  videoUrls = [];

  editSubHead: Boolean = false;
  alreadyContentType: String = '';
  alreadyOploaded: Array<any> = [];

  editHeadingId: string;
  productsAttributesData: any;
  text: string = "";

  isPublished: Boolean = false;
  ngOnInit() {
    this.subHeadingArray = [];
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      if (params['headingId']) {
        this.editHeadingId = params['headingId']
      }
      console.log("Add  Page ", this.productId, this.editHeadingId);

      if (this.productId) {

        this.getProductDetails(this.productId);

      }
      if (this.editHeadingId) {
        this.getAttributeDetails(this.productId, this.editHeadingId)

      }
    });
  }

  filterCities(name: string) {
    return this.citiesArray.filter(state =>
      state.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  zoneChanged() {
    this.productAttributeService.getCitiesOfZone(this.zone).subscribe((res: any) => {
      console.log(res);
      var cities = res.data;
      this.citiesArray = cities.cities
      console.log(this.citiesArray);
      this.autoCompleteCity();
    }, err => {
      console.log(err)
    })

  }

  autoCompleteCity() {
    this.cityCtrl = new FormControl();
    var defaultValue = '';
    if (this.city) {
      defaultValue = this.city
      this.cityCtrl.setValue(this.city);
    }
    this.filteredCities = this.cityCtrl.valueChanges
      .pipe(
        startWith(''),
        map(city => this.filterCities(city))
      );
  }
  backClicked() {
    this._location.back();
  }

  getProductDetails(id) {

    this.productAttributeService.getProductDetails(id).subscribe((res: any) => {
      console.log(res);
      var productData = res.data;
      this.productDetail = productData;
      if (productData.publishProduct) {
        this.isPublished = productData.publishProduct

      }

    }, err => {
      console.log(err)
    })

  }

  getAttributeDetails(productId, id) {
    this.productAttributeService.getAttributesDetails(productId, id).subscribe((res: any) => {
      console.log(res);
      this.productsAttributesData = res.data;
      if (this.productsAttributesData.heading) this.heading = this.productsAttributesData.heading;
      if (this.productsAttributesData.subHeadingData && this.productsAttributesData.subHeadingData.length) {
        // this.subHeadingArray = this.productsAttributesData.subHeadingData
        this.productsAttributesData.subHeadingData.forEach(element => {
          var data: any = {
            subHeading: element.subHeading,
            locationKey: element.locationKey,
            contentFormat: element.contentFormat,
            _id: element._id
          }
          if (element.contentFormat == "text") {
            data.text = element.text
          }
          if (element.contentFormat == "pdf") {
            // data.pdfUrls = this.myFiles
            data.pdfs = element.imageUrl;
          }
          if (element.contentFormat == "image") {
            data.images = element.imageUrl;
          }
          if (element.contentFormat == "videofile") {
            data.videourls = element.imageUrl;
          }
          if (element.contentFormat == "videoUrl") {

            data.videoURl = element.videoURl
          }

          if (element.locationKey) {
            data.location = {
              zone: element.location.zone,
              city: element.location.city
            }

          }
          if (element.fileKeys) {
            data.fileKeys = element.fileKeys
          }
          this.subHeadingArray.push(data);
          console.log(data, this.subHeadingArray)

        });
      }
    }, err => {
      console.log(err)
    })
  }
  contentTypeChange() {
    console.log(this.contenttype)
  }

  pdfFileChange(e: any) {
    for (var i = 0; i < e.target.files.length; i++) {
      var ext = e.target.files[i].name.substr(e.target.files[i].name.lastIndexOf('.') + 1);
      if (ext === 'pdf') {
        this.myFiles.push(e.target.files[i]);

      } else {
        this.popupService.showServerError('Only pdf files can be uploaded');



      }
    }
    var files = e.target.files;
    if (files) {
      var i = 0
      for (let file of files) {
        i++
        var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
        console.log(i)

        if (ext === 'pdf') {
          let reader = new FileReader();
          reader.onload = (e: any) => {

            this.pdfData.push(e.target.result);
          }
          reader.readAsDataURL(file);
        } else {


        }
      }
    }

  }

  imgFileChange(e: any) {
    var extensions = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG', 'gif', 'GIF']
    let files = e.target.files;

    for (var i = 0; i < e.target.files.length; i++) {
      console.log(e.target.files[i]);
      var ext = e.target.files[i].name.substr(e.target.files[i].name.lastIndexOf('.') + 1);
      if (extensions.indexOf(ext) >= 0) {
        this.imagesUpload.push(e.target.files[i]);

      } else {
        this.popupService.showServerError('Only image files with extensions jpg, jpeg, png, gif can be uploaded');

      }
    }

    if (files) {
      for (let file of files) {

        var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
        if (extensions.indexOf(ext) >= 0) {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.urls.push(e.target.result);
          }
          reader.readAsDataURL(file);
        }

      }
    }
  }



  openDialog(type, data, index): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        if (type == "deleteSubHead") {
          this.deleteSubHeadingApi(index, data)
        }
      }

    });
  }

  deleteSubHeadingApi(index, data) {
    console.log(data)
    if (data._id) {
      if (this.editHeadingId) {
        this.productAttributeService.deleteSubHeading(this.editHeadingId, data._id).subscribe((res: any) => {
          this.popupService.show('Sub Heading Deleted Successfully');
          this.ngOnInit();
        }, err => {
          this.popupService.showServerError(err.error.message)
        })
      }
    } else {
      this.subHeadingArray.splice(index, 1)
    }
  }

  addVideoUrls(data?) {
    console.log(this.subForm.form.controls['videoUrl'])
    if (this.videoUrl) {
      this.videoUrlsUrl.push(this.YouTubeGetID(this.videoUrl));
      this.videoUrl = '';
      this.subForm.form.controls['videoUrl'].markAsUntouched();
      this.subForm.form.controls['videoUrl'].setErrors(null);
      console.log(this.subForm.form.controls['videoUrl'])
    }
  }
  getYouTubeUrlSanatize(id) {
    console.log(id)
    var uri = "https://www.youtube.com/embed/" + id
    return this.sanitizer.bypassSecurityTrustResourceUrl(uri)
  }
  YouTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
    return ID;
  }
  vidFileChange(e: any) {
    // for (var i = 0; i < e.target.files.length; i++) {
    //   this.myImages.push(e.target.files[i]);
    // }
    // this.urls = [];
    var extensions = ['mp4', 'm4v', 'mpg', 'mpeg', 'flv', 'avi']

    this.loadingvideo = true;
    console.log(this.loadingvideo, e.target.files)
    for (var i = 0; i < e.target.files.length; i++) {
      var ext = e.target.files[i].name.substr(e.target.files[i].name.lastIndexOf('.') + 1);
      if (extensions.indexOf(ext) >= 0) {
        this.videosUpload.push(e.target.files[i]);


      } else {
        this.popupService.showServerError('Only video files with extensions mp4, m4v, mpg, mpeg, flv, avi can be uploaded');

      }
    }
    let files = e.target.files;
    if (files) {

      for (var i = 0; i < files.length; i++) {
        var ext = files[i].name.substr(files[i].name.lastIndexOf('.') + 1);
        if (extensions.indexOf(ext) >= 0) {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.videoUrls.push(e.target.result);
            console.log(i, files.length)
            if (i === (files.length)) {
              this.loadingvideo = false;
              console.log(this.loadingvideo)

            }
          }
          reader.readAsDataURL(files[i]);
        } else {

        }
      }
    }
  }


  onSubmit() {

  }
  deleteImg(i) {

    // this.urls.splice(i, 1);

    // this.imagesUpload.splice(i, 1);
    // if (this.alreadyOploaded.length) {
    //   this.alreadyOploaded.splice(i, 1);

    // }
    // console.log(this.urls, this.imagesUpload)
    // console.log(this.alreadyOploaded)
    if (this.alreadyOploaded.length && (this.alreadyOploaded.length - 1) >= i) {
      this.alreadyOploaded.splice(i, 1);

      this.imagesUpload.splice(i, 1);
      this.urls.splice(i, 1);

    } else {
      this.imagesUpload.splice((this.alreadyOploaded.length - i), 1);
      this.urls.splice(i, 1);
    }
  }

  deletevideo(i) {


    if (this.alreadyOploaded.length && (this.alreadyOploaded.length - 1) >= i) {
      this.alreadyOploaded.splice(i, 1);

      this.videosUpload.splice(i, 1);
      this.videoUrls.splice(i, 1);

    } else {
      this.videosUpload.splice((this.alreadyOploaded.length - i), 1);
      this.videoUrls.splice(i, 1);
    }
  }

  deletepdf(i) {
    console.log(this.myFiles)
    if (this.alreadyOploaded.length && (this.alreadyOploaded.length - 1) >= i) {
      this.alreadyOploaded.splice(i, 1);
      this.myFiles.splice(i, 1);
      this.pdfData.splice(i, 1);

    } else {
      // this.alreadyOploaded.splice(i, 1);
      this.myFiles.splice((this.alreadyOploaded.length - i), 1);
      this.pdfData.splice(i, 1);
    }
    console.log(this.myFiles, this.pdfData)
    console.log(this.alreadyOploaded)
  }
  deleteurl(i) {
    this.videoUrlsUrl.splice(i, 1);
  }
  saveAndAddNew(savedata?) {
    if (this.videoUrl) {
      this.addVideoUrls()

    }
    // this.finalFiles={}
    console.log(savedata, !this.subHeading, !this.isLocationChecked, !this.contenttype);
    this.submitted = true
    var data: any = {};
    if (savedata && !this.subHeading && !this.isLocationChecked && !this.contenttype) {
      console.log('sdfdfsdgf')
      this.submitAttribute();
    } else if (this.subHeading && this.contenttype) {
      if (this.contenttype == "pdf" && this.myFiles.length) {
        let file = this.myFiles
        var finalFile = new FormData();
        for (var i = 0; i < file.length; i++) {
          finalFile.append('attributeFile', file[i])
        }

        this.finalFileUpload(savedata, finalFile)
        // data.myFiles = this.myFiles;
      } else if (this.contenttype == "image" && this.imagesUpload.length) {
        let image = this.imagesUpload;
        var finalFiles1 = new FormData();
        for (var i = 0; i < image.length; i++) {
          finalFiles1.append('attributeFile', image[i])
        }
        this.finalFileUpload(savedata, finalFiles1)
        // data.images = this.urls
      } else if (this.contenttype == "videofile" && this.videosUpload.length) {
        let video = this.videosUpload;
        var finalFiles2 = new FormData();
        for (var i = 0; i < video.length; i++) {
          finalFiles2.append('attributeFile', video[i])
        }

        this.finalFileUpload(savedata, finalFiles2)


      } else {

        this.saveAttributes(savedata);

      }
    }

    console.log(this.subForm.form.valid)
    if (this.subForm.form.valid) {

    }
  }

  finalFileUpload(saveData, finalfile) {


    this.productAttributeService.uploadMultipleFiles(finalfile).subscribe((res: any) => {
      console.log(res);
      this.fileKeys = res.attributeFileKeys;
      this.saveAttributes(saveData)
    }, err => {
      console.log(err)
    })
  }

  saveAttributes(saveData) {
    var data: any = {};
    data = {
      subHeading: this.subHeading,
      locationKey: this.isLocationChecked,
      contentFormat: this.contenttype
    }
    if (this.contenttype == "text") {
      data.text = this.subheadDescription
    }
    if (this.contenttype == "pdf") {
      data.pdfUrls = this.myFiles
      data.pdfs = this.pdfData;
    }
    if (this.contenttype == "image") {
      data.images = this.urls
    }
    if (this.contenttype == "videofile") {
      data.videourls = this.videoUrls
    }
    if (this.contenttype == "videoUrl") {
      data.videoURl = this.videoUrlsUrl
    }

    if (this.isLocationChecked) {
      data.location = {
        zone: this.zone,
        city: this.cityCtrl.value
      }

    }

    if (this.fileKeys.length) {
      if (this.alreadyContentType !== this.contenttype && this.editSubHead) {
        data.fileKeys = this.fileKeys;
      } else if (this.alreadyContentType === this.contenttype && this.editSubHead) {
        console.log(this.alreadyOploaded, this.fileKeys)
        data.fileKeys = this.alreadyOploaded.concat(this.fileKeys);

      } else {
        data.fileKeys = this.fileKeys;
      }
    } else if (this.alreadyOploaded.length) {
      data.fileKeys = this.alreadyOploaded;

    }

    if (this.editSubHead) {
      data._id = this.editSubheadId;
      console.log(data, this.editIndex);
      this.subHeadingArray[this.editIndex] = data;
    } else {
      this.subHeadingArray.push(data);
      this.cancelAttributeadding();

    }
    console.log(this.subHeadingArray);
    if (saveData) {
      this.submitAttribute();
    }
    // var newdata:any = {
    //   "heading": this.heading,
    //   "productId": this.productId,
    //   "subHeadingData": [
    //     data
    //   ]
    // }


    // this.productAttributeService.saveProductAttribute(newdata).subscribe((res: any) => {
    //   console.log(res);

    // }, err => {
    //   console.log(err)
    // })
  }

  cancelAttributeadding() {
    this.submitted = false;
    this.subHeading = '';
    this.videoUrl = '';

    this.isLocationChecked = false;
    this.zone = '';
    this.city = '';
    this.cityCtrl = new FormControl();
    this.contenttype = '';
    this.subheadDescription = '';
    this.myFiles = [];
    this.pdfData = [];
    this.urls = [];
    this.videoUrlsUrl = [];
    this.finalFiles = new FormData();
    this.fileKeys = [];
    this.imagesUpload = [];
    this.videosUpload = [];
    this.editSubHead = false;
    this.editIndex = null;
    // this.editHeadingId = '';
    this.alreadyOploaded = [];
    this.fileKeys = [];

    this.alreadyContentType = '';
    this.editSubheadId = '';

    this.cityCtrl = new FormControl();
    this.filteredCities;
    this.citiesArray = [];
    this.subForm.form.markAsPristine();
    this.subForm.form.markAsUntouched();
    this.subForm.form.updateValueAndValidity();

    console.log(this.subForm.form);

  }

  submitAttribute() {
    var newdata: any = {
      "heading": this.heading,
      "productId": this.productId,
      "subHeadingData": this.subHeadingArray
    }
    console.log(newdata, this.editHeadingId)
    if (this.editHeadingId) {
      newdata.id = this.editHeadingId
      this.productAttributeService.updateProductAttribute(newdata).subscribe((res: any) => {
        console.log(res);
        this.heading = '';
        this.cancelAttributeadding();
        this.subHeadingArray = [];
        // this.productAttributenotAdded = false;
        this.popupService.show('Attribute Updated Successfully');
        this.ngOnInit()
      }, err => {
        console.log(err);
        this.submitted = false;

      })
    }
    else {
      // Author: Sateesh, Date: 14 / 03 / 2019
      // Create button for add publish now or later
      if (this.doPublish) {
        newdata.publishProduct = true;
      }
      this.productAttributeService.saveProductAttribute(newdata).subscribe((res: any) => {
        console.log(res);
        this.heading = '';
        this.cancelAttributeadding();
        this.getProductDetails(this.productId)
        this.doPublish = false;
        this.subHeadingArray = [];
        this.productAttributenotAdded = false;
      }, err => {
        console.log(err);
        this.submitted = false;

      })
    }

  }

  editSubheadId: string;
  Editsubhead(event, data, index) {
    this.editSubHead = true;
    this.editIndex = index;
    this.editSubheadId = data._id;
    if (data.fileKeys) {
      this.alreadyOploaded = data.fileKeys;

    }
    this.alreadyContentType = data.contentFormat
    event.stopPropagation();
    console.log(data);
    this.subHeading = data.subHeading;
    this.isLocationChecked = data.locationKey;
    if (data.locationKey) {

      this.zone = data.location.zone;
      this.city = data.location.city;
      this.zoneChanged();
      // this.cityCtrl.setValue(data.location.city)

    }
    if (data.contentFormat) {
      this.contenttype = data.contentFormat;
    }
    if (this.contenttype === "text") {
      this.subheadDescription = data.text
    }
    if (this.contenttype === "pdf") {

      this.pdfData = data.pdfs
    }
    if (this.contenttype === "image") {
      this.urls = data.images
    }
    if (this.contenttype == "videofile") {
      this.videoUrls = data.videourls
    }
    if (this.contenttype == "videoUrl") {
      this.videoUrlsUrl = data.videoURl
    }

  }
  deletesubhead(event, data, index) {
    event.stopPropagation();
    this.text = "Are you sure you want to remove this Sub Heading"
    this.openDialog('deleteSubHead', data, index);

    console.log(data);
  }

}
