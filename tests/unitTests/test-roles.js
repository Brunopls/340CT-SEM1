import test from 'ava'
import { Roles } from '../../modules/roles.js'

test.beforeEach(async t => {
	t.context = {
		roles: await new Roles(),
	}
})

test.afterEach(t => {
	t.context.roles.close()
})

test('ROLES : error if invalid role ID', async t => {
	try {
		await t.context.roles.getRole(99)

		t.fail('error not thrown')
	} catch (err) {
		t.is(err.message, 'No matching id', 'incorrect error message')
	}
})

test('ROLES : true if record retrieved', async t => {
	try {
		const db = await new Roles('test-website.db')
		const result = await db.getRole(1)
		t.is(result.id, 1, 'successfully retrieved record')
	} catch (err) {
		t.fail('failed to retrieve record')
	}
})

test('ROLES : true if records retrieved', async t => {
	try {
		const db = await new Roles('test-website.db')
		const result = await db.getRoles()
		t.is(result.length > 0, true, 'successfully retrieved records')
	} catch (err) {
		t.fail('failed to retrieve records')
	}
})

test('ROLES : error if no record retrieved', async t => {
	try {
		const db = await new Roles('test-website.db')
		const result = await db.getRole(1)
		t.is(result.id, 1, 'successfully retrieved record')
	} catch (err) {
		t.fail('failed to retrieve record')
	}
})

test('ROLES : error if no records retrieved', async t => {
	try {
		const result = await t.context.roles.getRoles()
		if(result) t.fail('retrieved records')
	} catch (err) {
		t.is(err.message, 'No records found in \'roles\'.\'', 'failed to retrieve records')
	}
})
