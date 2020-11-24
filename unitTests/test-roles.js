import test from 'ava'
import { Roles } from '../modules/roles.js'

test('ROLES : error if invalid role ID', async test => {
	test.plan(1)
	const role = await new Roles('test-website.db')
	try {
		await role.getRole(99)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'No matching id', 'incorrect error message')
	} finally {
		role.close()
	}
})
