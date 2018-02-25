import { BaseEntity } from './../../shared';

export class Spending implements BaseEntity {
    constructor(
        public id?: number,
        public price?: number,
        public date?: any,
        public itemId?: number,
        public userId?: number,
    ) {
    }
}
