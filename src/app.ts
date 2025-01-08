import { InventoryService } from './services/inventoryService';
import { PromotionService } from './services/promotionService';
import { BasketService } from './services/basketService';

class ShoppingApp {
    private inventoryService: InventoryService;
    private promotionService: PromotionService;
    private basketService: BasketService;

    constructor() {
        this.inventoryService = new InventoryService();
        this.promotionService = new PromotionService();
        this.basketService = new BasketService(this.inventoryService);
    }

    init() {
        this.inventoryService.loadInventory();
        this.promotionService.loadPromotions();

        this.renderInventory();
        this.renderPromotions();
        this.updateTotal();
    }

    private renderInventory() {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) return;

        const items = this.inventoryService.getAllItems();
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'col-md-6 col-lg-4';
            itemElement.innerHTML = `
                <div class="inventory-item card h-100 shadow-sm">
                    <div class="card-body">
                        <h3 class="card-title h5">${item.name}</h3>
                        <p class="card-text text-primary fw-bold">${item.price.toFixed(2)} €</p>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div class="btn-group shadow-sm" role="group" aria-label="Warenkorb Steuerung">
                                <button class="btn btn-success" 
                                        aria-label="Füge ${item.name} zum Warenkorb hinzu"
                                        onclick="app.addToBasket('${item.sku}')">
                                    <i class="bi bi-bag-plus-fill"></i>
                                </button>
                                <span id="count-${item.sku}" class="item-count">0</span>
                                <button class="btn btn-danger"
                                        aria-label="Entferne ${item.name} aus dem Warenkorb"
                                        onclick="app.removeFromBasket('${item.sku}')">
                                    <i class="bi bi-bag-dash-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            inventoryList.appendChild(itemElement);
        });
    }

    private renderPromotions() {
        const promotionsList = document.getElementById('promotions-list');
        if (!promotionsList) return;

        const promotions = this.promotionService.getPromotions();
        promotions.forEach(promotion => {
            const item = this.inventoryService.getItem(promotion.sku);
            if (!item) return;

            const promotionElement = document.createElement('div');
            promotionElement.className = 'list-group-item d-flex justify-content-between align-items-center';
            promotionElement.innerHTML = `
                <label class="form-check-label">
                    <input type="checkbox" 
                           class="form-check-input me-2"
                           ${promotion.isActive ? 'checked' : ''}
                           onchange="app.togglePromotion('${promotion.sku}')">
                    ${item.name}: ${promotion.type}
                </label>
            `;
            promotionsList.appendChild(promotionElement);
        });
    }

    addToBasket(sku: string) {
        this.basketService.addItem(sku);
        this.updateItemCount(sku);
        this.updateTotal();
    }

    removeFromBasket(sku: string) {
        this.basketService.removeItem(sku);
        this.updateItemCount(sku);
        this.updateTotal();
    }

    private updateItemCount(sku: string) {
        const countElement = document.getElementById(`count-${sku}`);
        if (countElement) {
            countElement.textContent = this.basketService.getItemCount(sku).toString();
        }
    }

    private updateTotal() {
        const totalElement = document.getElementById('total');
        const cartElement = document.getElementById('cart-items');
        if (!totalElement || !cartElement) return;

        const basketItems = this.basketService.getBasketItems();
        if (Object.keys(basketItems).length === 0) {
            cartElement.innerHTML = '<p class="text-muted">Ihr Warenkorb ist leer</p>';
            totalElement.textContent = 'Gesamtpreis: 0.00 €';
            return;
        }

        const cartItems = Object.entries(basketItems)
            .map(([sku, count]) => {
                const item = this.inventoryService.getItem(sku);
                if (!item) return null;
                const promotion = this.promotionService.getPromotionForSku(sku);
                const itemTotal = promotion && promotion.isActive 
                    ? promotion.apply(count, item.price)
                    : count * item.price;
                return `
                    <div class="cart-item d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <span class="fw-bold">${item.name}</span>
                            <span class="text-muted ms-2">${count}x</span>
                        </div>
                        <span class="text-end">${itemTotal.toFixed(2)} €</span>
                    </div>
                `;
            })
            .filter(item => item !== null)
            .join('');

        cartElement.innerHTML = cartItems;

        const total = this.basketService.getTotal(this.promotionService.getPromotions());
        totalElement.textContent = `Gesamtpreis: ${total.toFixed(2)} €`;
    }

    togglePromotion(sku: string) {
        const promotion = this.promotionService.getPromotionForSku(sku);
        if (promotion) {
            promotion.isActive = !promotion.isActive;
            this.updateTotal();
        }
    }
}

// Global verfügbar machen für onclick Handler
declare global {
    interface Window {
        app: ShoppingApp;
    }
}

window.app = new ShoppingApp();
window.app.init(); 