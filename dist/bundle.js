"use strict";
(() => {
  // src/data/staticData.ts
  var inventoryData = [
    { "sku": "A0001", "name": "Artikel A0001", "price": 12.99 },
    { "sku": "A0002", "name": "Artikel A0002", "price": 3.99 },
    { "sku": "A0003", "name": "Artikel A0003", "price": 10 }
  ];
  var promotionsData = [
    { "sku": "A0002", "type": "buyOneGetOneFree" },
    { "sku": "A0001", "type": "tenPercentOff" }
  ];

  // src/services/inventoryService.ts
  var InventoryService = class {
    constructor() {
      this.items = [];
    }
    loadInventory() {
      this.items = inventoryData;
    }
    getAllItems() {
      return this.items;
    }
    getItem(sku) {
      return this.items.find((item) => item.sku === sku);
    }
  };

  // src/models/promotion.ts
  var BuyOneGetOneFreePromotion = class {
    constructor(sku, type, isActive = true) {
      this.sku = sku;
      this.type = type;
      this.isActive = isActive;
    }
    apply(count, unitPrice) {
      if (!this.isActive)
        return count * unitPrice;
      const freeItems = Math.floor(count / 2);
      return (count - freeItems) * unitPrice;
    }
  };
  var TenPercentOffPromotion = class {
    constructor(sku, type, isActive = true) {
      this.sku = sku;
      this.type = type;
      this.isActive = isActive;
    }
    apply(count, unitPrice) {
      if (!this.isActive)
        return count * unitPrice;
      return count * unitPrice * 0.9;
    }
  };

  // src/services/promotionService.ts
  var PromotionService = class {
    constructor() {
      this.promotions = [];
    }
    loadPromotions() {
      this.promotions = promotionsData.map((promo) => {
        switch (promo.type) {
          case "buyOneGetOneFree" /* BuyOneGetOneFree */:
            return new BuyOneGetOneFreePromotion(promo.sku, "buyOneGetOneFree" /* BuyOneGetOneFree */);
          case "tenPercentOff" /* TenPercentOff */:
            return new TenPercentOffPromotion(promo.sku, "tenPercentOff" /* TenPercentOff */);
          default:
            throw new Error(`Unknown promotion type: ${promo.type}`);
        }
      });
    }
    getPromotions() {
      return this.promotions;
    }
    getPromotionForSku(sku) {
      return this.promotions.find((promo) => promo.sku === sku);
    }
  };

  // src/models/basket.ts
  var Basket = class {
    constructor() {
      this.items = /* @__PURE__ */ new Map();
    }
    addItem(sku) {
      const currentCount = this.items.get(sku) || 0;
      this.items.set(sku, currentCount + 1);
    }
    removeItem(sku) {
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
    getItemCount(sku) {
      return this.items.get(sku) || 0;
    }
    getAllItems() {
      return new Map(this.items);
    }
    calculateTotal(items, promotions) {
      let total = 0;
      this.items.forEach((count, sku) => {
        const item = items.find((i) => i.sku === sku);
        if (!item)
          return;
        const promotion = promotions.find((p) => p.sku === sku);
        const itemTotal = promotion?.isActive ? promotion.apply(count, item.price) : count * item.price;
        total += itemTotal;
      });
      return total;
    }
    isEmpty() {
      return this.items.size === 0;
    }
  };

  // src/services/basketService.ts
  var BasketService = class {
    constructor(inventoryService) {
      this.inventoryService = inventoryService;
      this.basket = new Basket();
    }
    addItem(sku) {
      this.basket.addItem(sku);
    }
    removeItem(sku) {
      this.basket.removeItem(sku);
    }
    getItemCount(sku) {
      return this.basket.getItemCount(sku);
    }
    getTotal(promotions) {
      return this.basket.calculateTotal(
        this.inventoryService.getAllItems(),
        promotions
      );
    }
    getBasketItems() {
      const items = {};
      this.basket.getAllItems().forEach((count, sku) => {
        items[sku] = count;
      });
      return items;
    }
  };

  // src/app.ts
  var ShoppingApp = class {
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
    renderInventory() {
      const inventoryList = document.getElementById("inventory-list");
      if (!inventoryList)
        return;
      const items = this.inventoryService.getAllItems();
      items.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "col-md-6 col-lg-4";
        itemElement.innerHTML = `
                <div class="inventory-item card h-100 shadow-sm">
                    <div class="card-body">
                        <h3 class="card-title h5">${item.name}</h3>
                        <p class="card-text text-primary fw-bold">${item.price.toFixed(2)} \u20AC</p>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div class="btn-group shadow-sm" role="group" aria-label="Warenkorb Steuerung">
                                <button class="btn btn-success" 
                                        aria-label="F\xFCge ${item.name} zum Warenkorb hinzu"
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
    renderPromotions() {
      const promotionsList = document.getElementById("promotions-list");
      if (!promotionsList)
        return;
      const promotions = this.promotionService.getPromotions();
      promotions.forEach((promotion) => {
        const item = this.inventoryService.getItem(promotion.sku);
        if (!item)
          return;
        const promotionElement = document.createElement("div");
        promotionElement.className = "list-group-item d-flex justify-content-between align-items-center";
        promotionElement.innerHTML = `
                <label class="form-check-label">
                    <input type="checkbox" 
                           class="form-check-input me-2"
                           ${promotion.isActive ? "checked" : ""}
                           onchange="app.togglePromotion('${promotion.sku}')">
                    ${item.name}: ${promotion.type}
                </label>
            `;
        promotionsList.appendChild(promotionElement);
      });
    }
    addToBasket(sku) {
      this.basketService.addItem(sku);
      this.updateItemCount(sku);
      this.updateTotal();
    }
    removeFromBasket(sku) {
      this.basketService.removeItem(sku);
      this.updateItemCount(sku);
      this.updateTotal();
    }
    updateItemCount(sku) {
      const countElement = document.getElementById(`count-${sku}`);
      if (countElement) {
        countElement.textContent = this.basketService.getItemCount(sku).toString();
      }
    }
    updateTotal() {
      const totalElement = document.getElementById("total");
      const cartElement = document.getElementById("cart-items");
      if (!totalElement || !cartElement)
        return;
      const basketItems = this.basketService.getBasketItems();
      if (Object.keys(basketItems).length === 0) {
        cartElement.innerHTML = '<p class="text-muted">Ihr Warenkorb ist leer</p>';
        totalElement.textContent = "Gesamtpreis: 0.00 \u20AC";
        return;
      }
      const cartItems = Object.entries(basketItems).map(([sku, count]) => {
        const item = this.inventoryService.getItem(sku);
        if (!item)
          return null;
        const promotion = this.promotionService.getPromotionForSku(sku);
        const itemTotal = promotion && promotion.isActive ? promotion.apply(count, item.price) : count * item.price;
        return `
                    <div class="cart-item d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <span class="fw-bold">${item.name}</span>
                            <span class="text-muted ms-2">${count}x</span>
                        </div>
                        <span class="text-end">${itemTotal.toFixed(2)} \u20AC</span>
                    </div>
                `;
      }).filter((item) => item !== null).join("");
      cartElement.innerHTML = cartItems;
      const total = this.basketService.getTotal(this.promotionService.getPromotions());
      totalElement.textContent = `Gesamtpreis: ${total.toFixed(2)} \u20AC`;
    }
    togglePromotion(sku) {
      const promotion = this.promotionService.getPromotionForSku(sku);
      if (promotion) {
        promotion.isActive = !promotion.isActive;
        this.updateTotal();
      }
    }
  };
  window.app = new ShoppingApp();
  window.app.init();
})();
