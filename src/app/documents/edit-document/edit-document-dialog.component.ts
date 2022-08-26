import {
    Component,
    Injector,
    OnInit,
    Output,
    EventEmitter,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
    DocumentDetailDto,
    DocumentHeaderDto,
    DocumentServiceProxy,

} from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { deleteElementFromDocumentAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';

@Component({
    templateUrl: 'edit-document-dialog.component.html',
    animations: [appModuleAnimation(), addElementAnimation(), deleteElementFromDocumentAnimation()],
})
export class EditDocumentDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    documentHeader: DocumentHeaderDto = new DocumentHeaderDto();
    documentDetails: DocumentDetailDto[] = [];
    id: number;
    isTableLoading: boolean = false;
    isDocumentCompletable: boolean = false;

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _documentService: DocumentServiceProxy,
        public bsModalRef: BsModalRef,
        public _modalService: BsModalService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.isTableLoading = true;
        this._documentService.getDocumentHeader(this.id).subscribe((result: DocumentHeaderDto) => {
            this.documentHeader = result;
            this.calculateIfCompletable();
        });
        this._documentService.getDetailsOfDocument(this.id).subscribe((result: DocumentDetailDto[]) => {
            this.documentDetails = result;
            this.calculateIfCompletable();
        });

        this.isTableLoading = false;
    }

    completeDetail(detail: DocumentDetailDto) {
        this._documentService.completeDetailOfDocument(this.documentHeader.id, detail.id).subscribe(() => {
            detail.isCompleted = true;
            abp.notify.success(this.l('Successfully Completed'));
            this.calculateIfCompletable();
        });
    }

    updateDetail(detail: DocumentDetailDto, quantityUpdateInput: HTMLInputElement) {
        this._documentService.updateDetailOfDocument(this.documentHeader.id, detail.id, Number(quantityUpdateInput.value)).subscribe(() => {
            detail.stock += Number(quantityUpdateInput.value);
            abp.notify.success(this.l('Successfully Updated'));
            quantityUpdateInput.value = '0';
            this.calculateIfCompletable();
        });
    }

    deleteDetail(detail: DocumentDetailDto) {
        abp.message.confirm(
            "The detail will be deleted!",
            'Warning!',
            (result: boolean) => {
                if (result) {
                    this._documentService.deleteDetailFromDocument(this.documentHeader.id, detail.id).subscribe(
                        () => {
                            this.documentDetails.splice(this.documentDetails.findIndex(d => d.id === detail.id), 1);
                            abp.notify.success(this.l('Successfully Deleted'));
                            this.calculateIfCompletable();
                        }
                    );
                }
            }
        );

    }

    calculateIfCompletable(): void {
        if (this.documentHeader.isCompleted) {
            this.isDocumentCompletable = false;
            return;
        }
        this.documentDetails.forEach(detail => {
            !detail.isCompleted ?
                this.isDocumentCompletable = false :
                this.isDocumentCompletable = true
        });
    }

    finishDocument(): void {
        this.saving = true;
        this._documentService.finishDocument(this.documentHeader.id).subscribe(() => {
            this.documentHeader.isCompleted = true;
            this.notify.info(this.l('SavedSuccessfully'));
            this.bsModalRef.hide();
            this.onSave.emit();
        },
            () => {
                this.saving = false;
            });
    }
}
