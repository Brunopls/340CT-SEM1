import test from 'ava'
import { Accounts } from '../../modules/accounts.js'

test.beforeEach(async t => {
	t.context = {
		account: await new Accounts()
	}
})

test.afterEach(t => {
	t.context.account.close()
})

test('REGISTER : register and log in with a valid account', async t => {
	try {
		await t.context.account.register('test', 'test123', 'test@gmail.com')
		const result = await t.context.account.login('test', 'test123')

		t.is(result, true, 'registered successfully')
	} catch (err) {
		t.fail(err.message)
	}
})

test('REGISTER : register a duplicate username', async t => {
	try {
		await t.context.account.register('doej', 'password', 'doej@gmail.com')
		await t.context.account.register('doej', 'password', 'doej@gmail.com')

		t.fail('error not thrown')
	} catch(err) {
		t.is(err.message, 'username "doej" already in use', 'incorrect error message')
	}
})

test('REGISTER : error if blank username', async t => {
	try {
		await t.context.account.register('', 'password', 'doej@gmail.com')

		t.fail('error not thrown')
	} catch(err) {
		t.is(err.message, 'missing field', 'incorrect error message')
	}
})

test('REGISTER : error if blank password', async t => {
	try {
		await t.context.account.register('doej', '', 'doej@gmail.com')

		t.fail('error not thrown')
	} catch(err) {
		t.is(err.message, 'missing field', 'incorrect error message')
	}
})

test('REGISTER : error if blank email', async t => {
	try {
		await t.context.account.register('doej', 'password', '')

		t.fail('error not thrown')
	} catch(err) {
		t.is(err.message, 'missing field', 'incorrect error message')
	}
})

test('REGISTER : error if duplicate email', async t => {
	try {
		await t.context.account.register('doej', 'password', 'doej@gmail.com')
		await t.context.account.register('bloggsj', 'newpassword', 'doej@gmail.com')

		t.fail('error not thrown')
	} catch(err) {
		t.is(err.message, 'email address "doej@gmail.com" is already in use', 'incorrect error message')
	}
})

test('LOGIN    : valid user', async t => {
	try {
		await t.context.account.register('test', 'test123', 'test@gmail.com')
		const result = await t.context.account.login('test', 'test123')

		t.is(result, true, 'login successful')
	} catch(err) {
		t.fail('login failed')
	}
})

test('LOGIN    : invalid username', async t => {
	try {
		await t.context.account.register('doej', 'password', 'doej@gmail.com')
		await t.context.account.login('roej', 'password')

		t.fail('error not thrown')
	} catch(err) {
		t.is(err.message, 'username "roej" not found', 'incorrect error message')
	}
})

test('LOGIN    : invalid password', async t => {
	try {
		await t.context.account.register('doej', 'password', 'doej@gmail.com')
		await t.context.account.login('doej', 'bad')

		t.fail('error not thrown')
	} catch(err) {
		t.is(err.message, 'invalid password for account "doej"', 'incorrect error message')
	}
})

test('ROLE    : valid username', async t => {
	try {
		await t.context.account.register('test', 'test123', 'test@gmail.com')

		const result = await t.context.account.getRoleID('test')

		t.is(result, 4, 'valid role returned')
	} catch(err) {
		t.fail('invalid role returned')
	}
})

test('ROLE    : invalid username', async t => {
	try {
		const result = await t.context.account.getRoleID('test')

		if(result) t.fail('retrieved record')
	} catch(err) {
		t.is(err.message, 'username "test" not found', 'failed to retrieve records')
	}
})
