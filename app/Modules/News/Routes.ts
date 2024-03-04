/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

// Route.on('/news').render('news/view').as('news.view')

export default function NewsRoutes(){
  Route.group(() => {
    Route.get('/', 'ArticlesController.viewAll').as('view')

    Route.patch('/patch/:id?', 'ArticlesController.viewArticle').as('update')
  
    Route.delete('/delete/:id?', ({ params }) => {
      return { params }
    }).as('delete')

  }).prefix('/news').as('news')  
}


