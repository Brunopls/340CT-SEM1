import Router from 'koa-router'
import { Roles } from '../modules/roles.js'
import { StatusCodes } from '../modules/statusCodes.js'
import { Helpers } from '../helpers/helpers.js'
import { Orders } from '../modules/orders.js'
import { OrderChoices } from '../modules/orderChoices.js'
import { MainDishes } from '../modules/mainDishes.js'
import { SideDishes } from '../modules/sideDishes.js'
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
	const mainDishes = await new MainDishes(dbName)
	const sideDishes = await new SideDishes(dbName)

	ctx.hbs.mainDishes = await mainDishes.getMainDishes()
	ctx.hbs.sideDishes = await sideDishes.getSideDishes()
	// ctx.hbs.mainDishSides = mainDishSides;

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
	const mainDishes = await new MainDishes(dbName)
	const orderChoices = await new OrderChoices(dbName)
	const statusCodes = await new StatusCodes(dbName)

	try {
		const { body } = ctx.request

		let totalPrice = 0
		let totalIngredientsCost = 0
		body.choices = JSON.parse(body.choices)
		for (let choice = 0; choice < body.choices.length; choice++) {
			const dish = await mainDishes.getMainDish(body.choices[choice])
			totalPrice = totalPrice + dish.price
			totalIngredientsCost = totalIngredientsCost + dish.ingredientsCost
		}

		const statusCode = await statusCodes.getStatusCodeByName('placed')
		const date = new Date()

		const newOrder = {
			tableNumber: parseInt(body.tableNumber),
			numDiners: parseInt(body.numDiners),
			statusCode: statusCode.id,
			time: date.toLocaleString(),
			totalPrice: totalPrice,
			totalIngredientsCost: totalIngredientsCost,
		}

		const order = await orders.addOrder(newOrder)

		for (let choice = 0; choice < body.choices.length; choice++) {
			const dish = await mainDishes.getMainDish(body.choices[choice])
			const newOrderChoice = {
				mainDishID: dish.mainDishID,
				orderID: order.lastID,
				quantity: 1,
				price: totalPrice,
				ingredientsCost: totalIngredientsCost
			}

			await orderChoices.addMainDishChoice(newOrderChoice)
		}

		await ctx.redirect('/secure/orders?msg=order successfully created')
	} catch (err) {
		console.log(err.message)
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		orders.close()
	}
})

/**
 * The script to update an order.
 *
 * @name Post Order Updating Script
 * @route {POST} /orders/:id
 */
secureRouter.post('/orders/:id', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	const orders = await new Orders(dbName)
	const statusCodes = await new StatusCodes(dbName)
	const { id } = ctx.params
	try {
		const statusCode = await statusCodes.getStatusCodeByName('prepared')
		await orders.updateStatus(id, statusCode.id)
		await ctx.redirect('/secure/orders?msg=order status successfully updated')
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		orders.close()
	}
})

/**
 * The script to view an order.
 *
 * @name Post Order Viewing Script
 * @route {GET} /orders/:id
 */
secureRouter.get('/orders/:id', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')

	const orders = await new Orders(dbName)
	const { id } = ctx.params
	try {
		const order = await orders.getOrder(id)
		ctx.hbs.body = order
		await ctx.render('order', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		orders.close()
	}
})

/**
 * The script to delete an order.
 *
 * @name Post Order Deleting Script
 * @route {GET} /orders/delete/:id
 */
secureRouter.post('/orders/delete/:id', async ctx => {
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')

	const orders = await new Orders(dbName)
	const orderChoices = await new OrderChoices(dbName)
	const { id } = ctx.params
	try {
		await orderChoices.deleteOrderChoices(id)
 		await orders.deleteOrder(id)
		await ctx.redirect('/secure/orders?msg=order successfully deleted')
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		orders.close()
	}
})

export { secureRouter }
