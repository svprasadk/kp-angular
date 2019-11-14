import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from '../services/popup.service';
import { LoadingbarService } from '../services/loading-bar.service';
import { CategoriesService } from '../services/categories.service';
import { MatDialog } from '@angular/material';
import { ConfirmationPopupComponent } from '../shared/confirmation-popup/confirmation-popup.component';



@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  text: string;
  note: string;
  constructor(private router: Router,
    private categoriesService: CategoriesService,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService,
    public dialog: MatDialog) { }
  role: String;
  showActionItems: Boolean = false;
  ngOnInit() {
    this.role = localStorage.getItem('role');
    if (this.role === "admin") {
      this.showActionItems = true;
    } else {
      this.showActionItems = false;
    }
    this.getAllCategories()

  }
  getAllCategories() {
    this.categoriesService.getCategories()
      .subscribe(
        (response) => {
          console.log("allcategories", response)
          this.categories = response.data;

        }, err => {
          console.log(err);
        })

  }

  editCategory(id) {

    this.router.navigate(['/admin/categories/edit/' + id])
  }
  deleteCategory(id) {
    this.text = "Are you sure you want delete this category(releated products also will be deleted)"
    this.note = "Note:Can't restore it again."
    this.openDialog('delete', id);
  }

  publish(i, id) {
    console.log(i, id);

    this.text = "Are you sure you want to publish the category?"

    this.openDialog('publish', id);
  }
  unPublish(i, id) {
    console.log(i, id);
    this.text = "Are you sure you want to unpublish the category?"

    this.openDialog('unpublish', id);
  }
  openDialog(data, id): void {
    if (data == 'delete') {
      let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '550px',
        data: { txt: this.text, note: this.note },
        panelClass: 'confirm-class'

      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {

          if (data == 'delete') {
            this.deleteSingleCategory(id)
          }
        }

      });
    }
    else {
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
          if (data == 'delete') {
            this.deleteSingleCategory(id)
          }
        }

      });
    }

  }
  deleteSingleCategory(id) {
    this.categoriesService.deleteCategory(id)
      .subscribe((res: any) => {
        console.log(res)
        this.getAllCategories()
      }, err => {
        console.log(err)
      })
  }

  publishOrUnpublish(id, publish) {
    console.log(publish);

    // if(publish == false)  { this.categories[i].publishCategory = true;}
    // if(publish == true)   {this.categories[i].publishCategory = false;}


    console.log(id, publish);

    this.categoriesService.publishUnpublish(id, publish).subscribe((res: any) => {
      console.log(res)
      if (res.status == true) {
        if (publish == true) {
          this.popupService.show(res.message);
          this.getAllCategories()
        }
        else {
          this.popupService.show(res.message);
          this.getAllCategories()
        }
      }
    }, err => {
      console.log(err)
    })
  }
}
