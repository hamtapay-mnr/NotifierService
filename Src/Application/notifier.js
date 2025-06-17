/**
 * @memberOf NotifierService.Src.Application.notifier
 * @summary Check if we have low gold in inventory
 * @description Check if we have low gold in inventory
 * @param {Number} assetPercentage percentage of current asset
 * @return {Boolean} Boolean true if inventory is low, else false
 */
export async function checkIfInventoryIsLow(assetPercentage, cache, eventQueue) {
    if (assetPercentage < 5) {
        const alreadySent = await cache.getAdminWarning();
        const hasPending = await eventQueue.hasPendingMessages();
        return alreadySent == '0' && !hasPending;
    }
    else return false;
}
/**
 * @memberOf NotifierService.Src.Application.notifier
 * @summary Create factor for user
 * @description Create factor for user based on recieved event
 * @param {Number} amount amount of asset
 * @param {Number} price total price
 * @param {String} username username
 * @return {Object} User factor object
 */
export function createUserFactor(amount, price, username) {
    return {
        username, price, amount
    };
}
/**
 * @memberOf NotifierService.Src.Application.notifier
 * @summary Send a notif to admin
 * @description Send a notif to admin, only one time after reaching critical value
 * @param {Object} data data to enqueue!
 * @param {Object} queue queue object
 * @return {Promise<>} Promise 
 */
export async function addToQueue(data, eventQueue) {
    await eventQueue.publishEvent(data);
}
