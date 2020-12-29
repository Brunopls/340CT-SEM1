import test from 'ava'
import { Orders } from '../../modules/orders.js'
import { OrderChoices } from '../../modules/orderChoices.js'
import { OrderChoicesSides } from '../../modules/orderChoicesSides.js'
import { MainDishes } from '../../modules/mainDishes.js'
import { SideDishes } from '../../modules/sideDishes.js'
import faker from 'faker'

test.beforeEach(async t => {
	t.context = {
		orders: await new Orders(),
		orderChoices: await new OrderChoices(),
		orderChoicesSides: await new OrderChoicesSides(),
		mainDishes: await new MainDishes(),
		sideDishes: await new SideDishes(),
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
		},
		mockOrderChoiceSides: {
			choiceID: 1,
			sideDishID: 1,
			quantity: 1,
			price: 5,
			ingredientsCost: 2
		}
	}
})

test.afterEach(t => {
	t.context.orders.close()
	t.context.orderChoices.close()
	t.context.orderChoicesSides.close()
	t.context.mainDishes.close()
})

test('ORDER CHOICES SIDES : true if record added', async t => {
	try {
		await t.context.orders.addOrder(t.context.mockOrder)
		await t.context.mainDishes.addMainDish(t.context.mockDish)
		await t.context.sideDishes.addSideDish(t.context.mockDish)
		await t.context.orderChoices.addMainDishChoice(t.context.mockOrderChoice)

		const result = await t.context.orderChoicesSides.addSideDishChoice(t.context.mockOrderChoiceSides)

		t.is(result, true, 'successfully added record')
	} catch (err) {
		t.fail('failed to add record')
	}
})

test('ORDER CHOICES SIDES : true if records retrieved', async t => {
	try {
		await t.context.orders.addOrder(t.context.mockOrder)
		await t.context.mainDishes.addMainDish(t.context.mockDish)
		await t.context.sideDishes.addSideDish(t.context.mockDish)
		await t.context.orderChoices.addMainDishChoice(t.context.mockOrderChoice)
		await t.context.orderChoicesSides.addSideDishChoice(t.context.mockOrderChoiceSides)

		const result = await t.context.orderChoicesSides.getOrderChoiceSides(1)

		t.is(result.length, 1, 'successfully retrieved records')
	} catch (err) {
		console.log(err)
		t.fail('failed to retrieve records')
	}
})

test('ORDER CHOICES SIDES : error if no records retrieved', async t => {
	try {
		const result = await t.context.orderChoicesSides.getOrderChoiceSides(1)
		if(result) t.fail('retrieved records')
	} catch (err) {
		t.is(err.message, 'No matching id', 'failed to retrieve records')
	}
})

test('ORDER CHOICES SIDES : false if record not added', async t => {
	const result = await t.context.orderChoicesSides.addSideDishChoice()

	t.is(result, false, 'failed to add record')
})
