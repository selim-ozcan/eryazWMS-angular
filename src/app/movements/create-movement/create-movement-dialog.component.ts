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
    CreateMovementDto,
    MovementServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'create-movement-dialog.component.html'
})
export class CreateMovementDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    movement: CreateMovementDto = new CreateMovementDto();

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _movementService: MovementServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //this.movement.isActive = true;
    }

    save(): void {
        this.saving = true;

        this._movementService.createMovement(this.movement).subscribe(
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
