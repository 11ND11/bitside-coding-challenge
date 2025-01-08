export interface IPromotion {
    sku: string;
    type: PromotionType;
    apply(count: number, unitPrice: number): number;
    isActive: boolean;
}

export enum PromotionType {
    BuyOneGetOneFree = "buyOneGetOneFree",
    TenPercentOff = "tenPercentOff"
}

export class BuyOneGetOneFreePromotion implements IPromotion {
    constructor(public sku: string, public type: PromotionType, public isActive: boolean = true) {}

    apply(count: number, unitPrice: number): number {
        if (!this.isActive) return count * unitPrice;
        const freeItems = Math.floor(count / 2);
        return (count - freeItems) * unitPrice;
    }
}

export class TenPercentOffPromotion implements IPromotion {
    constructor(public sku: string, public type: PromotionType, public isActive: boolean = true) {}

    apply(count: number, unitPrice: number): number {
        if (!this.isActive) return count * unitPrice;
        return count * unitPrice * 0.9;
    }
} 