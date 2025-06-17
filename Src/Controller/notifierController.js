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
        const criticalInventory = await Notifier.checkIfInventoryIsLow(factorObj.remainingGoldPercentage, this.cache, this.adminEventQueue);
        if (criticalInventory) {
            const adminWarningObject = { inventoryRemainingPercentage: factorObj.remainingGoldPercentage };
            console.log("Send warning to admin: ", adminWarningObject);
            await Notifier.addToQueue(adminWarningObject, this.adminEventQueue);
            await this.cache.setAdminWarning("1"); // optionally use EX
        }
        const factor = Notifier.createUserFactor(factorObj.amount, factorObj.price, factorObj.username);
        console.log("New factor: ", factor);
        Notifier.addToQueue(factor, this.eventQueue);
    }
}