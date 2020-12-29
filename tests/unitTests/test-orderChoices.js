import test from 'ava'
import { Orders } from '../../modules/orders.js'
import { OrderChoices } from '../../modules/orderChoices.js'
import { MainDishes } from '../../modules/mainDishes.js'
import faker from 'faker'

test.beforeEach(async t => {
	t.context = {
        orders: await new Orders(),
        orderChoices: await new OrderChoices(),
		mainDishes: await new MainDishes(),
		mockOrder: {
			tableNumber: 1,
			numDiners: 1,
			statusCode: 1,
			time: Date.now(),
			totalPrice: 10,
			totalIngredientsCost: 5,
        },
        mockDish: {
			name: faker.lorem.words(),
			photo: faker.image.food(),
			price: 5,
			ingredientsCost: 2
        },
        mockOrderChoice: {
            mainDishID: 1,
            orderID: 1,
            quantity: 1,
            price: 5,
            ingredientsCost: 2
        }
	}
})

test.afterEach(t => {
	t.context.orders.close()
	t.context.orderChoices.close()
	t.context.mainDishes.close()
})

test('ORDER CHOICES : true if record added', async t => {
	try {
		await t.context.orders.addOrder(t.context.mockOrder)
        await t.context.mainDishes.addMainDish(t.context.mockDish)
        
        const result = await t.context.orderChoices.addMainDishChoice(t.context.mockOrderChoice)
        
		t.is(result, true, 'successfully added record')
	} catch (err) {
		t.fail('failed to add record')
	}
})

test('ORDERS CHOICES : true if records retrieved', async t => {
	try {
        await t.context.orders.addOrder(t.context.mockOrder)
		await t.context.mainDishes.addMainDish(t.context.mockDish)
        await t.context.orderChoices.addMainDishChoice(t.context.mockOrderChoice)
        
        const result = await t.context.orderChoices.getOrderChoice(1)
        
		t.is(result.length, 1, 'successfully retrieved records')
	} catch (err) {
		t.fail('failed to retrieve records')
	}
})

test('ORDERS CHOICES : true if record deleted', async t => {
	try {
		await t.context.orders.addOrder(t.context.mockOrder)
		await t.context.mainDishes.addMainDish(t.context.mockDish)
        await t.context.orderChoices.addMainDishChoice(t.context.mockOrderChoice)
        
        const result = await t.context.orderChoices.deleteOrderChoices(1)
        
		t.is(result, true, 'successfully deleted record')
	} catch (err) {
		t.fail('failed to delete record')
	}
})
