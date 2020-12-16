import test from 'ava'
import { MainDishes } from '../../modules/mainDishes.js'
import faker from 'faker'

test('MAIN DISHES : true if record created successfully', async t => {
	const dish = await new MainDishes('test-website.db')
	try {
		const newDish = {
			name: faker.lorem.words(),
			photo: faker.image.food(),
			price: 5,
			ingredientsCost: 2
		}
		const result = await dish.addMainDish(newDish)

		t.is(result, true, 'added successfully')

	} catch (err) {
		t.is(err.message, 'No matching id', 'incorrect error message')
	} finally {
		dish.close()
	}
})
