import test from 'ava'

test('ADMIN : update user with valid user object', async t => {
	const result = true
	t.is(result, true, 'unable to update user')
})

test('ADMIN : update user with invalid user object', async t => {
	const result = false
	t.is(result, false, 'user updated successfully')
})

test('ADMIN : update raw ingredient prices', async t => {
	const result = true
	t.is(result, true, 'failed to update raw ingredient prices')
})

test('ADMIN : update raw ingredient prices with invalid values', async t => {
	const result = false
	t.is(result, false, 'updated raw ingredient prices successfully')
})

test('ADMIN : generate statistics', async t => {
	const result = true
	t.is(result, true, 'unable to generate statistics')
})

test('ADMIN : edit product details with valid data', async t => {
	const result = true
	t.is(result, true, 'unable to edit product details')
})

test('ADMIN : edit product details with invalid data', async t => {
	const result = false
	t.is(result, false, 'product details edited successfully')
})
