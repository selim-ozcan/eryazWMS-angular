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
    CreateCustomerDto,
    CustomerServiceProxy
} from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';

@Component({
    templateUrl: 'create-customer-dialog.component.html',
    animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation()]
})
export class CreateCustomerDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    customer: CreateCustomerDto = new CreateCustomerDto();

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _customerService: CustomerServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //this.customer.isActive = true;
    }

    save(): void {
        this.saving = true;

        this._customerService.createCustomer(this.customer).subscribe(
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
