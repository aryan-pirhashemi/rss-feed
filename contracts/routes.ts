/* eslint-disable prettier/prettier */
declare module '@ioc:Adonis/Core/Route' {
    interface RouteContract {
        mustBeSigned(): this
    }
    interface BriskRouteContract{
        redirectToHome(): this
    }
    interface RouteResourceContract{
        mustBeSigned(): this        
    }
    interface RouteGroup {
        mustBeSigned(): this
    }
    interface RouteMatchersContract{
        matchID(): {match: RegExp | undefined, cast: ((value: string) => any) | undefined}
    }
}