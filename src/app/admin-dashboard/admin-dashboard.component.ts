// import { Component,  } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationPopupComponent } from '../shared/confirmation-popup/confirmation-popup.component';
import { LoadingbarService } from 'services/loading-bar.service';



@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
  userId: string;
  mobileQuery: MediaQueryList;
  @ViewChild('startClick') startClick: any;
  // fillerNav = Array(50).fill(0).map((_, i) => `Nav Item ${i + 1}`);

  // fillerContent = Array(50).fill(0).map(() =>
  //   `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  //      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  //      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  //      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  //      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  private _mobileQueryListener: () => void;
  text: any;
  empName: any;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private dialog: MatDialog,
    private router: Router,
    public loadingbarService: LoadingbarService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngOnInit() {
    this.userId = localStorage.getItem('id')
    this.empName = localStorage.getItem('firstName')
    this.startClick.nativeElement.click();

  }
  logout() {
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
          this.onLogout()
        }
      }

    });
  }
  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


}
