import { IPromotion, PromotionType, BuyOneGetOneFreePromotion, TenPercentOffPromotion } from '../models/promotion';
import { promotionsData } from '../data/staticData';

export class PromotionService {
    private promotions: IPromotion[] = [];

    loadPromotions(): void {
        this.promotions = promotionsData.map((promo: { sku: string, type: string }) => {
            switch (promo.type) {
                case PromotionType.BuyOneGetOneFree:
                    return new BuyOneGetOneFreePromotion(promo.sku, PromotionType.BuyOneGetOneFree);
                case PromotionType.TenPercentOff:
                    return new TenPercentOffPromotion(promo.sku, PromotionType.TenPercentOff);
                default:
                    throw new Error(`Unknown promotion type: ${promo.type}`);
            }
        });
    }

    getPromotions(): IPromotion[] {
        return this.promotions;
    }

    getPromotionForSku(sku: string): IPromotion | undefined {
        return this.promotions.find(promo => promo.sku === sku);
    }
} 