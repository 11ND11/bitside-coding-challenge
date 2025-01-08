import { InventoryItem } from './inventory';
import { IPromotion } from './promotion';

export class Basket {
    private items: Map<string, number> = new Map();

    addItem(sku: string): void {
        const currentCount = this.items.get(sku) || 0;
        this.items.set(sku, currentCount + 1);
    }

    removeItem(sku: string): void {
        const currentCount = this.items.get(sku) || 0;
        if (currentCount > 0) {
            const newCount = currentCount - 1;
            if (newCount === 0) {
                this.items.delete(sku);
            } else {
                this.items.set(sku, newCount);
            }
        }
    }

    getItemCount(sku: string): number {
        return this.items.get(sku) || 0;
    }

    getAllItems(): Map<string, number> {
        return new Map(this.items);
    }

    calculateTotal(items: InventoryItem[], promotions: IPromotion[]): number {
        let total = 0;
        this.items.forEach((count, sku) => {
            const item = items.find(i => i.sku === sku);
            if (!item) return;

            const promotion = promotions.find(p => p.sku === sku);
            const itemTotal = promotion?.isActive
                ? promotion.apply(count, item.price)
                : count * item.price;

            total += itemTotal;
        });
        return total;
    }

    isEmpty(): boolean {
        return this.items.size === 0;
    }
} 