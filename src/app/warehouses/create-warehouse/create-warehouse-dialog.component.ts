import {
    Component,
    Injector,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
    CreateWarehouseDto,
    WarehouseServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'create-warehouse-dialog.component.html'
})
export class CreateWarehouseDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    warehouse: CreateWarehouseDto = new CreateWarehouseDto();

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _warehouseService: WarehouseServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //this.product.isActive = true;
    }

    save(): void {
        this.saving = true;

        this._warehouseService.createWarehouse(this.warehouse).subscribe(
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
}
