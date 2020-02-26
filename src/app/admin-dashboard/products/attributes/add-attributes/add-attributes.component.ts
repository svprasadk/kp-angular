import { Component, OnInit, ViewChild, Injectable, ɵConsole } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Form } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductAttributeService } from './../../../../services/product-attributes.service';
import { PopupService } from './../../../../services/popup.service';
import { Location } from '@angular/common';
import { ConfirmationPopupComponent } from './../../../../shared/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

// Mat Tree
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { debug } from 'util';
import * as _ from 'underscore';

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */

export class FileNode {
  id: number;
  parentId: number;
  filename: string;
  level: number;
  contentFormat: any;
  text: string;
  pdfUrls: any;
  pdfs: any;
  images: any;
  imageUrls: any;
  videos: any;
  videourls: any;
  videoURl: any;
  fileKeys: any;
  children: FileNode[];
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

@Injectable()
export class FileDatabase {

  dataChange = new BehaviorSubject<FileNode[]>([]);

  dataChangeView = new BehaviorSubject<FileNode[]>([]);

  get fileNodeData(): FileNode[] { return this.dataChange.value; }

  get fileNodeDataView(): FileNode[] { return this.dataChangeView.value; }

  parentNodeMap = new Map<FileNode, FileNode>();

  constructor() {
    this.initialize();
  }

  treeData = [{ "id": 0, "level": 0, "filename": "", "parentId": null, "contentFormat": "", "text": "", "pdfUrls": [], "pdfs": [], "images": [], "imageUrls": [], "videos": [], "videourls": [], "videoURl": [], "fileKeys": [], "children": [] }] as FileNode[];
  subHeadingLevel: any;
  initialize() {
    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    // input as array

    const data = this.treeData;

    // Notify the change.
    this.dataChange.next(data);
    this.dataChangeView.next(data);
  }

  /** Add an item Tree node */
  public insertItem(parent: FileNode, name: string) {
    if (parent.children) {
      let newNode: FileNode;
      newNode = new FileNode();
      newNode.filename = name;
      newNode.children = [];
      newNode.level = parent.level + 1;
      newNode.parentId = parent.id;
      if (newNode.level > 1) {
        newNode.id = parent.id + ((parent.id - 1) / 10) + ((parent.children.length) / 10.0);
      } else {
        newNode.id = newNode.level + ((parent.children.length + 1) / 10.0);
      }

      newNode.contentFormat = "";
      newNode.text = "";
      newNode.pdfUrls = [];
      newNode.pdfs = [];
      newNode.images = [];
      newNode.imageUrls = [];
      newNode.videos = [];
      newNode.videourls = [];
      newNode.videoURl = [];
      newNode.fileKeys = [];
      this.subHeadingLevel = newNode.level;
      parent.children.push(newNode);
      this.parentNodeMap.set(newNode, parent);
    }
  }

  public removeItem(currentNode: FileNode, root: FileNode) {
    const parentNode = this.parentNodeMap.get(currentNode);
    const index = parentNode.children.indexOf(currentNode);
    if (index !== -1) {
      parentNode.children.splice(index, 1);
      this.dataChange.next(this.fileNodeData);
      this.dataChangeView.next(this.fileNodeDataView);
      this.parentNodeMap.delete(currentNode);
      this.subHeadingLevel = this.subHeadingLevel - 1;
    }
  }

  // updateItem(node: FileNode, name: string) {
  //   node.filename = name;
  //   this.dataChange.next(this.fileNodeData);
  // }  
}

/**
 * @title Tree with nested nodes
 */

@Component({
  selector: 'app-add-attributes',
  templateUrl: './add-attributes.component.html',
  styleUrls: ['./add-attributes.component.css'],
  providers: [FileDatabase]
})
export class AddAttributesComponent implements OnInit {
  // Mat Tree
  @ViewChild('treeSelector', { static: true }) tree: any;

  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedTreeControlView: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  // nestedDataSourceView = new MatTreeNestedDataSource<FileNode>();
  nestedDataSourceView: MatTreeNestedDataSource<FileNode>;
  cityCtrl: FormControl;
  filteredCities: Observable<any[]>;
  citiesArray = [];
  index = 0;

  constructor(public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private productAttributeService: ProductAttributeService,
    private _location: Location,
    private popupService: PopupService,
    private dialog: MatDialog,
    public database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedTreeControlView = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.nestedDataSourceView = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);
    database.dataChangeView.subscribe(data => this.nestedDataSourceView.data = data);
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData;
  hasNestedChildView = (_: number, nodeDataView: FileNode) => !nodeDataView;

  private _getChildren = (node: FileNode) => node.children;
  /** Select the category so we can insert the new item. */
  addNewItem(node: FileNode) {
    this.database.insertItem(node, 'new item');
    this.nestedTreeControl.expand(node);
    this.renderChanges()
    this.getTree();
  }

  public remove(node: FileNode) {
    this.database.removeItem(node, this.database.fileNodeData[0]);
    this.renderChanges()
    this.getTree();
  }

  renderChanges() {
    let data = this.nestedDataSource.data;
    this.nestedDataSource.data = null;
    this.nestedDataSource.data = data;
  }

  getTree() {
    // console.log('getTree',JSON.stringify(this.database.fileNodeData));
  }

