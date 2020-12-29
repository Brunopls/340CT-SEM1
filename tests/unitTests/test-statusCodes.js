import test from 'ava'
import { StatusCodes } from '../../modules/statusCodes.js'

test.beforeEach(async t => {
	t.context = {
		statusCodes: await new StatusCodes(),
	}
})

test.afterEach(t => {
	t.context.statusCodes.close()
})

test('STATUS CODES : true if record added', async t => {
	try {
		const result = await t.context.statusCodes.addStatusCode('test')

		t.is(result, true, 'successfully added record')
	} catch (err) {
		t.fail('failed to add record')
	}
})

test('STATUS CODES : true if record retrieved by ID', async t => {
	try {
		await t.context.statusCodes.addStatusCode('test')

		const result = await t.context.statusCodes.getStatusCode(1)

		t.is(result.id, 1, 'successfully retrieved record')
	} catch (err) {
		t.fail('failed to retrieve record')
	}
})

test('STATUS CODES : true if record retrieved by name', async t => {
	try {
		await t.context.statusCodes.addStatusCode('test')

		const result = await t.context.statusCodes.getStatusCodeByName('test')

		t.is(result.name, 'test', 'successfully retrieved record')
	} catch (err) {
		t.fail('failed to retrieve record')
	}
})

test('STATUS CODES : true if records retrieved', async t => {
	try {
		await t.context.statusCodes.addStatusCode('test')

		const result = await t.context.statusCodes.getStatusCodes()

		t.is(result.length, 1, 'successfully retrieved records')
	} catch (err) {
		t.fail('failed to retrieve records')
	}
})

test('STATUS CODES : false if record not added', async t => {
	const result = await t.context.statusCodes.addStatusCode()

	t.is(result, false, 'failed to add record')
})

test('STATUS CODES : false if status code not returned by name', async t => {
	try {
		const result = await t.context.statusCodes.getStatusCodeByName('test')
		if(result) t.fail('retrieved record')
	} catch (err) {
		t.is(err.message, 'No matching id', 'failed to retrieve record')
	}
})

test('STATUS CODES : false if status code not returned by ID', async t => {
	try {
		const result = await t.context.statusCodes.getStatusCode(99)
		if(result) t.fail('retrieved record')
	} catch (err) {
		t.is(err.message, 'No matching id', 'failed to retrieve record')
	}
})

test('STATUS CODES : false if status codes not retrieved', async t => {
	try {
		const result = await t.context.statusCodes.getStatusCodes()
		if(result) t.fail('retrieved records')
	} catch (err) {
		t.is(err.message, 'No records found in \'statusCodes\'.\'', 'failed to retrieve records')
	}
})
