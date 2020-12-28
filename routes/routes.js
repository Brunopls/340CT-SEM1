/** Koa Router serving all API routes
 * @module routes
 * @requires koa-router
 */
import Router from 'koa-router'

import { publicRouter } from './public.js'
import { secureRouter } from'./secure.js'

/**
 * Koa Router to mount all routers on
 * @type {Object}
 * @const
 * @namespace apiRouter
 */
const apiRouter = new Router()

/** @type {Router} */
const nestedRoutes = [publicRouter, secureRouter]
for (const router of nestedRoutes) apiRouter.use(router.routes(), router.allowedMethods())

export { apiRouter }
