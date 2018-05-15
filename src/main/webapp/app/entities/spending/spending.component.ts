import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Spending } from './spending.model';
import { SpendingService } from './spending.service';
import {Principal} from '../../shared';
import { Dictionary } from 'lodash';
import {Item, ItemService} from "../item";

@Component({
    selector: 'jhi-spending',
    templateUrl: './spending.component.html'
})
export class SpendingComponent implements OnInit, OnDestroy {
spendings: Spending[];
    currentAccount: any;
    eventSubscriber: Subscription;
    public items: Dictionary<Item>;

    constructor(
        private spendingService: SpendingService,
        private itemService: ItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
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

    loadCurrentMonthSpendings(): void {
        const currentMonth = new Date().getMonth();
        const startDate = new Date(new Date().getFullYear(), currentMonth, 1);
        const endDate = new Date(new Date().getFullYear(), currentMonth + 1, 0);
        this.spendingService.findByDateBetween(startDate, endDate)
            .subscribe(result => this.spendings = result.body);
    }

    ngOnInit() {
        // this.loadAll();
        this.loadCurrentMonthSpendings();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSpendings();
        this.spendingService.findByDateBetween(new Date('2018-02-02'), new Date('2018-02-03'))
          .subscribe((result) =>
            console.log(result)
          );
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
