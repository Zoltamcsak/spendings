import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Spending } from './spending.model';
import { SpendingPopupService } from './spending-popup.service';
import { SpendingService } from './spending.service';
import { Item, ItemService } from '../item';
import { User, UserService, Principal } from '../../shared';
import { access } from 'fs';

@Component({
    selector: 'jhi-spending-dialog',
    templateUrl: './spending-dialog.component.html'
})
export class SpendingDialogComponent implements OnInit {

    spending: Spending;
    isSaving: boolean;

    public items: Item[];

    public users: User[];
    dateDp: any;

    public currentUser: User;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private spendingService: SpendingService,
        private itemService: ItemService,
        private userService: UserService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.principal.identity().then((account: User) => this.currentUser = account);
        this.itemService
            .query({filter: 'spending-is-null'})
            .subscribe((res: HttpResponse<Item[]>) => {
                if (!this.spending.itemId) {
                    this.items = res.body;
                } else {
                    this.itemService
                        .find(this.spending.itemId)
                        .subscribe((subRes: HttpResponse<Item>) => {
                            this.items = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.spending.date = new Date();
        this.spending.userId = this.currentUser.id;
        if (this.spending.id !== undefined) {
            this.subscribeToSaveResponse(
                this.spendingService.update(this.spending));
        } else {
            this.subscribeToSaveResponse(
                this.spendingService.create(this.spending));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Spending>>) {
        result.subscribe((res: HttpResponse<Spending>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Spending) {
        this.eventManager.broadcast({ name: 'spendingListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackItemById(index: number, item: Item) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-spending-popup',
    template: ''
})
export class SpendingPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private spendingPopupService: SpendingPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.spendingPopupService
                    .open(SpendingDialogComponent as Component, params['id']);
            } else {
                this.spendingPopupService
                    .open(SpendingDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
