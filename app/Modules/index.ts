/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'
import RssRoutes from './Rss/Routes'
import NewsRoutes from './News/Routes'
Route.group(() => {
    RssRoutes()
    NewsRoutes()
  }).prefix('/module')
