import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Spending } from './spending.model';
import { SpendingService } from './spending.service';
import { Principal, UserService } from '../../shared';
import { Dictionary } from 'lodash';
import { Item, ItemService } from '../item';
import * as _ from 'lodash';

@Component({
    selector: 'jhi-spending',
    templateUrl: './spending.component.html'
})
export class SpendingComponent implements OnInit, OnDestroy {
spendings: Spending[];
items: Dictionary<Item>;
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private spendingService: SpendingService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private userService: UserService,
        private itemService: ItemService
    ) {
    }

    loadAll() {
        this.spendingService.query().subscribe(
            (res: HttpResponse<Spending[]>) => {
                this.spendings = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.itemService.query().subscribe((res: HttpResponse<Item[]>) => {
            this.items = _.mapKeys(res.body, item => item.id);
        });
        this.registerChangeInSpendings();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Spending) {
        return item.id;
    }
    registerChangeInSpendings() {
        this.eventSubscriber = this.eventManager.subscribe('spendingListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
