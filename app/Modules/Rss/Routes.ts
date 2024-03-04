/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function RssRoutes(){
    Route.group(() => {
        Route.get('/get', 'RssesController.view').as('view')
        Route.group(() => {
            Route.get('/get/create', 'RssesController.create').as('create')
            Route.post('/post/create', 'RssesController.store').as('store')
        
            Route.get('/get/:id', 'RssesController.viewRss').as(':id.view')
            Route.delete('/delete/:id', 'RssesController.remove').as('remove')
        }).prefix('/rss').as('rss')    
        
    }).prefix('/rsses').as('rsses')
}

