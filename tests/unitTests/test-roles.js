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

test('ROLES : error if no records in table', async t => {
	try {
		const result = await t.context.roles.getRoles()
		
		t.is(result.length, 0, 'no records in table')
	} catch (err) {
		t.is(err.message, 'No records found in \'roles\'.\'', 'incorrect error message')
	}
})
