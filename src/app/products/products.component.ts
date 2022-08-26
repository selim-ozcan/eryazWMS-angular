import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/paged-listing-component-base';
import {
    ProductServiceProxy,
    ProductDto,
    ProductDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';

import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { CreateProductDialogComponent } from './create-product/create-product-dialog.component';
import { EditProductDialogComponent } from './edit-product/edit-product-dialog.component';

class PagedProductRequestDto extends PagedRequestDto {
    keyword: string;
    isDeleted: boolean | null;
}

@Component({
    templateUrl: './products.component.html',
    animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation()]
})
export class ProductsComponent extends PagedListingComponentBase<ProductDto>{
    products: ProductDto[] = [];
    keyword = '';
    isDeleted: boolean | null;
    advancedFiltersVisible = false;
    //totalCount: number;
    //itemsPerPage: number = 10;
    //maxResultCount: number = 50;

    constructor(
        injector: Injector,
        private _productService: ProductServiceProxy,
        private _modalService: BsModalService
    ) {
        super(injector);
    }

    list(
        request: PagedProductRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        request.isDeleted = this.isDeleted;

        //console.log(request);
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
                //console.log(this.products);
                this.showPaging(result, pageNumber);
            });
    }

    delete(product: ProductDto): void {
        abp.message.confirm(
            //this.l('TenantDeleteWarningMessage', customer.marka),
            product.brand + " ürünü silinecektir",
            undefined,
            (result: boolean) => {
                if (result) {
                    this._productService
                        .deleteProduct(product.id)
                        .subscribe(() => {
                            abp.notify.success(this.l('SuccessfullyDeleted'));
                            this.refresh();
                        });
                }
            }
        );
    }

    createProduct(): void {
        this.showCreateOrEditProductDialog();
    }

    editProduct(product: ProductDto): void {
        this.showCreateOrEditProductDialog(product.id);
        //this._modalService.onShown.emit(product.stokKodu);
    }

    showCreateOrEditProductDialog(id?: number): void {
        let createOrEditProductDialog: BsModalRef;
        if (!id) {
            createOrEditProductDialog = this._modalService.show(
                CreateProductDialogComponent,
                {
                    class: 'modal-lg',
                }
            );
        } else {
            createOrEditProductDialog = this._modalService.show(
                EditProductDialogComponent,
                {
                    class: 'modal-lg',
                    initialState: {
                        id: id,
                    },
                }
            );
        }

        createOrEditProductDialog.content.onSave.subscribe(() => {
            this.refresh();
        });
    }

    clearFilters(): void {
        this.keyword = '';
        this.isDeleted = undefined;
        this.getDataPage(1);
    }
}
