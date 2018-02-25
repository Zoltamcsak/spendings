import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Spending } from './spending.model';
import { SpendingService } from './spending.service';

@Component({
    selector: 'jhi-spending-detail',
    templateUrl: './spending-detail.component.html'
})
export class SpendingDetailComponent implements OnInit, OnDestroy {

    spending: Spending;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private spendingService: SpendingService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSpendings();
    }

    load(id) {
        this.spendingService.find(id)
            .subscribe((spendingResponse: HttpResponse<Spending>) => {
                this.spending = spendingResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSpendings() {
        this.eventSubscriber = this.eventManager.subscribe(
            'spendingListModification',
            (response) => this.load(this.spending.id)
        );
    }
}
