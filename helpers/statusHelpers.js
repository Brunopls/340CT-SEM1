import { StatusCodes } from '../modules/statusCodes.js'
import { OrderHelpers } from '../helpers/orderHelpers.js'

const dbName = 'website.db'

class StatusHelpers {

    async getStatusCodeName(statusCode) {
        const statusCodes = await new StatusCodes(dbName)
        const status = await statusCodes.getStatusCode(statusCode)
        return status.name;
    }

    async changeStatusCodesToStatusNames(orders) {
        const orderHelper = new OrderHelpers();
        for (let order of orders) {
            order.statusCode = await this.getStatusCodeName(order.statusCode)
            order.time = await orderHelper.changeDateToHHMMFormat(order.time)
        }
        return orders;
    }

    async changeStatusCodeToStatusName(order) {
        const orderHelper = new OrderHelpers();
        order.statusCode = await this.getStatusCodeName(order.statusCode)
        order.time = await orderHelper.changeDateToHHMMFormat(order.time)
        return order;
    }
    
}

export { StatusHelpers }