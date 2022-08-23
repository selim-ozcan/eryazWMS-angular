import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/paged-listing-component-base';
import {
    DocumentServiceProxy,
    DocumentDto,
    DocumentDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';

import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { CreateDocumentDialogComponent } from './create-document/create-document-dialog.component';
import { EditDocumentDialogComponent } from './edit-document/edit-document-dialog.component';

class PagedDocumentRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
}

@Component({
    templateUrl: './documents.component.html',
    animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation()],
    styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent extends PagedListingComponentBase<DocumentDto>{
    documents: DocumentDto[] = [];
    keyword = '';
    isActive: boolean | null;
    advancedFiltersVisible = false;
    //totalCount: number;
    //itemsPerPage: number = 10;
    //maxResultCount: number = 50;

    constructor(
        injector: Injector,
        private _documentService: DocumentServiceProxy,
        private _modalService: BsModalService
    ) {
        super(injector);
    }

    list(
        request: PagedDocumentRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        request.isActive = this.isActive;

        //console.log(request);
        this._documentService
            .getAllDocumentsPaged(
                request.keyword,
                //request.isActive,
                request.skipCount,
                request.maxResultCount
            )
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: DocumentDtoPagedResultDto) => {
                this.documents = result.items;
                //console.log(this.documents);
                this.showPaging(result, pageNumber);
            });
    }

    delete(document: DocumentDto): void {
        abp.message.confirm(
            //this.l('TenantDeleteWarningMessage', document.marka),
            document.documentNumber + " evragi silinecektir",
            undefined,
            (result: boolean) => {
                if (result) {
                    this._documentService
                        .deleteDocument(document.id)
                        .pipe(
                            finalize(() => {
                                abp.notify.success(this.l('SuccessfullyDeleted'));
                                this.refresh();
                            })
                        )
                        .subscribe(() => { });
                }
            }
        );
    }

    createDocument(): void {
        this.showCreateOrEditDocumentDialog();
    }

    editDocument(document: DocumentDto): void {
        this.showCreateOrEditDocumentDialog(document.id);
        //this._modalService.onShown.emit(document.documentNumber);
    }

    showCreateOrEditDocumentDialog(id?: number): void {
        let createOrEditDocumentDialog: BsModalRef;
        if (!id) {
            createOrEditDocumentDialog = this._modalService.show(
                CreateDocumentDialogComponent,
                {
                    class: 'modal-lg',
                }
            );
        } else {
            createOrEditDocumentDialog = this._modalService.show(
                EditDocumentDialogComponent,
                {
                    class: 'modal-lg modal-extra-lg',
                    initialState: {
                        id: id,
                    },
                }
            );
        }

        createOrEditDocumentDialog.content.onSave.subscribe(() => {
            this.refresh();
        });
    }

    clearFilters(): void {
        this.keyword = '';
        this.isActive = undefined;
        this.getDataPage(1);
    }
}
