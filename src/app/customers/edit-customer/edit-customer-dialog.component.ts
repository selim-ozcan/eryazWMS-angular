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
    CustomerServiceProxy,
    CustomerDto,
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'edit-customer-dialog.component.html'
})
export class EditCustomerDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    customer: CustomerDto = new CustomerDto();
    id: number;
    cariKodBaslangic: string;

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _customerService: CustomerServiceProxy,
        public bsModalRef: BsModalRef,
        public _modalService: BsModalService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._customerService.getCustomer(this.id).subscribe((result: CustomerDto) => {
            this.customer = result;
        });

        this._modalService.onShown.subscribe((cariKod) => {
            this.cariKodBaslangic = cariKod;
            console.log(this.cariKodBaslangic);
        });
    }

    save(): void {
        this.saving = true;

        const customer = new CustomerDto();
        customer.init(this.customer)
        this._customerService.updateCustomer(customer)
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
