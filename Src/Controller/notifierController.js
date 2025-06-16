import * as Notifier from '../Application/notifier.js';
export class NotifierController {
    constructor(cache, eventQueue) {
        this.cache = cache;
        this.eventQueue = eventQueue;
    }
    /**
     * @memberOf NotifierService.Src.Controller.notifierController
     * @summary Retrive an price-factor from queue and process it
     * @description Retrive an price-factor from queue and process it
     * @param {Object} orderObj price-factor object
     * @return {Promise} Promise 
     */
    async newFactor(factorString) {
        const factorObj = JSON.parse(orderString.data);
        console.log("xcccccccccccc", factorObj);
        const criticalInventory = Notifier.checkIfInventoryIsLow(factorObj.remainingGoldPercentage);
        if (criticalInventory)
            await Notifier.addToAdminQueue({ inventoryRemainingPercentage: factorObj.remainingGoldPercentage }, this.eventQueue);
        const factor = Notifier.createUserFactor(factorObj.amount, factorObj.price, factorObj.username);
        Notifier.addToFactorQueue(factor, this.eventQueue);
    }
}