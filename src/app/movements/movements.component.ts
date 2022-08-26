import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/paged-listing-component-base';
import {
    MovementServiceProxy,
    MovementDto,
    MovementDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';

import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { CreateMovementDialogComponent } from './create-movement/create-movement-dialog.component';

class PagedMovementRequestDto extends PagedRequestDto {
    keyword: string;
    isDeleted: boolean | null;
}

@Component({
    templateUrl: './movements.component.html',
    animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation()]
})
export class MovementsComponent extends PagedListingComponentBase<MovementDto>{
    movements: MovementDto[] = [];
    keyword = '';
    isDeleted: boolean | null;
    advancedFiltersVisible = false;
    //totalCount: number;
    //itemsPerPage: number = 10;
    //maxResultCount: number = 50;

    constructor(
        injector: Injector,
        private _movementService: MovementServiceProxy,
        private _modalService: BsModalService
    ) {
        super(injector);
    }

    list(
        request: PagedMovementRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        request.isDeleted = this.isDeleted;

        //console.log(request);
        this._movementService
            .getAllMovementsPaged(
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
            .subscribe((result: MovementDtoPagedResultDto) => {
                this.movements = result.items;
                //console.log(this.movements);
                this.showPaging(result, pageNumber);
            });
    }

    // delete(movement: MovementDto): void {
    //     abp.message.confirm(
    //         //this.l('TenantDeleteWarningMessage', movement.marka),
    //         movement.title + " müşterisi silinecektir",
    //         undefined,
    //         (result: boolean) => {
    //             if (result) {
    //                 this._movementService
    //                     .deleteMovement(movement.id)
    //                     .subscribe(() => {
    //                         abp.notify.success(this.l('SuccessfullyDeleted'));
    //                         this.refresh();
    //                     });
    //             }
    //         }
    //     );
    // }

    createMovement(): void {
        this.showCreateMovementDialog();
    }

    showCreateMovementDialog(): void {
        let createOrEditMovementDialog: BsModalRef;

        createOrEditMovementDialog = this._modalService.show(
            CreateMovementDialogComponent,
            {
                class: 'modal-lg',
            }
        );

        createOrEditMovementDialog.content.onSave.subscribe(() => {
            this.refresh();
        });
    }

    clearFilters(): void {
        this.keyword = '';
        this.isDeleted = undefined;
        this.getDataPage(1);
    }

    delete(): void { }
}