  @ViewChild('f', { static: true }) subForm: HTMLFormElement;
  f: Form;
  doPublish: boolean = false;
  productAttributenotAdded: boolean = true;
  myImages: any = [];
  editIndex: number = null;
  submitted: boolean = false;
  // videoUrl: string;
  videoUrl: any = {};
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
  // contenttype: string = '';
  contenttype: any = {};
  // subheadDescription: String = '';
  subheadDescription: any = {};
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

  multiLevelArray: any = [];
  newNodeId: any = [];
  currentNode: any = [];
  filePdf: any = {};
  nodeIdArray: any = [];
  contentTypeArray: any = [];
  fileKeysNodeId: any = [];
  treeData1: any = [];
  newNodeIdEdit: any = [];
  currentNodeEdit: any = [];
  newNodeIdUpdate: any = [];
  currentNodeUpdate: any = [];
  pdfContent: any = [];
  imageContent: any = [];
  videoFileContent: any = [];
  attributeSaveType: String = "save";
  nodeIndexForEdit: number = null;

  ngOnInit() {
    this.subHeadingArray = [];
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      if (params['headingId']) {
        this.editHeadingId = params['headingId']
      }
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
      this.productsAttributesData = res.data;
      if (this.productsAttributesData.heading) this.heading = this.productsAttributesData.heading;
      if (this.productsAttributesData.subHeadingData && this.productsAttributesData.subHeadingData.length) {
        this.productsAttributesData.subHeadingData.forEach(element => {
          var data: any = {
            subHeading: element.subHeading,
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
          if (element.fileKeys) {
            data.fileKeys = element.fileKeys
          }
          this.subHeadingArray.push(data);
        });
      }
    }, err => {
      console.log(err)
    })
  }

  contentTypeChange(currentNode: FileNode, nodeId) {
    // debugger;
    var nodeIdObj = {
      id: nodeId
    }
    var currentNodeObj = {
      id: nodeId,
      value: currentNode
    }
    // this.newNodeId.push(nodeId);
    // this.currentNode.push(currentNode);
    this.newNodeId.push(nodeIdObj);
    this.currentNode.push(currentNodeObj);
    if(this.nodeIndexForEdit != null) {
      this.newNodeIdEdit[this.nodeIndexForEdit].push(nodeIdObj);
      this.currentNodeEdit[this.nodeIndexForEdit].push(currentNodeObj);
    }
    if (this.contenttype[nodeId] != "text") {
      currentNode.text = "";
    } else if (this.contenttype[nodeId] != "pdf") {
      currentNode.pdfs = [];
      currentNode.pdfUrls = [];
      this.pdfContent = [];
    } else if (this.contenttype[nodeId] != "image") {
      currentNode.images = [];
      currentNode.imageUrls = [];
      this.imageContent = [];
    } else if (this.contenttype[nodeId] != "videofile") {
      currentNode.videos = [];
      currentNode.videourls = [];
      this.videoFileContent = [];
    } else if (this.contenttype[nodeId] != "videoUrl") {
      currentNode.videoURl = [];
      this.videoUrlsUrl = [];
    }
  }

  pdfFileChange(e: any, nodeId?: number) {
    var obj = {
      id: 0,
      value: ""
    };
    if (typeof nodeId === "undefined") {
      nodeId = 0;
    }
    for (var i = 0; i < e.target.files.length; i++) {
      var ext = e.target.files[i].name.substr(e.target.files[i].name.lastIndexOf('.') + 1);
      if (ext === 'pdf') {
        obj.id = nodeId;
        obj.value = e.target.files[i];
        this.myFiles.push(obj);
        this.nodeIdArray.push(nodeId);
        this.contentTypeArray.push(ext);
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

        if (ext === 'pdf') {
          var obj1 = {
            id: 0,
            value: ""
          };
          let reader = new FileReader();
          reader.onload = (e: any) => {
            obj1.id = nodeId;
            obj1.value = e.target.result;
            this.pdfData.push(obj1);
            this.pdfContent.push(obj1);
          }
          reader.readAsDataURL(file);
        } else {

        }
      }
    }
  }

  countFilesUploaded(nodeId?: number, filesArray?: any) {
    var occurs = 0;
    for (var i = 0; i < filesArray.length; i++) {
      if (filesArray[i].id == nodeId) {
        occurs++;
      }
    }
    return occurs;
  }

  imgFileChange(e: any, nodeId?: number) {
    var extensions = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG', 'gif', 'GIF']
    let files = e.target.files;
    var obj = {
      id: 0,
      value: ""
    };

    if (typeof nodeId === "undefined") {
      nodeId = 0;
    }

    for (var i = 0; i < e.target.files.length; i++) {
      var ext = e.target.files[i].name.substr(e.target.files[i].name.lastIndexOf('.') + 1);
      if (extensions.indexOf(ext) >= 0) {
        obj.id = nodeId;
        obj.value = e.target.files[i];
        this.imagesUpload.push(obj);
        this.nodeIdArray.push(nodeId);
        this.contentTypeArray.push('image');
      } else {
        this.popupService.showServerError('Only image files with extensions jpg, jpeg, png, gif can be uploaded');
      }
    }

    if (files) {
      for (let file of files) {
        var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
        if (extensions.indexOf(ext) >= 0) {
          var obj1 = {
            id: 0,
            value: ""
          };
          let reader = new FileReader();
          reader.onload = (e: any) => {
            obj1.id = nodeId;
            obj1.value = e.target.result;
            this.urls.push(obj1);
            this.imageContent.push(obj1);
          }
          reader.readAsDataURL(file);
        }
      }
    }
  }

