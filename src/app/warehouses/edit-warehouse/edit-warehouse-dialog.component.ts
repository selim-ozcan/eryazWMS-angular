import {
    Component,
    Injector,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
    WarehouseDto,
    WarehouseServiceProxy,

} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'edit-warehouse-dialog.component.html'
})
export class EditWarehouseDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    warehouse: WarehouseDto = new WarehouseDto();
    id: number;
    ambarKoduBaslangic: string;

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _warehouseService: WarehouseServiceProxy,
        public bsModalRef: BsModalRef,
        public _modalService: BsModalService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._warehouseService.getWarehouse(this.id).subscribe((result: WarehouseDto) => {
            this.warehouse = result;
        });

        this._modalService.onShown.subscribe((ambarKodu) => {
            this.ambarKoduBaslangic = ambarKodu;
            console.log(this.ambarKoduBaslangic);
        });
    }

    save(): void {
        this.saving = true;

        const warehouse = new WarehouseDto();
        warehouse.init(this.warehouse);
        this._warehouseService.updateWarehouse(warehouse)
            .subscribe(
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
