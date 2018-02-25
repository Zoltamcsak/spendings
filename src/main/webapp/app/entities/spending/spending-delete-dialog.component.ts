import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Spending } from './spending.model';
import { SpendingPopupService } from './spending-popup.service';
import { SpendingService } from './spending.service';

@Component({
    selector: 'jhi-spending-delete-dialog',
    templateUrl: './spending-delete-dialog.component.html'
})
export class SpendingDeleteDialogComponent {

    spending: Spending;

    constructor(
        private spendingService: SpendingService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.spendingService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'spendingListModification',
                content: 'Deleted an spending'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-spending-delete-popup',
    template: ''
})
export class SpendingDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private spendingPopupService: SpendingPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.spendingPopupService
                .open(SpendingDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
