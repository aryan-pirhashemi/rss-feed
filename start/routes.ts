import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/news', 'ArticlesController.view').as('news.view')
Route.get('/news/create', 'ArticlesController.create').as('news.create')

// Route.on('/news').render('news/view').as('news.view')

Route.post('/news/create', 'ArticlesController.store').as('news.store')

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
