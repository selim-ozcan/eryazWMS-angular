import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import {
    CustomerDto, ProductDto

} from '../../shared/service-proxies/service-proxies';
@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    customerObs: Subject<CustomerDto> = new Subject<CustomerDto>();
    productsObs: Subject<ProductDto[]> = new Subject<ProductDto[]>();
    choosenProductsObs: Subject<{ products: ProductDto[], stocks: number[] }> = new Subject<{ products: ProductDto[], stocks: number[] }>();
    constructor() { }
}
