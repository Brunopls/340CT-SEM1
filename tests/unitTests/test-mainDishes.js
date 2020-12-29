import test from 'ava'
import { MainDishes } from '../../modules/mainDishes.js'
import faker from 'faker'

test.beforeEach(async t => {
	t.context = {
		mainDishes: await new MainDishes(),
		mockDish: {
			name: faker.lorem.words(),
			photo: faker.image.food(),
			price: 5,
			ingredientsCost: 2
		}
	}
})

test.afterEach(t => {
	t.context.mainDishes.close()
})

test('MAIN DISHES : true if record created successfully', async t => {
	try {
		const result = await t.context.mainDishes.addMainDish(t.context.mockDish)

		t.is(result, true, 'added successfully')
	} catch (err) {
		t.fail('Failed to add record')
	}
})

test('MAIN DISHES : true if records returned successfully', async t => {
	try {
		await t.context.mainDishes.addMainDish(t.context.mockDish)
		const result = await t.context.mainDishes.getMainDishes()

		t.is(result.length === 1, true, 'retrieved successfully')
	} catch (err) {
		t.fail('Failed to retrieve records')
	}
})

test('MAIN DISHES : true if record retrieved successfully', async t => {
	try {
		await t.context.mainDishes.addMainDish(t.context.mockDish)

		const result = await t.context.mainDishes.getMainDish(1)

		t.is(result.mainDishID, 1, 'retrieved successfully')
	} catch (err) {
		t.fail('Failed to retrieve record')
	}
})

test('MAIN DISHES : true if record updated successfully', async t => {
	try {
		await t.context.mainDishes.addMainDish(t.context.mockDish)

		const result = await t.context.mainDishes.updateDish(1, t.context.mockDish)

		t.is(result, true, 'updated successfully')
	} catch (err) {
		t.fail('Failed to update record')
	}
})
