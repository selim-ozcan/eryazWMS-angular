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
    CreateProductDto,
    ProductServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'create-product-dialog.component.html'
})
export class CreateProductDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    product: CreateProductDto = new CreateProductDto();

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _productService: ProductServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //this.product.isActive = true;
    }

    save(): void {
        this.saving = true;

        this._productService.createProduct(this.product).subscribe(
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
