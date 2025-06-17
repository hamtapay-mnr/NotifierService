import * as Notifier from '../Application/notifier.js';
export class NotifierController {
    constructor(cache, eventQueue, adminEventQueue) {
        this.cache = cache;
        this.eventQueue = eventQueue;
        this.adminEventQueue = adminEventQueue;
    }

    /**
     * @memberOf NotifierService.Src.Controller.notifierController
     * @summary Retrive an price-factor from queue and process it
     * @description Retrive an price-factor from queue and process it
     * @param {Object} orderObj price-factor object
     * @return {Promise} Promise 
     */
    async newFactor(factorString) {
        const factorObj = JSON.parse(factorString.data);
        console.log("Recieved new factor: ", factorObj);
        const criticalInventory = Notifier.checkIfInventoryIsLow(factorObj.remainingGoldPercentage);
        if (criticalInventory) {
            await Notifier.addToQueue({ inventoryRemainingPercentage: factorObj.remainingGoldPercentage }, this.adminEventQueue);
            await this.cache.setAdminWarning(true); // optionally use EX
        }
        const factor = Notifier.createUserFactor(factorObj.amount, factorObj.price, factorObj.username);
        Notifier.addToFactorQueue(factor, this.eventQueue);
    }
}