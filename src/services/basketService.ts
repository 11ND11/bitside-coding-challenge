import { IPromotion } from '../models/promotion';
import { InventoryService } from './inventoryService';
import { Basket } from '../models/basket';

export class BasketService {
    private basket: Basket;

    constructor(private inventoryService: InventoryService) {
        this.basket = new Basket();
    }

    addItem(sku: string): void {
        this.basket.addItem(sku);
    }

    removeItem(sku: string): void {
        this.basket.removeItem(sku);
    }

    getItemCount(sku: string): number {
        return this.basket.getItemCount(sku);
    }

    getTotal(promotions: IPromotion[]): number {
        return this.basket.calculateTotal(
            this.inventoryService.getAllItems(),
            promotions
        );
    }

    getBasketItems(): Record<string, number> {
        const items: Record<string, number> = {};
        this.basket.getAllItems().forEach((count, sku) => {
            items[sku] = count;
        });
        return items;
    }
} 