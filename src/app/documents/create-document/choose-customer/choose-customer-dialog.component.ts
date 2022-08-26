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
    CreateCustomerDto,
    CustomerDto,
    CustomerDtoPagedResultDto,
    CustomerServiceProxy
} from '@shared/service-proxies/service-proxies';
import { finalize } from "rxjs/operators";
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DocumentService } from '../../documents.service';

class PagedCustomerRequestDto extends PagedRequestDto {
    keyword: string;
    isDeleted: boolean | null;
}

@Component({
    templateUrl: 'choose-customer-dialog.component.html',
    animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation()],
    styleUrls: ['choose-customer-dialog.component.scss']
})
export class ChooseCustomerDialogComponent extends PagedListingComponentBase<CustomerDto>
    implements OnInit {

    saving = false;
    customers: CustomerDto[];
    isDeleted: boolean | null;
    keyword: string = "";
    advancedFiltersVisible = false;

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _customerService: CustomerServiceProxy,
        public bsModalRef: BsModalRef,
        public _modalService: BsModalService,
        private _documentHelperService: DocumentService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //this.customer.isActive = true;
        this.refresh();
    }

    save(customer: CustomerDto): void {
        this.saving = true;

        // this._modalService.onHidden.emit(customer);
        this._documentHelperService.customerObs.next(customer);
        //this.notify.info(this.l('Müşteri seçme başarılı.'));

        this.bsModalRef.hide();
        this.saving = false;
    }

    // choose customer
    list(
        request: PagedCustomerRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        request.isDeleted = this.isDeleted;

        //console.log(request);
        this._customerService
            .getAllCustomersPaged(
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
            .subscribe((result: CustomerDtoPagedResultDto) => {
                this.customers = result.items;
                //console.log(this.documents);
                this.showPaging(result, pageNumber);
            });

    }

    clearFilters(): void {
        this.keyword = '';
        this.isDeleted = undefined;
        this.getDataPage(1);
    }

    protected delete(entity: CustomerDto): void {

    }
}
