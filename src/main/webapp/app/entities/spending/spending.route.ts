import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SpendingComponent } from './spending.component';
import { SpendingDetailComponent } from './spending-detail.component';
import { SpendingPopupComponent } from './spending-dialog.component';
import { SpendingDeletePopupComponent } from './spending-delete-dialog.component';

export const spendingRoute: Routes = [
    {
        path: 'spending',
        component: SpendingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'spendingsApp.spending.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'spending/:id',
        component: SpendingDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'spendingsApp.spending.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const spendingPopupRoute: Routes = [
    {
        path: 'spending-new',
        component: SpendingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'spendingsApp.spending.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'spending/:id/edit',
        component: SpendingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'spendingsApp.spending.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'spending/:id/delete',
        component: SpendingDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'spendingsApp.spending.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
