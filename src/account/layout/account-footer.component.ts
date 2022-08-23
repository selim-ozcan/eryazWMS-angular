import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';
@Component({
  selector: 'account-footer',
  templateUrl: './account-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountFooterComponent extends AppComponentBase {
  currentYear: number;
  versionText: string;

  constructor(injector: Injector) {
    super(injector);

    this.currentYear = new Date().getFullYear();
    this.versionText =
      this.appSession.application.version +
      ' [' +
      moment(this.appSession.application.releaseDate).format('YYYYDDMM') +
      ']';
  }
}
