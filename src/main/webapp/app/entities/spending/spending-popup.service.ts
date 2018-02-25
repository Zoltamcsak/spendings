import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Spending } from './spending.model';
import { SpendingService } from './spending.service';

@Injectable()
export class SpendingPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private spendingService: SpendingService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.spendingService.find(id)
                    .subscribe((spendingResponse: HttpResponse<Spending>) => {
                        const spending: Spending = spendingResponse.body;
                        if (spending.date) {
                            spending.date = {
                                year: spending.date.getFullYear(),
                                month: spending.date.getMonth() + 1,
                                day: spending.date.getDate()
                            };
                        }
                        this.ngbModalRef = this.spendingModalRef(component, spending);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.spendingModalRef(component, new Spending());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    spendingModalRef(component: Component, spending: Spending): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.spending = spending;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
