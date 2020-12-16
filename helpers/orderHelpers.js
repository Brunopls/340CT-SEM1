import { Orders } from '../modules/orders.js'
import { OrderChoices } from '../modules/orderChoices.js'
import { MainDishes } from '../modules/mainDishes.js'
import { SideDishes } from '../modules/sideDishes.js'
import { Roles } from '../modules/roles.js'
import { StatusCodes } from '../modules/statusCodes.js'
const dbName = 'website.db'

class OrderHelpers {

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

    async changeDateToHHMMFormat(date) {
        const newDate = new Date(date)
        const hours = () => {
            if(newDate.getHours() < 10)
            return `0${newDate.getHours()}`
            else
            return newDate.getHours()
        }

        const minutes = () => {
            if(newDate.getMinutes() < 10)
            return `0${newDate.getMinutes()}`
            else
            return newDate.getMinutes()
        }

        return `${hours()}:${minutes()}`
    }
}

export { OrderHelpers }
