import Router from 'koa-router'
import { Roles } from '../modules/roles.js'
import { StatusCodes } from '../modules/statusCodes.js'
import { Helpers } from '../helpers/helpers.js'
import { Orders } from '../modules/orders.js'
const dbName = 'website.db'

const secureRouter = new Router({ prefix: '/secure' })

secureRouter.get('/', async ctx => {
	try {
		if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
		const helper = new Helpers()

		//Calculating how many hours the current user has worked so far
		ctx.hbs.hoursWorked = await helper.getHoursWorked(ctx.hbs.loginTime)

		await ctx.render('secure', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The script to get all roles.
 *
 * @name Get Roles Script
 * @route {GET} /roles
 */
secureRouter.get('/roles', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	if (ctx.hbs.role.name !== 'admin') return ctx.redirect('/secure?msg=not an admin')

	const roles = await new Roles(dbName)
	try {
		const rows = await roles.getRoles()
		ctx.hbs.body = rows

	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		roles.close()
	}
})

/**
 * The script to get all orders.
 *
 * @name Get Orders Script
 * @route {GET} /orders
 */
secureRouter.get('/orders', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	const orders = await new Orders(dbName)
	try {
		const rows = await orders.getOrders()
		ctx.hbs.orders = rows
		await ctx.render('orders', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		orders.close()
	}
})

/**
 * The order create form.
 *
 * @name OrderCreate Page
 * @route {GET} /orders/create
 */
secureRouter.get('/orders/create', async ctx => {
	await ctx.render('orders-create', ctx.hbs)
})

/**
 * The script to add a new order.
 *
 * @name Post Order Creation Script
 * @route {POST} /orders
 */
secureRouter.post('/orders/create', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	const orders = await new Orders(dbName)
	try {
		const { body } = ctx.request
		await orders.addOrder(body)
		await ctx.redirect('/secure/orders?msg=order successfully created')
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		orders.close()
	}
})

/**
 * The script to add a new order.
 *
 * @name Post Order Creation Script
 * @route {POST} /orders
 */
secureRouter.post('/orders/:id([0-9])', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	const orders = await new Orders(dbName)
	const statusCodes = await new StatusCodes(dbName);
	const { id } = ctx.params;
	try {
		const statusCode = await statusCodes.getStatusCodeByName("prepared")
		await orders.updateStatus(id, statusCode.id)
		await ctx.redirect('/secure/orders?msg=order status successfully updated')
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		orders.close()
	}
})

export { secureRouter }
