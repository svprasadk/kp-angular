import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductAttributeService {

    constructor(private http: HttpClient) { }

    getProductDetails(id) {
        return this.http.get(environment.url + 'Product/fetchSingleProduct/' + id)

    }
    uploadMultipleFiles(data) {
        return this.http.post(environment.url + 'Attribute/uploadSubHeadingFiles', data)
    }

    saveProductAttribute(data) {
        return this.http.post(environment.url + 'Attribute/addAttribute', data)

    }
    updateProductAttribute(data) {
        return this.http.put(environment.url + 'Attribute/updateAttribute', data)

    }
    getAttributesofProduct(id) {
        return this.http.get(environment.url + 'Attribute/fetchHeadingAndSubHeadingOfProduct/' + id)

    }
    getsubAttributesofProduct(id) {
        return this.http.post(environment.url + 'Attribute/fetchsubHeadingData', { subHeadingId: id })

    }
    getAttributesDetails(productId, id) {
        return this.http.get(environment.url + 'Attribute/fetchAttributesOfProduct/' + productId + '/' + id)

    }

    deleteSubHeading(headingId, subHeading) {
        return this.http.get(environment.url + 'Attribute/deleteAttributeSubHeading/' + headingId + '/' + subHeading)
    }
    deleteHeading(id) {
        return this.http.get(environment.url + 'Attribute/deleteAttributeHeading/' + id)

    }

    getCitiesOfZone(zone) {
        return this.http.get(environment.url + 'Cities/fetchCitiesRelatedToZone/' + zone)

    }
    // getAllCategories() {
    //     return this.http.get(environment.url + 'Category/fetchCategories')
    // }

    // addProduct(data) {
    //     return this.http.post(environment.url + 'Product/addProduct', data)

    // }
    // uploadImage(data) {
    //     return this.http.post(environment.url + 'Product/uploadProductImage', data)

    // }

    // getAllProducts() {
    //     return this.http.get(environment.url + 'Product/fetchProducts')

    // }

    // publishUnpublish(id, publish) {
    //     return this.http.get(environment.url + 'Product/publishTheProduct/' + id + '/' + publish)

    // }

    // getProductDetails(id) {
    //     return this.http.get(environment.url + 'Product/fetchSingleProduct/' + id)

    // }
}