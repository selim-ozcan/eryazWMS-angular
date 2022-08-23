// import { Injectable, OnInit } from '@angular/core';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { BehaviorSubject, Observable } from 'rxjs';
// import {
//   CreateCustomerDto,
//   CustomerDto,
//   CustomerServiceProxy,
// } from '../../shared/service-proxies/service-proxies';
// import { CreateCustomerDialogComponent } from './create-customer/create-customer-dialog.component';

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomersClientService implements OnInit {
//   customersObs: BehaviorSubject<CustomerDto[]> = new BehaviorSubject<CustomerDto[]>([]);
//   customers: CustomerDto[] = [];
//   page: number = 0;
//   totalCount: number = 0;

//   constructor(private _customersService: CustomersServiceProxy,
//     private _modalService: BsModalService) { }

//   ngOnInit() {
//     this.fetchCustomers();
//   }

//   addToCustomersArray(customer: CustomerDto): void {
//     this.customers.push(customer);
//   }

//   fetchCustomers(keyword = '', isActive = true, skipCount = 0, maxResult = 5): void {
//     this._customersService.getAllCustomersPaged(keyword, isActive, skipCount, maxResult).subscribe(({ items: items, totalCount: totalCount }) => {
//       this.customers = items;
//       this.customersObs.next(this.customers);
//       console.log(this.customers);
//       this.totalCount = totalCount;
//     });
//   }

//   deleteCustomer(customer: CustomerDto): void {
//     this._customersService.deleteCustomer(customer.id).subscribe(() => {
//       customer["isDeleted"] = true;
//       console.log(customer);
//       setTimeout(() => {
//         this.customers.splice(this.customers.findIndex(c => c.id === customer.id), 1);
//       }, 300)
//       console.log(this.customers);
//       this.customersObs.next(this.customers);
//     });

//     // setTimeout(() => {
//     //   this.customersObs.subscribe(((customers) => {

//     //     customers.splice(customers.findIndex(c => c.id === customer.id), 1);
//     //     console.log(this.customers);
//     //   }).bind(this));

//     // }, 300)

//     setTimeout(() => {

//     }, 300);

//   }

//   createCustomer(customer: CreateCustomerDto): Observable<CustomerDto> {

//     const customerDto = new CustomerDto();
//     customerDto.init(customer)
//     this.addToCustomersArray(customerDto);
//     this.customersObs.next(this.customers);
//     return this._customersService.createCustomer(customer);
//   }

//   getCustomers(): CustomerDto[] {
//     return this.customers;
//   }

//   getCustomer(id: number) {
//     return this._customersService.getCustomer(id);
//   }
//   getPage(event) {
//     console.log(event);
//     //this.fetchCustomers('', true, )
//   }
// }
