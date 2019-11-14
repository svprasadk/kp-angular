import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductsService {

    constructor(private http: HttpClient) { }

    getAllCategories() {
        return this.http.get(environment.url + 'Category/fetchCategories')
    }

    addProduct(data) {
        return this.http.post(environment.url + 'Product/addProduct', data)

    }
    updateProduct(data) {
        return this.http.put(environment.url + 'Product/updateProduct', data)

    }
    uploadImage(data) {
        return this.http.post(environment.url + 'Product/uploadProductImage', data)

    }

    getAllProducts(data?) {
        var newdata = {}
        if (data) {
            newdata = data;
        }
        return this.http.get(environment.url + 'Product/fetchProducts', { params: newdata })

    }

    publishUnpublish(id, publish) {
        return this.http.get(environment.url + 'Product/publishTheProduct/' + id + '/' + publish)

    }

    getProductDetails(id) {
        return this.http.get(environment.url + 'Product/fetchSingleProduct/' + id)

    }

    deleteProduct(id) {
        return this.http.get(environment.url + 'Product/deleteProduct/' + id)

    }
}