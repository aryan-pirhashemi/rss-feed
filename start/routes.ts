import Route from '@ioc:Adonis/Core/Route'
import ArticlesController from 'App/Controllers/Http/ArticlesController'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/news', async (ctx) => {
  // return articles
  return new ArticlesController().view(ctx)
}).as('news.view')

// Route.on('/news').render('news/view').as('news.view')

Route.post('/news', ({ response }) => {
  return response.redirect('/news')
}).as('news.create')

Route.patch('/news/:id?', ({ params }) => {
  return { params }
})
  .where('id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
  })
  .as('news.update')

Route.delete('/news/:id?', ({ params }) => {
  return { params }
})
  .where('id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
  })
  .as('news.delete')
