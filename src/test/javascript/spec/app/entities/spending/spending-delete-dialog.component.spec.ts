/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SpendingsTestModule } from '../../../test.module';
import { SpendingDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/spending/spending-delete-dialog.component';
import { SpendingService } from '../../../../../../main/webapp/app/entities/spending/spending.service';

describe('Component Tests', () => {

    describe('Spending Management Delete Component', () => {
        let comp: SpendingDeleteDialogComponent;
        let fixture: ComponentFixture<SpendingDeleteDialogComponent>;
        let service: SpendingService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SpendingsTestModule],
                declarations: [SpendingDeleteDialogComponent],
                providers: [
                    SpendingService
                ]
            })
            .overrideTemplate(SpendingDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SpendingDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SpendingService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
