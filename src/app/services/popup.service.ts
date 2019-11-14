import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class PopupService {
    constructor(private snackBar: MatSnackBar) { }
    show(message, action?: any, duration?: any) {
        try {
            Swal('', message, 'success');

            // if (!action) action = "Ok";
            // if (!duration) duration = 3000;
            // this.snackBar.open(message, action, { duration: duration });
        } catch (err) {
            console.log("Erro while showing Popup Message ", err);
        }
    }

    showServerError(message, action?: any, duration?: any) {
        console.log(message)
        try {
            Swal('', message, 'error');
        } catch (err) {
            console.log("Erro while showing Popup Message ", err);
        }
    }


    showNetWorkErrorMessage() {
        try {
            Swal('', 'Network is Unreachable', 'error');
        } catch (err) {
            console.log("Erro while showing Popup Message ", err);
        }
    }


    // showErrorWithSwal(err, customMessage?) {

    //     console.log("Error=====", typeof err, err);
    //     if (customMessage) {
    //         this.showErrorWithSwal(customMessage);
    //     } else {
    //         if (err.error && err.error.message) {
    //             this.showErrorWithSwal(err.error.message);
    //         } else if (typeof err._body == 'object') {
    //             if (err._body.message) {
    //                 this.showErrorWithSwal(err._body.message);
    //             } else {
    //                 this.showNetWorkErrorMessage();
    //             }
    //         } else {
    //             try {
    //                 if (JSON.parse(err._body).message) {
    //                     this.showErrorWithSwal(JSON.parse(err._body).message);
    //                 } else {
    //                     this.showNetWorkErrorMessage();
    //                 }
    //             } catch (err) {
    //                 this.showErrorWithSwal("Couldn't process your request, Please try again later");
    //             }
    //         }
    //     }
    // }



    confirmationDialog(title, text, type, confirmText) {
        return new Promise((resolve, reject) => {

            Swal({
                title: title,
                text: text,
                type: type,
                showCancelButton: true,
                confirmButtonText: confirmText,
                cancelButtonText: 'close'
            }).then((result) => {
                if (result.value) {
                    resolve(true)
                    // For more information about handling dismissals please visit
                    // https://sweetalert2.github.io/#handling-dismissals
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Swal(
                    //   'Cancelled',
                    //   'Your imaginary file is safe :)',
                    //   'error'
                    // )

                    resolve(false)
                }
            })

        });
    }

}
