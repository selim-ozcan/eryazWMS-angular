import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { SortableModule } from 'ngx-bootstrap/sortable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';

//Selim
// customer
import { CustomersComponent } from './customers/customers.component';
import { CreateCustomerDialogComponent } from './customers/create-customer/create-customer-dialog.component';
import { EditCustomerDialogComponent } from './customers/edit-customer/edit-customer-dialog.component';

// products
import { ProductsComponent } from './products/products.component';
import { CreateProductDialogComponent } from './products/create-product/create-product-dialog.component';
import { EditProductDialogComponent } from './products/edit-product/edit-product-dialog.component';

// warehouses
import { WarehousesComponent } from './warehouses/warehouses.component';
import { CreateWarehouseDialogComponent } from './warehouses/create-warehouse/create-warehouse-dialog.component';
import { EditWarehouseDialogComponent } from './warehouses/edit-warehouse/edit-warehouse-dialog.component';

// documents
import { DocumentsComponent } from './documents/documents.component';
import { CreateDocumentDialogComponent } from './documents/create-document/create-document-dialog.component';
import { EditDocumentDialogComponent } from './documents/edit-document/edit-document-dialog.component';
import { ChooseCustomerDialogComponent } from './documents/create-document/choose-customer/choose-customer-dialog.component';
import { ChooseProductDialogComponent } from './documents/create-document/choose-product/choose-product-dialog.component';

// movements
import { MovementsComponent } from './movements/movements.component';
import { CreateMovementDialogComponent } from './movements/create-movement/create-movement-dialog.component'

// material

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        // tenants
        TenantsComponent,
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        RolesComponent,
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        UsersComponent,
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ChangePasswordComponent,
        ResetPasswordDialogComponent,
        // layout
        HeaderComponent,
        HeaderLeftNavbarComponent,
        HeaderLanguageMenuComponent,
        HeaderUserMenuComponent,
        FooterComponent,
        SidebarComponent,
        SidebarLogoComponent,
        SidebarUserPanelComponent,
        SidebarMenuComponent,
        // Selim
        // customers
        CustomersComponent,
        CreateCustomerDialogComponent,
        EditCustomerDialogComponent,
        // products
        ProductsComponent,
        CreateProductDialogComponent,
        EditProductDialogComponent,
        // warehouses
        WarehousesComponent,
        CreateWarehouseDialogComponent,
        EditWarehouseDialogComponent,
        // documents
        DocumentsComponent,
        CreateDocumentDialogComponent,
        EditDocumentDialogComponent,
        ChooseCustomerDialogComponent,
        ChooseProductDialogComponent,
        // movements,
        MovementsComponent,
        CreateMovementDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forChild(),
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        AppRoutingModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule,

        BsDatepickerModule.forRoot(),
        SortableModule.forRoot(),
        PopoverModule.forRoot(),
        AccordionModule.forRoot()
    ],
    providers: []
})
export class AppModule { }
