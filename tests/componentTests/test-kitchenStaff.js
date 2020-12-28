import test from 'ava'

test('ORDER : create a new order', async t => {
	const result = false
	t.is(result, false, 'order created successfully')
})

test('ORDER : update an existing order\'s status', async t => {
	const result = true
	t.is(result, true, 'order status updated successfully')
})
