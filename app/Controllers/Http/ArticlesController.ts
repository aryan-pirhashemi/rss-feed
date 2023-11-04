// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
// import {schema} from

export default class ArticlesController {
  public async view({ view }) {
    const articles = await Database.from('articles').select('*')
    // return articles
    return view.render('news/view', { articles })
  }
  public create({ view }) {
    return view.render('news/create')
  }
  public async store({ response, request }) {
    const { title, content, image, distinct } = request.body()
    await Database.table('articles').insert({ title, distinct, image, content })
    return response.redirect().back()
  }
}
