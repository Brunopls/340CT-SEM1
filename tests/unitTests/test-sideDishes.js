import test from 'ava'
import { SideDishes } from '../../modules/sideDishes.js'
import faker from 'faker'

test.beforeEach(async t => {
	t.context = {
		sideDishes: await new SideDishes(),
		mockSideDish: {
			name: faker.lorem.words(),
			photo: faker.image.food(),
			price: 5,
			ingredientsCost: 2
		}
	}
})

test.afterEach(t => {
	t.context.sideDishes.close()
})

test('SIDE DISHES : true if records returned successfully', async t => {
	try {
		await t.context.sideDishes.addSideDish(t.context.mockSideDish)

		const result = await t.context.sideDishes.getSideDishes()

		t.is(result.length === 1, true, 'retrieved successfully')
	} catch (err) {
		t.fail('Failed to retrieve records')
	}
})

test('SIDE DISHES : true if record returned successfully', async t => {
	try {
		await t.context.sideDishes.addSideDish(t.context.mockSideDish)

		const result = await t.context.sideDishes.getSideDish(1)

		t.is(result.sideDishID, 1, 'retrieved successfully')
	} catch (err) {
		console.log(err)
		t.fail('Failed to retrieve records')
	}
})

test('SIDE DISHES : error if record not retrieved', async t => {
	try {
		const result = await t.context.sideDishes.getSideDish(99)
		if(result) t.fail('retrieved record')
	} catch (err) {
		t.is(err.message, 'No matching id', 'failed to retrieve record')
	}
})

test('SIDE DISHES : error if records not retrieved', async t => {
	try {
		const result = await t.context.sideDishes.getSideDishes()
		if(result) t.fail('retrieved records')
	} catch (err) {
		t.is(err.message, 'No records found in \'sideDishes\'.\'', 'failed to retrieve records')
	}
})
