import test from 'ava'
import { MainDishSides } from '../../modules/mainDishSides.js'
import { MainDishes } from '../../modules/mainDishes.js'
import { SideDishes } from '../../modules/sideDishes.js'
import faker from 'faker'

test.beforeEach(async t => {
	t.context = {
		mainDishes: await new MainDishes(),
		sideDishes: await new SideDishes(),
		mainDishSides: await new MainDishSides(),
		mockDish: {
			name: faker.lorem.words(),
			photo: faker.image.food(),
			price: 5,
			ingredientsCost: 2
		},
		mockMainDishSide: {
			mainDishID: 1,
			sideDishID: 1,
		}
	}
})

test.afterEach(t => {
	t.context.mainDishes.close()
	t.context.sideDishes.close()
	t.context.mainDishSides.close()
})

test('MAIN DISHES SIDES : true records retrieved', async t => {
	try {
		await t.context.mainDishes.addMainDish(t.context.mockDish)
		await t.context.sideDishes.addSideDish(t.context.mockDish)
		await t.context.mainDishSides.addMainDishSide(t.context.mockMainDishSide)

		const result = await t.context.mainDishSides.getMainDishSides(1)

		t.is(result.length, 1, 'successfully fetched records')
	} catch (err) {
		console.log(err)
		t.fail('failed to fetch records')
	}
})
