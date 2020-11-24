
import Router from 'koa-router'

import { Roles } from '../modules/roles.js'
const dbName = 'website.db'

const secureRouter = new Router({ prefix: '/secure' })

secureRouter.get('/', async ctx => {
	try {
		console.log(ctx.hbs)
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
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
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	if(ctx.session.role.name !== 'admin') return ctx.redirect('/secure?msg=not an admin')

	const roles = await new Roles(dbName)
	try {
		const rows = await roles.getRoles()
		ctx.hbs.body = rows

	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		roles.close()
	}
})

export { secureRouter }
