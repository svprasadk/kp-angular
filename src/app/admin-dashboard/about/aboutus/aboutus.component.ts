import { Component, OnInit } from '@angular/core';
import { AboutusService } from 'services/aboutus.service';
import { ConfirmationPopupComponent } from 'shared/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material';
import { PopupService } from 'services/popup.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  aboutUs: Array<any> = [];
  constructor(private aboutusService: AboutusService, private dialog: MatDialog, private popupService: PopupService) { }

  ngOnInit() {
    this.getAboutUs()
  }
  getAboutUs() {
    this.aboutusService.getAboutUs().subscribe((res: any) => {
      this.aboutUs = res.data
    }, err => {
      console.log(err)
    })
  }



  deleteAboutUs(id): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: 'Are you sure you want to delete' },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.deleteAbout(id)
      }

    });
  }

  deleteAbout(id) {
    this.aboutusService.deleteAboutUs(id).subscribe((res: any) => {
      this.popupService.show('Successfully deleted');
      this.getAboutUs();
    }, err => {
      console.log(err)
    })
  }

}
