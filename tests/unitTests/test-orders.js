import test from 'ava'
import { Orders } from '../../modules/orders.js'

test('ORDERS : error if invalid order ID', async t => {
	const order = await new Orders('test-website.db')
	try {
		const result = await order.getOrder(12412)
		t.is(result, undefined, 'failed to fetch result, as intended')

	} catch (err) {
		t.is(err.message, 'No matching id', 'incorrect error message')
	} finally {
		order.close()
	}
})
