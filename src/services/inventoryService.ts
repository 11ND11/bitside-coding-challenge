import { InventoryItem } from '../models/inventory';
import { inventoryData } from '../data/staticData';

export class InventoryService {
    private items: InventoryItem[] = [];

    loadInventory(): void {
        this.items = inventoryData;
    }

    getAllItems(): InventoryItem[] {
        return this.items;
    }

    getItem(sku: string): InventoryItem | undefined {
        return this.items.find(item => item.sku === sku);
    }
} 