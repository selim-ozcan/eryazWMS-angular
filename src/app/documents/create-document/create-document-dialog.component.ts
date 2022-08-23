import {
    Component,
    Injector,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
    CreateDocumentDto,
    CustomerDto,
    CustomerDtoPagedResultDto,
    CustomerServiceProxy,
    DocumentServiceProxy,
    ProductDto,
    ProductServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup } from '@angular/forms';
import { threadId } from 'worker_threads';
import { PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { ChooseCustomerDialogComponent } from './choose-customer/choose-customer-dialog.component';
import { DocumentService } from '../documents.service';
import { Subscription } from 'rxjs';
import { ChooseProductDialogComponent } from './choose-product/choose-product-dialog.component';
import { deleteElementFromDocumentAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { chooseProduct } from '@shared/animations/chooseProduct';

@Component({
    templateUrl: 'create-document-dialog.component.html',
    styleUrls: ['create-document-dialog.component.scss'],
    animations: [appModuleAnimation(), addElementAnimation(), deleteElementFromDocumentAnimation(), chooseProduct()]
})
export class CreateDocumentDialogComponent extends AppComponentBase
    implements OnInit, OnDestroy {
    saving = false;
    document: CreateDocumentDto = new CreateDocumentDto();
    documentDate: string = "";
    registrationDate: string = "";
    customer: CustomerDto;
    chooseCustomerDialog: BsModalRef;
    chooseProductDialog: BsModalRef;
    @Output() onSave = new EventEmitter<any>();
    customerSubscription: Subscription;
    products: ProductDto[] = [];
    productsSubscription: Subscription;
    choosenProductIds: number[];
    choosenProductsSubscription: Subscription
    stocks: number[];

    constructor(
        injector: Injector,
        public _documentService: DocumentServiceProxy,
        public bsModalRef: BsModalRef,
        public _customerService: CustomerServiceProxy,
        public _modalService: BsModalService,
        private _documentHelperService: DocumentService,
        private _productsService: ProductServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // onHidden veya onHide'a emitleyip subscribe olunca iki kere emit ediyor. sebebini anlamadım.
        // this._modalService.onHidden.subscribe(customer => {
        //     console.log(customer);
        //     this.customer = customer;
        // });
        this.customerSubscription = this._documentHelperService.customerObs.subscribe(customer =>
            this.customer = customer);

        this.productsSubscription = this._documentHelperService.productsObs.subscribe(products =>
            this.products = products);

        this.choosenProductsSubscription = this._documentHelperService.choosenProductsObs.subscribe(choosenProducts => {
            this.choosenProductIds = choosenProducts.products.map(p => p.id);
            this.stocks = choosenProducts.stocks;
        }
        );

    }

    ngOnDestroy(): void {
        this.customerSubscription.unsubscribe();
        this.productsSubscription.unsubscribe();
    }

    save(): void {
        this.saving = true;
        this.document.documentDate = new Date(this.documentDate);
        this.document.registrationDate = new Date(this.registrationDate);
        this.document.customerId = this.customer.id;
        this.document.productIds = this.choosenProductIds;
        this.document.status = "BEKLEMEDE";
        this.document.stocks = this.stocks;
        this._documentService.createDocument(this.document).subscribe(
            () => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.bsModalRef.hide();
                this.onSave.emit();
            },
            () => {
                this.saving = false;
            }
        );
    }

    chooseCustomer(): void {
        this.showChooseCustomerDialog();
    }

    showChooseCustomerDialog(): void {
        this.chooseCustomerDialog = this._modalService.show(
            ChooseCustomerDialogComponent,
            {
                class: 'modal-lg modal-extra-lg',
            }
        );
    }

    getCustomerProperties() {
        return Object.keys(this.customer);
    }

    chooseProduct() {
        this.showChooseProductDialog();
    }

    showChooseProductDialog(): void {
        this.chooseProductDialog = this._modalService.show(
            ChooseProductDialogComponent,
            {
                class: 'modal-lg modal-extra-lg',
            }
        );
    }
}
