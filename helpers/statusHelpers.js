import { StatusCodes } from '../modules/statusCodes.js'
import { OrderHelpers } from '../helpers/orderHelpers.js'

const dbName = 'website.db'

/**
 *
 *
 * @class helpers/StatusHelpers
 */
class StatusHelpers {

    /**
     *
     * @param {Integer} statusCode ID of the status code
     * @return {String} name of the status code
     * @memberof helpers/StatusHelpers
     */
    async getStatusCodeName(statusCode) {
        const statusCodes = await new StatusCodes(dbName)
        const status = await statusCodes.getStatusCode(statusCode)
        return status.name;
    }

    /**
     *
     *
     * @param {Object} orders array of order objects
     * @return {Object} array of order objects with statusCode and time fields converted to a more readable format
     * @memberof helpers/StatusHelpers
     */
    async changeStatusCodesToStatusNames(orders) {
        const orderHelper = new OrderHelpers();
        for (let order of orders) {
            order.statusCode = await this.getStatusCodeName(order.statusCode)
            order.time = await orderHelper.changeDateToHHMMFormat(order.time)
        }
        return orders;
    }

    /**
     *
     * @param {Object} order order object
     * @return {Object} order object with statusCode and time fields converted to a more readable format
     * @memberof helpers/StatusHelpers
     */
    async changeStatusCodeToStatusName(order) {
        const orderHelper = new OrderHelpers();
        order.statusCode = await this.getStatusCodeName(order.statusCode)
        order.time = await orderHelper.changeDateToHHMMFormat(order.time)
        return order;
    }
    
}

export { StatusHelpers }