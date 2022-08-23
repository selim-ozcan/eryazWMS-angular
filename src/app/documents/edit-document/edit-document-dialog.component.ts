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
    DocumentServiceProxy,
    DocumentDto,
    Movement,
    DocumentMovementStatus
} from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { deleteElementAnimation, deleteElementFromDocumentAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: 'edit-document-dialog.component.html',
    animations: [appModuleAnimation(), addElementAnimation(), deleteElementFromDocumentAnimation()],
})
export class EditDocumentDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    document: DocumentDto = new DocumentDto();
    id: number;
    isTableLoading: boolean = false;
    isDocumentCompletable: boolean = false;

    @Output() onSave = new EventEmitter<any>();
    //@ViewChild("quantityUpdateInput") quantityUpdateInput;

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
        this._documentService.getDocument(this.id).subscribe((result: DocumentDto) => {
            this.document = result;
            console.log(result);
        });
        this.calculateIfCompletable();
        console.log(this.document.movementStatuses);
        this.isTableLoading = false;
    }

    save(): void {
        // this.saving = true;
        // console.log(this.evrakNumarasiBaslangic);
        // this._documentService.updateDocument(
        //     new UpdateDocumentDto({
        //         id: this.document.id,
        //         eskiEvrakNumarasi: this.evrakNumarasiBaslangic,
        //         evrakNumarasi: this.document.evrakNumarasi,
        //         evrakTarihi: this.document.evrakTarihi,
        //         kayitTarihi: this.document.kayitTarihi,
        //         musteri: this.document.musteri,
        //         ambar: this.document.ambar

        //     }))
        //     .subscribe(
        //         () => {
        //             this.notify.info(this.l('SavedSuccessfully'));
        //             this.bsModalRef.hide();
        //             this.onSave.emit();
        //         },
        //         () => {
        //             this.saving = false;
        //         }
        //     );
    }

    completeMovement(movement: Movement) {
        this._documentService.completeMovementOfDocument(this.document.id, movement.id).subscribe(() => {
            let movementStatuses = this.document.movementStatuses;
            for (let index = 0; index < movementStatuses.length; index++) {
                if (movementStatuses[index].movement.id === movement.id) {
                    movementStatuses[index].isCompleted = true;
                }

            }
            abp.notify.success(this.l('SuccessfullyUpdated'));
            this.calculateIfCompletable();
        });
    }

    updateMovement(movement: Movement, quantityUpdateInput: HTMLInputElement) {
        this._documentService.updateMovementOfDocument(this.document.id, movement.id, Number(quantityUpdateInput.value)).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyUpdated'));
            quantityUpdateInput.value = '0';
            this.calculateIfCompletable();
        });
    }

    deleteMovement(movement: Movement) {
        abp.message.confirm(
            //this.l('TenantDeleteWarningMessage', document.marka),
            " transfer silinecektir",
            undefined,
            (result: boolean) => {
                if (result) {
                    this._documentService.deleteMovementFromDocument(this.document.id, movement.id).subscribe(
                        () => {
                            this.document.movements.splice(this.document.movements.findIndex(m => m.id === movement.id), 1);

                            abp.notify.success(this.l('SuccessfullyDeleted'));

                            let movementStatuses = this.document.movementStatuses;
                            for (let index = 0; index < movementStatuses.length; index++) {
                                if (movementStatuses[index].movement.id === movement.id) {
                                    movementStatuses[index].isDeleted = true;
                                }

                            }
                            this.calculateIfCompletable();

                        }
                    );
                }
            }
        );

    }

    isMovementCompleted(movement: Movement): boolean {
        let movementStatuses = this.document.movementStatuses;
        for (let index = 0; index < movementStatuses.length; index++) {
            if (movementStatuses[index].movement.id === movement.id) {
                return movementStatuses[index].isCompleted;
            }

        }
    }

    calculateIfCompletable(): void {
        console.log(this.document.movementStatuses);
        if (this.document?.status) {
            if (this.document.status === "TAMAMLANDI") {
                this.isDocumentCompletable = true;
                return;
            }

        } else {
            this.isDocumentCompletable = false;

            return;
        }

        let completableFlag = true;
        if (this.document?.movementStatuses) {
            let movementStatuses = this.document.movementStatuses;
            for (let index = 0; index < movementStatuses.length; index++) {
                if (movementStatuses[index].isCompleted === false && movementStatuses[index].isDeleted === false) {

                    completableFlag = false;
                    break;
                }
                else if (movementStatuses[index].isCompleted === false && movementStatuses[index].isDeleted === true) {
                    completableFlag = true;
                    continue;
                }
            }
            this.isDocumentCompletable = completableFlag;
            console.log(this.isDocumentCompletable);
            return;
        }

        this.isDocumentCompletable = false;
        return;
    }

    finishDocument() {
        this.saving = true;
        this._documentService.finishDocument(this.document.id).subscribe(() => {
            this.document.status = "COMPLETED"
            this.notify.info(this.l('SavedSuccessfully'));
            this.bsModalRef.hide();
            this.onSave.emit();
        },
            () => {
                this.saving = false;
            });
    }
}
