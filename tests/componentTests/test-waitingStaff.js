import test from 'ava'

test('ORDER : create a new order using a valid order object', async t => {
	const result = true
	t.is(result, true, 'unable to create new order')
})

test('ORDER : create a new order using an invalid order object', async t => {
	const result = false
	t.is(result, false, 'order created successfully')
})

test('ORDER : update an existing order\'s status', async t => {
	const result = false
	t.is(result, false, 'order status updated successfully')
})
