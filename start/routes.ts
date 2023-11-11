import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
Route.get('/rsses', 'RssesController.view').as('rsses.view')
Route.get('/rsses/create', 'RssesController.create').as('rss.create')
Route.post('/rsses/create', 'RssesController.store').as('rss.store')

Route.get('/news', 'ArticlesController.viewAll').as('news.view')

// Route.on('/news').render('news/view').as('news.view')

Route.patch('/news/:id?', 'ArticlesController.viewArticle')
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
