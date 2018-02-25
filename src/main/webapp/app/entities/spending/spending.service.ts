import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Spending } from './spending.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Spending>;

@Injectable()
export class SpendingService {

    private resourceUrl =  SERVER_API_URL + 'api/spendings';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(spending: Spending): Observable<EntityResponseType> {
        const copy = this.convert(spending);
        return this.http.post<Spending>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(spending: Spending): Observable<EntityResponseType> {
        const copy = this.convert(spending);
        return this.http.put<Spending>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Spending>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Spending[]>> {
        const options = createRequestOption(req);
        return this.http.get<Spending[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Spending[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Spending = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Spending[]>): HttpResponse<Spending[]> {
        const jsonResponse: Spending[] = res.body;
        const body: Spending[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Spending.
     */
    private convertItemFromServer(spending: Spending): Spending {
        const copy: Spending = Object.assign({}, spending);
        copy.date = this.dateUtils
            .convertLocalDateFromServer(spending.date);
        return copy;
    }

    /**
     * Convert a Spending to a JSON which can be sent to the server.
     */
    private convert(spending: Spending): Spending {
        const copy: Spending = Object.assign({}, spending);
        // copy.date = this.dateUtils
        //     .convertLocalDateToServer(spending.date);
        return copy;
    }
}
