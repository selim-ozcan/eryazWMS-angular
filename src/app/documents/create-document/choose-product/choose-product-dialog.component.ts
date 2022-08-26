import {
    Component,
    Injector,
    OnInit,
    Output,
    EventEmitter,
    ViewChild
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
    CreateProductDto,
    ProductDto,
    ProductDtoPagedResultDto,
    ProductServiceProxy
} from '@shared/service-proxies/service-proxies';
import { finalize } from "rxjs/operators";
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { chooseProduct } from '@shared/animations/chooseProduct';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DocumentService } from '../../documents.service';

class PagedProductRequestDto extends PagedRequestDto {
    keyword: string;
    isDeleted: boolean | null;
}

@Component({
    templateUrl: 'choose-product-dialog.component.html',
    animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation(), chooseProduct()],
    styleUrls: ['choose-product-dialog.component.scss']
})
export class ChooseProductDialogComponent extends PagedListingComponentBase<ProductDto>
    implements OnInit {

    saving = false;
    products: ProductDto[];
    isDeleted: boolean | null;
    keyword: string = "";
    advancedFiltersVisible = false;
    choosenProducts: ProductDto[] = [];
    stocks: number[] = [];
    @ViewChild('productsContainer') productsContainer;

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _productService: ProductServiceProxy,
        public bsModalRef: BsModalRef,
        public _modalService: BsModalService,
        private _documentHelperService: DocumentService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    save(): void {
        // Bu çok saçma olmuş düzeltilecek :)
        console.log(typeof (this.productsContainer))
        for (let index = 0; index < this.productsContainer.nativeElement.children.length; index++) {
            this.stocks.push(this.productsContainer.nativeElement.children[index].children[0].children[3].value);
        }
        console.log(this.productsContainer.nativeElement.children[0].children[0].children[3].value);
        this.saving = true;

        this._documentHelperService.choosenProductsObs.next({ products: this.choosenProducts, stocks: this.stocks });

        this.bsModalRef.hide();
        this.saving = false;
    }

    // choose product
    list(
        request: PagedProductRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        request.isDeleted = this.isDeleted;

        this._productService
            .getAllProductsPaged(
                request.keyword,
                request.isDeleted,
                request.skipCount,
                request.maxResultCount
            )
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: ProductDtoPagedResultDto) => {
                this.products = result.items;
                this.showPaging(result, pageNumber);
            });

    }

    clearFilters(): void {
        this.keyword = '';
        this.isDeleted = undefined;
        this.getDataPage(1);
    }

    addProduct(product: ProductDto): void {
        this.choosenProducts.find(p => p.productCode === product.productCode) ?? this.choosenProducts.push(product);
    }

    addStock(quantityInput: HTMLInputElement) {
        this.stocks.push(Number(quantityInput.value));
    }

    protected delete(entity: ProductDto): void {

    }
}
