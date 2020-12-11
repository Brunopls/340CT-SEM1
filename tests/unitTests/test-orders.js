import t from 'ava'
import { Orders } from '../../modules/orders.js'

test('ORDERS : error if invalid order ID', async t => {
	try {
        const order = await new Orders('t-website.db')
        const result = order.getOrder(12412);
        t.is(result.succeeded, true, "result fetched successfully")

	} catch (err) {
		t.is(err.message, 'No matching id', 'incorrect error message')
	} finally {
        order.close();
	}
})
