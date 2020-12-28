import test from 'ava'
import { SideDishes } from '../../modules/sideDishes.js'
import faker from 'faker'

test('SIDE DISHES : true if record created successfully', async t => {
	const dish = await new SideDishes()
	try {
		const newSideDish = {
			name: faker.lorem.words(),
			photo: faker.image.food(),
			price: 5,
			ingredientsCost: 2
		}
		const result = await dish.addSideDish(newSideDish)

		t.is(result, true, 'added successfully')

	} catch (err) {
		t.is(err.message, 'No matching id', 'incorrect error message')
	} finally {
		dish.close()
	}
})
