/** Koa Router serving public resources
 * @module routers/public
 * @requires koa-router
 */
import Router from 'koa-router'
import bodyParser from 'koa-body'
import { Helpers } from '../helpers/helpers.js'

/**
 * Koa Router to mount user related functions on
 * @type {Object}
 * @const
 * @namespace publicRouter
 */
const publicRouter = new Router()
publicRouter.use(bodyParser({multipart: true}))

import { Accounts } from '../modules/accounts.js'
import { Roles } from '../modules/roles.js'
const dbName = 'website.db'

/**
 * The public home page.
 * @memberof module:routers/public~publicRouter
 * @name Home Page
 * @route {GET} /
 */
publicRouter.get('/', async ctx => {
	try {
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The user registration page.
 * @memberof module:routers/public~publicRouter
 * @name Register Page
 * @route {GET} /register
 */
publicRouter.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 * @memberof module:routers/public~publicRouter
 * @name Register Endpoint
 * @route {POST} /register
 */
publicRouter.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})

publicRouter.get('/postregister', async ctx => await ctx.render('validate'))

/**
 * The script to validate user login input.
 * @memberof module:routers/public~publicRouter
 * @name Login Validation Endpoint
 * @route {GET} /validate/:user/:token
 */
publicRouter.get('/validate/:user/:token', async ctx => {
	try {
		console.log('VALIDATE')
		console.log(`URL --> ${ctx.request.url}`)
		if(!ctx.request.url.includes('.css')) {
			console.log(ctx.params)
			const milliseconds = 1000
			const now = Math.floor(Date.now() / milliseconds)
			const account = await new Accounts(dbName)
			await account.checkToken(ctx.params.user, ctx.params.token, now)
			ctx.hbs.msg = `account "${ctx.params.user}" has been validated`
			await ctx.render('login', ctx.hbs)
		}
	} catch(err) {
		await ctx.render('login', ctx.hbs)
	}
})

/**
 * The login page script.
 * @memberof module:routers/public~publicRouter
 * @name Login Page
 * @route {GET} /login
 */
publicRouter.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

/**
 * The login endpoint.
 *
 * Also handles role-based access control & work timekeeping by registering
 * the user's role and login time in session variables.
 *
 * @memberof module:routers/public~publicRouter
 * @name Login Script Endpoint
 * @route {POST} /login
 */
publicRouter.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	const role = await new Roles(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		ctx.session.authorised = await account.login(body.user, body.pass)

		const roleId = await account.getRoleID(body.user)
		const roleObj = await role.getRole(roleId)
		ctx.session.role = roleObj.name
		ctx.session.loginTime = Date.now()

	 			const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})

/**
 * The logout script.
 * @memberof module:routers/public~publicRouter
 * @name Logout Script Endpoint
 * @route {GET} /logout
 */
publicRouter.get('/logout', async ctx => {
	const helper = new Helpers()
	const hoursClocked = await helper.getHoursWorked(ctx.hbs.loginTime)
	ctx.session.authorised = null
	ctx.session.role = null
	ctx.session.loginTime = null
	ctx.redirect(`/?msg=you are now logged out. You worked ${hoursClocked} hours today.`)
})

export { publicRouter }
