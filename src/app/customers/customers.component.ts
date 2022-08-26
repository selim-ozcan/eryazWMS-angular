import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/paged-listing-component-base';
import {
  CustomerServiceProxy,
  CustomerDto,
  CustomerDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';

import { deleteElementAnimation } from '@shared/animations/deleteElementFromTable';
import { addElementAnimation } from '@shared/animations/addElementToTable';
import { CreateCustomerDialogComponent } from './create-customer/create-customer-dialog.component';
import { EditCustomerDialogComponent } from './edit-customer/edit-customer-dialog.component';

class PagedCustomerRequestDto extends PagedRequestDto {
  keyword: string;
  isDeleted: boolean | null;
}

@Component({
  templateUrl: './customers.component.html',
  animations: [appModuleAnimation(), deleteElementAnimation(), addElementAnimation()]
})
export class CustomersComponent extends PagedListingComponentBase<CustomerDto>{
  customers: CustomerDto[] = [];
  keyword = '';
  isDeleted: boolean | null = false;
  advancedFiltersVisible = false;
  //totalCount: number;
  //itemsPerPage: number = 10;
  //maxResultCount: number = 50;

  constructor(
    injector: Injector,
    private _customerService: CustomerServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedCustomerRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isDeleted = this.isDeleted;

    this._customerService
      .getAllCustomersPaged(
        request.keyword,
        request.isDeleted,
        request.skipCount,
        this.pageSize
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: CustomerDtoPagedResultDto) => {
        this.customers = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(customer: CustomerDto): void {
    abp.message.confirm(
      `${customer.title} müşterisi silinecektir`,
      undefined,
      (result: boolean) => {
        if (result) {
          this._customerService
            .deleteCustomer(customer.id)
            .subscribe(() => {
              abp.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            });
        }
      }
    );
  }

  createCustomer(): void {
    this.showCreateOrEditCustomerDialog();
  }

  editCustomer(customer: CustomerDto): void {
    this.showCreateOrEditCustomerDialog(customer.id);
    //this._modalService.onShown.emit(customer.customerCode);
  }

  showCreateOrEditCustomerDialog(id?: number): void {
    let createOrEditCustomerDialog: BsModalRef;
    if (!id) {
      createOrEditCustomerDialog = this._modalService.show(
        CreateCustomerDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditCustomerDialog = this._modalService.show(
        EditCustomerDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditCustomerDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  clearFilters(): void {
    this.keyword = '';
    this.isDeleted = undefined;
    this.getDataPage(1);
  }
}
