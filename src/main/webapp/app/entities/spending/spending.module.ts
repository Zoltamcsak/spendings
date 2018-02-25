import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SpendingsSharedModule } from '../../shared';
import { SpendingsAdminModule } from '../../admin/admin.module';
import {
    SpendingService,
    SpendingPopupService,
    SpendingComponent,
    SpendingDetailComponent,
    SpendingDialogComponent,
    SpendingPopupComponent,
    SpendingDeletePopupComponent,
    SpendingDeleteDialogComponent,
    spendingRoute,
    spendingPopupRoute,
} from './';

const ENTITY_STATES = [
    ...spendingRoute,
    ...spendingPopupRoute,
];

@NgModule({
    imports: [
        SpendingsSharedModule,
        SpendingsAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SpendingComponent,
        SpendingDetailComponent,
        SpendingDialogComponent,
        SpendingDeleteDialogComponent,
        SpendingPopupComponent,
        SpendingDeletePopupComponent,
    ],
    entryComponents: [
        SpendingComponent,
        SpendingDialogComponent,
        SpendingPopupComponent,
        SpendingDeleteDialogComponent,
        SpendingDeletePopupComponent,
    ],
    providers: [
        SpendingService,
        SpendingPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpendingsSpendingModule {}
