/* eslint-disable prettier/prettier */
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class RouteProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const Route = this.app.container.use('Adonis/Core/Route')
    
    Route.Route.macro('mustBeSigned', function(){
      this.middleware( async (ctx, next) => {
        if(!ctx.request.hasValidSignature()){
          return ctx.response.badRequest('Invalid Signature');
        }
        await next()
      })
      return this
    })
    
    Route.BriskRoute.macro("redirectToHome", function(){
      this.redirect('/')
      return this
    })

    Route.RouteMatchers.macro("matchID", function(){
      return{
        match: /^[0-9]+$/,
        cast: (id) => Number(id)
      }
    })

    Route.RouteResource.macro('mustBeSigned', function(){
      this.middleware({
        '*': async (ctx, next) => {
          if(!ctx.request.hasValidSignature()){
            return ctx.response.badRequest('Invalid Signature');
          }
          await next()
        }
      })
      return this
    })
    
    Route.RouteGroup.macro('mustBeSigned', function(){
      this.middleware( async (ctx, next) => {
        if(!ctx.request.hasValidSignature()){
          return ctx.response.badRequest('Invalid Signature');
        }
        await next()
      })
      return this
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}