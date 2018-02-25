/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SpendingsTestModule } from '../../../test.module';
import { SpendingComponent } from '../../../../../../main/webapp/app/entities/spending/spending.component';
import { SpendingService } from '../../../../../../main/webapp/app/entities/spending/spending.service';
import { Spending } from '../../../../../../main/webapp/app/entities/spending/spending.model';

describe('Component Tests', () => {

    describe('Spending Management Component', () => {
        let comp: SpendingComponent;
        let fixture: ComponentFixture<SpendingComponent>;
        let service: SpendingService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SpendingsTestModule],
                declarations: [SpendingComponent],
                providers: [
                    SpendingService
                ]
            })
            .overrideTemplate(SpendingComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SpendingComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SpendingService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Spending(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.spendings[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
