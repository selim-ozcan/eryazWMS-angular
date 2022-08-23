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
    ProductServiceProxy,
    ProductDto,
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'edit-product-dialog.component.html'
})
export class EditProductDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    product: ProductDto = new ProductDto();
    id: number;
    stokKoduBaslangic: string;

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _productService: ProductServiceProxy,
        public bsModalRef: BsModalRef,
        public _modalService: BsModalService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._productService.getProduct(this.id).subscribe((result: ProductDto) => {
            this.product = result;
        });
    }

    save(): void {
        this.saving = true;

        const product = new ProductDto();
        product.init(this.product);

        this._productService.updateProduct(product)
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