  openDialog(type, data, index, newNodeIdE, currentNodeE): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type == "deleteSubHead") {
          this.deleteSubHeadingApi(index, data, newNodeIdE, currentNodeE)
        }
      }
    });
  }

  deleteSubHeadingApi(nodeIndex, data, newNodeIdE, currentNodeE) {
    console.log('deleteSubHeadingApi', nodeIndex, data, newNodeIdE, currentNodeE)
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
      debugger;
      // this.pdfData = this.pdfData.filter((item) => item.id != nodeIndex);
      // this.pdfContent = this.pdfContent.filter((item) => item.id != nodeIndex);
      // this.urls = this.urls.filter((item) => item.id != nodeIndex);
      // this.imageContent = this.imageContent.filter((item) => item.id != nodeIndex);
      // this.videoUrls = this.videoUrls.filter((item) => item.id != nodeIndex);
      // this.videoFileContent = this.videoFileContent.filter((item) => item.id != nodeIndex);
      // this.newNodeIdEdit = this.newNodeIdEdit[nodeIndex].filter((item) => item.id != nodeIndex);
      // this.currentNodeEdit = this.currentNodeEdit[nodeIndex].filter((item) => item.id != nodeIndex);
      for (var i = 0; i < newNodeIdE[nodeIndex].length; i++) {
        if (newNodeIdE[nodeIndex][i].id == 0) {
          const parentNode = currentNodeE[nodeIndex][i].value;
          const index = newNodeIdE[nodeIndex][i].id;
          if (index !== -1) {            
            this.contenttype[index] = parentNode.contentFormat;
            if (parentNode.contentFormat === "text") {
              parentNode.text = "";
            }
            if (parentNode.contentFormat === "pdf") {
              parentNode.pdfs = [];
              parentNode.pdfUrls = [];
            }
            if (parentNode.contentFormat === "image") {
              parentNode.images = [];
              parentNode.imageUrls = [];
            }
            if (parentNode.contentFormat == "videofile") {
              parentNode.videos = [];
              parentNode.videourls = [];
            }
            if (parentNode.contentFormat == "videoUrl") {
              parentNode.videoURl = [];
            }
          }
        } else {
          const parentNode = this.database.parentNodeMap.get(currentNodeE[nodeIndex][i].value);
          const index = parentNode.children.indexOf(currentNodeE[nodeIndex][i].value);
          if (index !== -1) {
            this.contenttype[newNodeIdE[nodeIndex][i].id] = parentNode.children[index].contentFormat;
            if (parentNode.children[index].contentFormat === "text") {
              parentNode.children[index].text = "";
            }
            if (parentNode.children[index].contentFormat === "pdf") {
              parentNode.children[index].pdfs = [];
              parentNode.children[index].pdfUrls = [];
            }
            if (parentNode.children[index].contentFormat === "image") {
              parentNode.children[index].images = [];
              parentNode.children[index].imageUrls = [];
            }
            if (parentNode.children[index].contentFormat == "videofile") {
              parentNode.children[index].videos = [];
              parentNode.children[index].videourls = [];
            }
            if (parentNode.children[index].contentFormat == "videoUrl") {
              parentNode.children[index].videoURl = [];
            }
          }
        }
      }
      this.pdfData.splice(nodeIndex, 1);
      this.pdfContent.splice(nodeIndex, 1);
      this.urls.splice(nodeIndex, 1);
      this.imageContent.splice(nodeIndex, 1);
      this.videoUrls.splice(nodeIndex, 1);
      this.videoFileContent.splice(nodeIndex, 1);
      this.newNodeIdEdit.splice(nodeIndex, 1);
      this.currentNodeEdit.splice(nodeIndex, 1);
      this.subHeadingArray.splice(nodeIndex, 1)
      this.treeData1.splice(nodeIndex, 1);
      this.nestedDataSourceView.data = this.treeData1;
      this.renderChanges();
      // if(this.treeData1.length <= 0) {
      this.cancelAttributeadding(null);
      // }
    }
  }

  addVideoUrls(data?, nodeId?: number) {
    // if (this.videoUrl) {
    var obj = {
      id: 0,
      value: ""
    };
    if (typeof nodeId === "undefined") {
      nodeId = 0;
    }
    var youtubeId = this.YouTubeGetID(this.videoUrl[nodeId]);
    obj.id = nodeId;
    obj.value = youtubeId;
    this.videoUrlsUrl.push(obj);
    this.contentTypeArray.push('videoUrl');
    this.videoUrl = {};
    // }
  }

  getYouTubeUrlSanatize(id) {
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

  vidFileChange(e: any, nodeId?: number) {
    var extensions = ['mp4', 'm4v', 'mpg', 'mpeg', 'flv', 'avi']

    this.loadingvideo = true;
    var obj = {
      id: 0,
      value: ""
    };

    if (typeof nodeId === "undefined") {
      nodeId = 0;
    }

    for (var i = 0; i < e.target.files.length; i++) {
      var ext = e.target.files[i].name.substr(e.target.files[i].name.lastIndexOf('.') + 1);
      if (extensions.indexOf(ext) >= 0) {
        obj.id = nodeId;
        obj.value = e.target.files[i];
        this.videosUpload.push(obj);
        this.nodeIdArray.push(nodeId);
        this.contentTypeArray.push('videofile');
      } else {
        this.popupService.showServerError('Only video files with extensions mp4, m4v, mpg, mpeg, flv, avi can be uploaded');
      }
    }
    let files = e.target.files;
    if (files) {
      for (var i = 0; i < files.length; i++) {
        var ext = files[i].name.substr(files[i].name.lastIndexOf('.') + 1);
        if (extensions.indexOf(ext) >= 0) {
          var obj1 = {
            id: 0,
            value: ""
          };
          let reader = new FileReader();
          reader.onload = (e: any) => {
            obj1.id = nodeId;
            obj1.value = e.target.result;
            this.videoUrls.push(obj1);
            this.videoFileContent.push(obj1);
            if (i === (files.length)) {
              this.loadingvideo = false;
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
    if (this.alreadyOploaded.length && (this.alreadyOploaded.length - 1) >= i) {
      this.alreadyOploaded.splice(i, 1);
      this.imagesUpload.splice(i, 1);
      this.urls.splice(i, 1);
      this.imageContent.splice(i, 1);
    } else {
      this.imagesUpload.splice((this.alreadyOploaded.length - i), 1);
      this.urls.splice(i, 1);
      this.imageContent.splice(i, 1);
    }
  }

  deletevideo(i) {
    if (this.alreadyOploaded.length && (this.alreadyOploaded.length - 1) >= i) {
      this.alreadyOploaded.splice(i, 1);
      this.videosUpload.splice(i, 1);
      this.videoUrls.splice(i, 1);
      this.videoFileContent.splice(i, 1);
    } else {
      this.videosUpload.splice((this.alreadyOploaded.length - i), 1);
      this.videoUrls.splice(i, 1);
      this.videoFileContent.splice(i, 1);
    }
  }

  deletepdf(i) {
    if (this.alreadyOploaded.length && (this.alreadyOploaded.length - 1) >= i) {
      this.alreadyOploaded.splice(i, 1);
      this.myFiles.splice(i, 1);
      this.pdfData.splice(i, 1);
      this.pdfContent.splice(i, 1);
    } else {
      this.myFiles.splice((this.alreadyOploaded.length - i), 1);
      this.pdfData.splice(i, 1);
      this.pdfContent.splice(i, 1);
    }
  }

  deleteurl(i) {
    this.videoUrlsUrl.splice(i, 1);
  }

  saveAndAddNew(savedata?) {
    // debugger;
    if (this.videoUrl) {
      // this.addVideoUrls()
      // need to write validation
    }
    this.submitted = true
    var data: any = {};
    if (savedata && !this.subHeading && !this.isLocationChecked && !this.contenttype) {
      this.submitAttribute();
    } else if (this.contenttype && this.nodeIdArray.length) {
      var finalFile = new FormData();
      if (this.newNodeId.length && this.nodeIndexForEdit == null) {
        this.newNodeIdEdit.push(this.newNodeId);
        this.currentNodeEdit.push(this.currentNode);
        for (var j = 0; j < this.newNodeId.length; j++) {
          if (this.contenttype[this.newNodeId[j].id] == "pdf" && this.myFiles.length) {
            for (var i = 0; i < this.myFiles.length; i++) {
              if (this.myFiles[i].id == this.newNodeId[j].id) {
                finalFile.append('attributeFile', this.myFiles[i].value);
              }
            }
          } else if (this.contenttype[this.newNodeId[j].id] == "image" && this.imagesUpload.length) {
            for (var i = 0; i < this.imagesUpload.length; i++) {
              if (this.imagesUpload[i].id == this.newNodeId[j].id) {
                finalFile.append('attributeFile', this.imagesUpload[i].value);
              }
            }
          } else if (this.contenttype[this.newNodeId[j].id] == "videofile" && this.videosUpload.length) {
            for (var i = 0; i < this.videosUpload.length; i++) {
              if (this.videosUpload[i].id == this.newNodeId[j].id) {
                finalFile.append('attributeFile', this.videosUpload[i].value);
              }
            }
          }
        }
      } else {
        for (var j = 0; j < this.newNodeIdEdit.length; j++) {
          if (this.contenttype[this.newNodeIdEdit[j].id] == "pdf" && this.myFiles.length) {
            for (var i = 0; i < this.myFiles.length; i++) {
              if (this.myFiles[i].id == this.newNodeIdEdit[j].id) {
                finalFile.append('attributeFile', this.myFiles[i].value);
              }
            }
          } else if (this.contenttype[this.newNodeIdEdit[j].id] == "image" && this.imagesUpload.length) {
            for (var i = 0; i < this.imagesUpload.length; i++) {
              if (this.imagesUpload[i].id == this.newNodeIdEdit[j].id) {
                finalFile.append('attributeFile', this.imagesUpload[i].value);
              }
            }
          } else if (this.contenttype[this.newNodeIdEdit[j].id] == "videofile" && this.videosUpload.length) {
            for (var i = 0; i < this.videosUpload.length; i++) {
              if (this.videosUpload[i].id == this.newNodeIdEdit[j].id) {
                finalFile.append('attributeFile', this.videosUpload[i].value);
              }
            }
          }
        }
      }

      finalFile.append('uploadedFilesNodeId', this.nodeIdArray)
      this.finalFileUpload(savedata, finalFile, this.nodeIdArray);
    } else if (!this.nodeIdArray.length) {
      if (this.newNodeId.length && this.nodeIndexForEdit == null) {
        this.newNodeIdEdit.push(this.newNodeId);
        this.currentNodeEdit.push(this.currentNode);
      }
      this.saveAttributes(savedata, this.newNodeId, this.currentNode)
    }
  }

  finalFileUpload(saveData, finalfile, nodeIdArray) {
    // this.saveAttributes(saveData, this.newNodeId, this.currentNode)
    this.productAttributeService.uploadMultipleFiles(finalfile).subscribe((res: any) => {
      if (nodeIdArray.length == res.attributeFileKeys.length) {
        var obj = {
          id: 0,
          contentType: "",
          value: ""
        };
        var fileKeysArray = [];
        // this.nodeIdArray = _.uniq(this.nodeIdArray);
        for (var j = 0; j < this.nodeIdArray.length; j++) {
          obj.id = this.nodeIdArray[j];
          obj.contentType = this.contentTypeArray[j];
          obj.value = res.attributeFileKeys[j];
          fileKeysArray.push(obj);
        }
        // this.fileKeys = res.attributeFileKeys;
        this.fileKeys = fileKeysArray;
        this.fileKeysNodeId = fileKeysArray;
        this.saveAttributes(saveData, this.newNodeId, this.currentNode)
      } else {

      }
    }, err => {
      console.log(err)
    })
  }

  saveAttributes(saveData, newNodeId, currentNode) {
    // debugger;
    if (newNodeId.length == currentNode.length && newNodeId.length > 0 && this.nodeIndexForEdit == null) {
      for (var i = 0; i < newNodeId.length; i++) {
        if (newNodeId[i].id == 0) {
          const parentNode = currentNode[i].value;
          const index = newNodeId[i].id;
          if (index !== -1) {
            parentNode.contentFormat = this.contenttype[newNodeId[i].id];
            if (this.contenttype[newNodeId[i].id] == "text") {
              parentNode.text = "";
              parentNode.text = this.subheadDescription[newNodeId[i].id];
            }
            if (this.contenttype[newNodeId[i].id] == "pdf") {
              parentNode.pdfUrls = [];
              // parentNode.pdfs = [];
              // parentNode.pdfUrls = this.fileKeys
              // parentNode.pdfs = this.pdfData;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "pdf") {
                  parentNode.pdfUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[newNodeId[i].id] == "image") {
              // parentNode.images = [];
              parentNode.imageUrls = [];
              // parentNode.images = this.urls;
              // parentNode.imageUrls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "image") {
                  parentNode.imageUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[newNodeId[i].id] == "videofile") {
              // parentNode.videos = [];
              parentNode.videourls = [];
              // parentNode.videos = this.videoUrls;
              // parentNode.videourls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "videofile") {
                  parentNode.videourls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[newNodeId[i].id] == "videoUrl") {
              parentNode.videoURl = [];
              parentNode.videoURl = this.videoUrlsUrl;
            }

            if (this.fileKeys.length) {
              if (this.alreadyContentType !== this.contenttype[newNodeId[i].id] && this.editSubHead) {
                parentNode.fileKeys = this.fileKeys;
              } else if (this.alreadyContentType === this.contenttype[newNodeId[i].id] && this.editSubHead) {
                parentNode.fileKeys = this.alreadyOploaded.concat(this.fileKeys);
              } else {
                parentNode.fileKeys = this.fileKeys;
              }
            } else if (this.alreadyOploaded.length) {
              parentNode.fileKeys = this.alreadyOploaded;
            }
          }
        } else {
          const parentNode = this.database.parentNodeMap.get(currentNode[i].value);
          const index = parentNode.children.indexOf(currentNode[i].value);
          if (index !== -1) {
            parentNode.children[index].contentFormat = this.contenttype[newNodeId[i].id];
            if (this.contenttype[newNodeId[i].id] == "text") {
              parentNode.children[index].text = "";
              parentNode.children[index].text = this.subheadDescription[newNodeId[i].id];
            }
            if (this.contenttype[newNodeId[i].id] == "pdf") {
              parentNode.children[index].pdfUrls = [];
              // parentNode.children[index].pdfs = [];
              // parentNode.children[index].pdfUrls = this.fileKeys;
              // parentNode.children[index].pdfs = this.pdfData;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "pdf") {
                  parentNode.children[index].pdfUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[newNodeId[i].id] == "image") {
              // parentNode.children[index].images = [];
              parentNode.children[index].imageUrls = [];
              // parentNode.children[index].images = this.urls;
              // parentNode.children[index].imageUrls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "image") {
                  parentNode.children[index].imageUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[newNodeId[i].id] == "videofile") {
              // parentNode.children[index].videos = [];
              parentNode.children[index].videourls = [];
              // parentNode.children[index].videos = this.videoUrls;
              // parentNode.children[index].videourls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "videofile") {
                  parentNode.children[index].videourls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[newNodeId[i].id] == "videoUrl") {
              parentNode.children[index].videoURl = [];
              parentNode.children[index].videoURl = this.videoUrlsUrl;
            }

            if (this.fileKeys.length) {
              if (this.alreadyContentType !== this.contenttype[newNodeId[i].id] && this.editSubHead) {
                parentNode.children[index].fileKeys = this.fileKeys;
              } else if (this.alreadyContentType === this.contenttype[newNodeId[i].id] && this.editSubHead) {
                parentNode.children[index].fileKeys = this.alreadyOploaded.concat(this.fileKeys);
              } else {
                parentNode.children[index].fileKeys = this.fileKeys;
              }
            } else if (this.alreadyOploaded.length) {
              parentNode.children[index].fileKeys = this.alreadyOploaded;
            }
          }
        }
      }
      this.database.dataChange.next(this.database.fileNodeData);
      this.database.dataChangeView.next(this.database.fileNodeDataView);

      var data: any = {};
      data = {
        subHeading: this.database.fileNodeData,
        contentFormat: this.contentTypeArray,
        treeLevel: this.database.subHeadingLevel,
        nodeIdArray: this.nodeIdArray,
        contentTypeArray: this.contentTypeArray,
        fileKeys: this.fileKeys
      }
      if (this.editSubHead) {
        data._id = this.editSubheadId;
        this.subHeadingArray[this.editIndex] = data;
        this.cancelAttributeadding(null);
      } else {
        if (this.treeData1.length) {
          this.treeData1.push(this.database.fileNodeData[0]);
        } else {
          this.treeData1 = this.database.fileNodeData
        }

        this.nestedDataSourceView.data = this.treeData1;
        this.renderChanges();
        this.subHeadingArray.push(data);
        console.log('this.subHeadingArray', this.subHeadingArray)
        this.cancelAttributeadding(null);
        console.log('this.nestedDataSourceView', this.nestedDataSourceView)
      }
    } else if (this.newNodeIdUpdate.length == this.currentNodeUpdate.length && this.newNodeIdUpdate.length > 0) {
      for (var i = 0; i < this.newNodeIdUpdate.length; i++) {
        if (this.newNodeIdUpdate[i].id == 0) {
          const parentNode = this.currentNodeUpdate[i].value;
          const index = this.newNodeIdUpdate[i].id;
          if (index !== -1) {
            parentNode.contentFormat = this.contenttype[this.newNodeIdUpdate[i].id];
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "text") {
              parentNode.text = "";
              parentNode.text = this.subheadDescription[this.newNodeIdUpdate[i].id];
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "pdf") {
              parentNode.pdfUrls = [];
              // parentNode.pdfs = [];
              // parentNode.pdfUrls = this.fileKeys;
              // parentNode.pdfs = this.pdfData;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "pdf") {
                  parentNode.pdfUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "image") {
              // parentNode.images = [];
              parentNode.imageUrls = [];
              // parentNode.images = this.urls;
              // parentNode.imageUrls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "image") {
                  parentNode.imageUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "videofile") {
              // parentNode.videos = [];
              parentNode.videoUrls = [];
              // parentNode.videos = this.videoUrls;
              // parentNode.videourls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "videofile") {
                  parentNode.videourls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "videoUrl") {
              parentNode.videoURl = [];
              parentNode.videoURl = this.videoUrlsUrl;
            }

            if (this.fileKeys.length) {
              if (this.alreadyContentType !== this.contenttype[this.newNodeIdUpdate[i].id] && this.editSubHead) {
                parentNode.fileKeys = this.fileKeys;
              } else if (this.alreadyContentType === this.contenttype[this.newNodeIdUpdate[i].id] && this.editSubHead) {
                parentNode.fileKeys = this.alreadyOploaded.concat(this.fileKeys);
              } else {
                parentNode.fileKeys = this.fileKeys;
              }
            } else if (this.alreadyOploaded.length) {
              parentNode.fileKeys = this.alreadyOploaded;
            }
          }
        } else {
          const parentNode = this.database.parentNodeMap.get(this.currentNodeUpdate[i].value);
          const index = parentNode.children.indexOf(this.currentNodeUpdate[i].value);
          if (index !== -1) {
            parentNode.children[index].contentFormat = this.contenttype[this.newNodeIdUpdate[i].id];
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "text") {
              parentNode.children[index].text = "";
              parentNode.children[index].text = this.subheadDescription[this.newNodeIdUpdate[i].id];
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "pdf") {
              parentNode.children[index].pdfUrls = [];
              // parentNode.children[index].pdfs = [];
              // parentNode.children[index].pdfUrls = this.fileKeys;
              // parentNode.children[index].pdfs = this.pdfData;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "pdf") {
                  parentNode.children[index].pdfUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "image") {
              // parentNode.children[index].images = [];
              parentNode.children[index].imageUrls = [];
              // parentNode.children[index].images = this.urls;
              // parentNode.children[index].imageUrls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "image") {
                  parentNode.children[index].imageUrls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "videofile") {
              // parentNode.children[index].videos = [];
              parentNode.children[index].videourls = [];
              // parentNode.children[index].videos = this.videoUrls;
              // parentNode.children[index].videourls = this.fileKeys;
              for (var j = 0; j < this.fileKeys.length; j++) {
                if (this.fileKeys[j].contentType == "videofile") {
                  parentNode.children[index].videourls.push(this.fileKeys[j].value)
                }
              }
            }
            if (this.contenttype[this.newNodeIdUpdate[i].id] == "videoUrl") {
              parentNode.children[index].videoURl = [];
              parentNode.children[index].videoURl = this.videoUrlsUrl;
            }

            if (this.fileKeys.length) {
              if (this.alreadyContentType !== this.contenttype[this.newNodeIdUpdate[i].id] && this.editSubHead) {
                parentNode.children[index].fileKeys = this.fileKeys;
              } else if (this.alreadyContentType === this.contenttype[this.newNodeIdUpdate[i].id] && this.editSubHead) {
                parentNode.children[index].fileKeys = this.alreadyOploaded.concat(this.fileKeys);
              } else {
                parentNode.children[index].fileKeys = this.fileKeys;
              }
            } else if (this.alreadyOploaded.length) {
              parentNode.children[index].fileKeys = this.alreadyOploaded;
            }
          }
        }
      }
      this.database.dataChange.next(this.database.fileNodeData);
      this.database.dataChangeView.next(this.database.fileNodeDataView);

      var data: any = {};
      data = {
        subHeading: this.database.fileNodeData,
        contentFormat: this.contentTypeArray,
        treeLevel: this.database.subHeadingLevel,
        nodeIdArray: this.nodeIdArray,
        contentTypeArray: this.contentTypeArray,
        fileKeys: this.fileKeys
      }
      if (this.editSubHead) {
        data._id = this.editSubheadId;
        // this.subHeadingArray[this.editIndex] = data;
        // this.treeData1;
        console.log('this.treeData1',this.treeData1)
        this.nestedDataSourceView.data = this.treeData1;
        this.renderChanges();
        this.cancelAttributeadding(null);
      } else {
        if (this.treeData1.length) {
          this.treeData1.push(this.database.fileNodeData[0]);
        } else {
          this.treeData1 = this.database.fileNodeData
        }

        this.nestedDataSourceView.data = this.treeData1;
        this.renderChanges();
        this.subHeadingArray.push(data);
        console.log('this.subHeadingArray', this.subHeadingArray)
        this.cancelAttributeadding(null);
        this.renderChanges();
        console.log('this.nestedDataSourceView', this.nestedDataSourceView)
      }
    } else {
      if (saveData) {
        this.submitAttribute();
      }
    }
  }

  cancelAttributeadding(nodeIndex) {
    // debugger;
    // if (this.newNodeId.length) {
    //   if(nodeIndex != null) {
    //     var occurs = 0;
    //     for (var i = 0; i < this.newNodeIdEdit.length; i++) {
    //       if (this.newNodeIdEdit[nodeIndex][i].id == this.newNodeId[i].id) {
    //         occurs++;
    //       }
    //     }
    //     if (occurs == 0) {
    //       this.newNodeIdEdit.push(this.newNodeId);
    //       this.currentNodeEdit.push(this.currentNode);
    //     }
    //   } else {
    //     this.newNodeIdEdit.push(this.newNodeId);
    //     this.currentNodeEdit.push(this.currentNode);
    //   }      
    // }
    this.submitted = false;
    this.subHeading = '';
    this.videoUrl = {};
    this.isLocationChecked = false;
    this.zone = '';
    this.city = '';
    this.cityCtrl = new FormControl();
    this.contenttype = {};
    this.subheadDescription = {};
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
    this.newNodeId = [];
    this.currentNode = [];
    this.contentTypeArray = [];
    this.nodeIdArray = [];
    this.attributeSaveType = "save";
    this.database.treeData = [{ "id": 0, "level": 0, "filename": "", "parentId": null, "contentFormat": "", "text": "", "pdfUrls": [], "pdfs": [], "images": [], "videourls": [], "videoURl": [], "fileKeys": [], "children": [] }] as FileNode[];
    this.database.dataChange.next(this.database.treeData);
    this.nestedDataSource.data = this.database.treeData;
    this.renderChanges();
  }

  submitAttribute() {
    var newdata: any = {
      "heading": this.heading,
      "productId": this.productId,
      "subHeadingData": this.subHeadingArray
    }
    console.log('submitAttribute', this.newNodeIdEdit, this.currentNodeEdit, this.subHeadingArray);
    // if (this.editHeadingId) {
    //   newdata.id = this.editHeadingId
    //   this.productAttributeService.updateProductAttribute(newdata).subscribe((res: any) => {
    //     // console.log(res);
    //     this.heading = '';
    //     this.cancelAttributeadding(null);
    //     this.subHeadingArray = [];
    //     this.popupService.show('Attribute Updated Successfully');
    //     this.ngOnInit()
    //   }, err => {
    //     console.log(err);
    //     this.submitted = false;
    //   })
    // }
    // else {
    //   // Author: Sateesh, Date: 14 / 03 / 2019
    //   // Create button for add publish now or later
    //   if (this.doPublish) {
    //     newdata.publishProduct = true;
    //   }
    //   this.productAttributeService.saveProductAttribute(newdata).subscribe((res: any) => {
    //     // console.log(res);
    //     this.heading = '';
    //     this.cancelAttributeadding(null);
    //     this.getProductDetails(this.productId)
    //     this.doPublish = false;
    //     this.subHeadingArray = [];
    //     this.productAttributenotAdded = false;
    //   }, err => {
    //     console.log(err);
    //     this.submitted = false;
    //   })
    // }
  }

  editSubheadId: string;
  Editsubhead(event, data, nodeIndex, newNodeIdE, currentNodeE) {
    debugger;
    this.attributeSaveType = "edit";
    this.nodeIndexForEdit = nodeIndex;
    this.cancelAttributeadding(nodeIndex);
    this.newNodeIdUpdate = newNodeIdE[nodeIndex];
    this.currentNodeUpdate = currentNodeE[nodeIndex];
    var editTreeData = [];
    this.database.dataChange.next(editTreeData);
    for (var i = 0; i < newNodeIdE[nodeIndex].length; i++) {
      if (newNodeIdE[nodeIndex][i].id == 0) {
        const parentNode = currentNodeE[nodeIndex][i].value;
        const index = newNodeIdE[nodeIndex][i].id;
        if (index !== -1) {
          this.contenttype[index] = parentNode.contentFormat;
          if (parentNode.contentFormat === "text") {
            this.subheadDescription[index] = parentNode.text
          }
          if (parentNode.contentFormat === "pdf") {
            for (var j = 0; j < this.pdfContent.length; j++) {
              if (this.pdfContent[j].id == newNodeIdE[nodeIndex][i].id) {
                this.pdfData.push(this.pdfContent[j]);
              }
            }
            // this.pdfData = parentNode.pdfs;
          }
          if (parentNode.contentFormat === "image") {
            for (var j = 0; j < this.imageContent.length; j++) {
              if (this.imageContent[j].id == newNodeIdE[nodeIndex][i].id) {
                this.urls.push(this.imageContent[j]);
              }
            }
            // this.urls = parentNode.images
          }
          if (parentNode.contentFormat == "videofile") {
            for (var j = 0; j < this.videoFileContent.length; j++) {
              if (this.videoFileContent[j].id == newNodeIdE[nodeIndex][i].id) {
                this.videoUrls.push(this.videoFileContent[j]);
              }
            }
            // this.videoUrls = parentNode.videourls
          }
          if (parentNode.contentFormat == "videoUrl") {
            this.videoUrlsUrl = parentNode.videoURl;
          }
          editTreeData.push(parentNode);
        }
      } else {
        const parentNode = this.database.parentNodeMap.get(currentNodeE[nodeIndex][i].value);
        const index = parentNode.children.indexOf(currentNodeE[nodeIndex][i].value);
        if (index !== -1) {
          this.contenttype[newNodeIdE[nodeIndex][i].id] = parentNode.children[index].contentFormat;
          if (parentNode.children[index].contentFormat === "text") {
            this.subheadDescription[newNodeIdE[nodeIndex][i].id] = parentNode.children[index].text
          }
          if (parentNode.children[index].contentFormat === "pdf") {
            // this.pdfData = parentNode.children[index].pdfs;
            for (var j = 0; j < this.pdfContent.length; j++) {
              if (this.pdfContent[j].id == newNodeIdE[nodeIndex][i].id) {
                this.pdfData.push(this.pdfContent[j]);
              }
            }
          }
          if (parentNode.children[index].contentFormat === "image") {
            // this.urls = parentNode.children[index].images;
            for (var j = 0; j < this.imageContent.length; j++) {
              if (this.imageContent[j].id == newNodeIdE[nodeIndex][i].id) {
                this.urls.push(this.imageContent[j]);
              }
            }
          }
          if (parentNode.children[index].contentFormat == "videofile") {
            // this.videoUrls = parentNode.children[index].videourls;
            for (var j = 0; j < this.videoFileContent.length; j++) {
              if (this.videoFileContent[j].id == newNodeIdE[nodeIndex][i].id) {
                this.videoUrls.push(this.videoFileContent[j]);
              }
            }
          }
          if (parentNode.children[index].contentFormat == "videoUrl") {
            this.videoUrlsUrl = parentNode.children[index].videoURl;
          }
          if (i == newNodeIdE[nodeIndex].length - 1) {
            editTreeData.push(parentNode);
          }
        }
      }
    }
    // this.newNodeIdEdit = this.newNodeIdEdit[nodeIndex].filter((item) => item.id != nodeIndex);
    // this.currentNodeEdit = this.currentNodeEdit[nodeIndex].filter((item) => item.id != nodeIndex);
    this.nestedDataSource.data = (editTreeData.length) ? editTreeData : this.database.fileNodeData;
    this.editSubHead = true;
    this.editIndex = nodeIndex;
    this.editSubheadId = data.id;
    if (data.fileKeys) {
      this.alreadyOploaded = data.fileKeys;
    }
    this.alreadyContentType = data.contentFormat
    event.stopPropagation();
    this.subHeading = data.filename;
  }

  deletesubhead(event, data, index, newNodeIdE, currentNodeE) {
    event.stopPropagation();
    this.text = "Are you sure you want to remove this Sub Heading"
    this.openDialog('deleteSubHead', data, index, newNodeIdE, currentNodeE);
  }
}
