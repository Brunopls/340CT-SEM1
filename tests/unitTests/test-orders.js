import test from 'ava'
import { Orders } from '../../modules/orders.js'

test.beforeEach(async t => {
	t.context = {
		orders: await new Orders(),
		mockOrder: {
			tableNumber: 1,
			numDiners: 1,
			statusCode: 1,
			time: Date.now(),
			totalPrice: 10,
			totalIngredientsCost: 5,
		}
	}
})

test.afterEach(t => {
	t.context.orders.close()
})

test('ORDERS : true records retrieved', async t => {
	try {
		await t.context.orders.addOrder(t.context.mockOrder)

		const result = await t.context.orders.getOrders()

		t.is(result.length, 1, 'successfully fetched records')
	} catch (err) {
		t.fail('failed to fetch records')
	}
})

test('ORDERS : false if invalid order ID', async t => {
	try {
		await t.context.orders.getOrder(12412)

		t.fail('successfully fetched record')
	} catch (err) {
		t.is(err.message, 'No matching id', 'failed to fetch record')
	}
})

test('ORDERS : true if record added', async t => {
	try {
		const result = await t.context.orders.addOrder(t.context.mockOrder)

		t.is(result, true, 'successfully added record')
	} catch (err) {
		t.fail('failed to add record')
	}
})

test('ORDERS : true if record status updated', async t => {
	try {
		await t.context.orders.addOrder(t.context.mockOrder)
		await t.context.orders.updateStatus(1, 2)

		const result = await t.context.orders.getOrder(1)

		t.is(result.statusCode, 2, 'successfully updated record status')
	} catch (err) {
		t.fail('failed to update record status')
	}
})

test('ORDERS : true if record deleted', async t => {
	try {
		await t.context.orders.addOrder(t.context.mockOrder)

		const result = await t.context.orders.deleteOrder(1)

		t.is(result, true, 'successfully deleted record')
	} catch (err) {
		t.fail('failed to delete record')
	}
})
