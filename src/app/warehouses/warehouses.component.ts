import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/paged-listing-component-base';
import {
    WarehouseServiceProxy,
    WarehouseDto,
    WarehouseDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';

import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { CreateWarehouseDialogComponent } from './create-warehouse/create-warehouse-dialog.component';
import { EditWarehouseDialogComponent } from './edit-warehouse/edit-warehouse-dialog.component';

class PagedWarehouseRequestDto extends PagedRequestDto {
    keyword: string;
    isDeleted: boolean | null;
}

@Component({
    templateUrl: './warehouses.component.html',
    animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation()]
})
export class WarehousesComponent extends PagedListingComponentBase<WarehouseDto>{
    warehouses: WarehouseDto[] = [];
    keyword = '';
    isDeleted: boolean | null;
    advancedFiltersVisible = false;
    //totalCount: number;
    //itemsPerPage: number = 10;
    //maxResultCount: number = 50;

    constructor(
        injector: Injector,
        private _warehouseService: WarehouseServiceProxy,
        private _modalService: BsModalService
    ) {
        super(injector);
    }

    list(
        request: PagedWarehouseRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        request.isDeleted = this.isDeleted;

        //console.log(request);
        this._warehouseService
            .getAllWarehousesPaged(
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
            .subscribe((result: WarehouseDtoPagedResultDto) => {
                this.warehouses = result.items;
                //console.log(this.products);
                this.showPaging(result, pageNumber);
            });
    }


    delete(warehouse: WarehouseDto): void {
        abp.message.confirm(
            //this.l('TenantDeleteWarningMessage', customer.marka),
            warehouse.warehouseName + " ambarı silinecektir",
            undefined,
            (result: boolean) => {
                if (result) {
                    this._warehouseService
                        .deleteWarehouse(warehouse.id)
                        .subscribe(() => {
                            abp.notify.success(this.l('SuccessfullyDeleted'));
                            this.refresh();
                        });
                }
            }
        );
    }

    createWarehouse(): void {
        this.showCreateOrEditWarehouseDialog();
    }

    editWarehouse(warehouse: WarehouseDto): void {
        this.showCreateOrEditWarehouseDialog(warehouse.id);
        //this._modalService.onShown.emit(warehouse.ambarKodu);
    }

    showCreateOrEditWarehouseDialog(id?: number): void {
        let createOrEditWarehouseDialog: BsModalRef;
        if (!id) {
            createOrEditWarehouseDialog = this._modalService.show(
                CreateWarehouseDialogComponent,
                {
                    class: 'modal-lg',
                }
            );
        } else {
            createOrEditWarehouseDialog = this._modalService.show(
                EditWarehouseDialogComponent,
                {
                    class: 'modal-lg',
                    initialState: {
                        id: id,
                    },
                }
            );
        }

        createOrEditWarehouseDialog.content.onSave.subscribe(() => {
            this.refresh();
        });
    }

    clearFilters(): void {
        this.keyword = '';
        this.isDeleted = undefined;
        this.getDataPage(1);
    }
}
