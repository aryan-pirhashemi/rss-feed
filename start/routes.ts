/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'
import 'App/Modules/Rss/Routes'
import 'App/Modules/index'

Route.where('id', {
  match: /^[0-9]+$/,
  cast: (id) => Number(id),
})

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})



// Route.on('/login').render('auth.login').as('auth.login')

// Route.post('/login', async ({ auth, request, response }) => {
//   const email = request.input('email')
//   const password = request.input('password')

//   await auth.use('web').attempt(email, password)
//   return response.redirect('/')
// })

// Route.post('/logout', async ({ auth, response }) => {
//   await auth.use('web').logout()
//   response.redirect('/login')
// }).as('auth.logout')
