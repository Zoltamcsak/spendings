/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SpendingsTestModule } from '../../../test.module';
import { SpendingDialogComponent } from '../../../../../../main/webapp/app/entities/spending/spending-dialog.component';
import { SpendingService } from '../../../../../../main/webapp/app/entities/spending/spending.service';
import { Spending } from '../../../../../../main/webapp/app/entities/spending/spending.model';
import { ItemService } from '../../../../../../main/webapp/app/entities/item';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('Spending Management Dialog Component', () => {
        let comp: SpendingDialogComponent;
        let fixture: ComponentFixture<SpendingDialogComponent>;
        let service: SpendingService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SpendingsTestModule],
                declarations: [SpendingDialogComponent],
                providers: [
                    ItemService,
                    UserService,
                    SpendingService
                ]
            })
            .overrideTemplate(SpendingDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SpendingDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SpendingService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Spending(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.spending = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'spendingListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Spending();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.spending = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'spendingListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
