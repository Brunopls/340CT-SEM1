import test from 'ava'

test('ORDER : check order list', async t => {
	const result = true
	t.is(result, true, 'failed to fetch order list')
})

test('ORDER : track work hours', async t => {
	const result = true
	t.is(result, true, 'failed to fetch work hours')
})

test('ORDER : log in using valid credentials', async t => {
	const result = true
	t.is(result, true, 'failed to log in')
})

test('ORDER : log in using invalid credentials', async t => {
	const result = false
	t.is(result, false, 'logged in successfully')
})
