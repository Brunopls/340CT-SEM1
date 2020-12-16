import { StatusCodes } from '../modules/statusCodes.js'
const dbName = 'website.db'

class StatusHelpers {

    async getStatusCodeName(statusCode) {
        const statusCodes = await new StatusCodes(dbName)
        const status = await statusCodes.getStatusCode(statusCode)
        return status.name;
    }

    async changeStatusCodesToStatusNames(orders) {
        for (let order of orders) {
            order.statusCode = await this.getStatusCodeName(order.statusCode)
        }
        return orders;
    }

    async changeStatusCodeToStatusName(order) {
        order.statusCode = await this.getStatusCodeName(order.statusCode)
        return order;
    }
    
}

export { StatusHelpers }