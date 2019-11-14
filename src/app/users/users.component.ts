import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { PopupService } from '../services/popup.service';
import { LoadingbarService } from '../services/loading-bar.service';
import { MatDialog, MatPaginator } from '@angular/material';
import {PageEvent} from '@angular/material';

import { ConfirmationPopupComponent } from '../shared/confirmation-popup/confirmation-popup.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator:MatPaginator
  text: any;
  searchKey: any;
  usersData : any;
  userslength : any;
  p: number = 1;
  note : any;
  count: any;
  public perPage:any = {
    size: 10
  }
  pageEvent: PageEvent;
  pageSizeOptions = [5, 10, 25, 100];
 
  constructor(private router: Router,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService,
    private usersService: UsersService,
    public dialog: MatDialog) {

  }

  ngOnInit() {
    this.searchKey = '';
    this.getAllUsers()
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    console.log("zsdasd");
    
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  pageEvents(event:any){
    console.log(event);
    this.p = event.pageIndex + 1;
    this.perPage.size = event.pageSize;
    this.getAllUsers();
  }




  getAllUsers() {
    var postData = {
      employeeId: this.searchKey,
      page: this.p,
      size: this.perPage.size
    }
    this.usersService.getAllUsers(postData)
      .subscribe((res: any) => {
        console.log(res)
        if(res.status == true){
          this.usersData = res.data.users;
          this.userslength = this.usersData.length;
          this.count = res.data.count;
        }


      }, err => {
        console.log(err)
      })
  }
  applyFilter() {
    console.log(this.searchKey);
this.p=1;
this.paginator.firstPage()
    this.getAllUsers();
  }

  editUser(id) {
    this.router.navigate(['/admin/users/edit/' + id])
  }
  deleteUser(id) {
    this.text = "Are you sure you want delete this user."
    this.note = "Note: User will delete permanently"
    this.openDialog('delete', id);
  }
  openDialog(data, id): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text , note : this.note},
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        if (data == 'delete') {
          this.deleteSingleUser(id)
        }
      }

    });
  }
  deleteSingleUser(id) {
    this.usersService.deleteUser(id)
      .subscribe((res: any) => {
        console.log(res)
        if(res.status == true){
          this.popupService.show('user has been deleted')
          this.getAllUsers()

        }
      }, err => {
        console.log(err)
      })
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
