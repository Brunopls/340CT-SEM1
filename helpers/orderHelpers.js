import { Orders } from '../modules/orders.js'
import { OrderChoices } from '../modules/orderChoices.js'
import { MainDishes } from '../modules/mainDishes.js'
import { SideDishes } from '../modules/sideDishes.js'
import { Roles } from '../modules/roles.js'
import { StatusCodes } from '../modules/statusCodes.js'
const dbName = 'website.db'

class OrderHelpers {

    /**
     * calculates how many hours it's been since the user logged in.
     * @param {Integer} date the user logged in in milliseconds
     * @returns {Float} rounded decimal value of hours worked since the user logged in.
     */
    async getHoursWorked(loginTime) {
        return ((Date.now() - loginTime) / (1000 * 60 * 60) % 24).toFixed(2)
    }

    async getOrderObject(body) {
        const statusCodes = await new StatusCodes(dbName)

        const statusCode = await statusCodes.getStatusCodeByName('placed')
        const date = new Date()

        body.choices = JSON.parse(body.choices)
        
        let totalPrice = await this.getTotalPrice(body)
        let totalIngredientsCost = await this.getTotalIngredientsCost(body)

        return {
            tableNumber: parseInt(body.tableNumber),
            numDiners: parseInt(body.numDiners),
            statusCode: statusCode.id,
            time: date.toLocaleString(),
            totalPrice: totalPrice,
            totalIngredientsCost: totalIngredientsCost,
        }
    }

    async getTotalPrice(body) {
        const mainDishes = await new MainDishes(dbName)
        let totalPrice = 0;
        for (let choice = 0; choice < body.choices.length; choice++) {
            const dish = await mainDishes.getMainDish(body.choices[choice])
            totalPrice = totalPrice + dish.price
        }
        return totalPrice;
    }

    async getTotalIngredientsCost(body) {
        const mainDishes = await new MainDishes(dbName)
        let totalIngredientsCost = 0;
        for (let choice = 0; choice < body.choices.length; choice++) {
            const dish = await mainDishes.getMainDish(body.choices[choice])
            totalIngredientsCost = totalIngredientsCost + dish.ingredientsCost
        }
        return totalIngredientsCost;
    }

    async getOrderChoiceObject(body, choice, orderID) {
        const mainDishes = await new MainDishes(dbName)
        const dish = await mainDishes.getMainDish(body.choices[choice])
        return {
            mainDishID: dish.mainDishID,
            orderID: orderID,
            quantity: 1,
            price: await this.getTotalPrice(body),
            ingredientsCost: await this.getTotalIngredientsCost(body)
        }
    }

}

export { OrderHelpers }
