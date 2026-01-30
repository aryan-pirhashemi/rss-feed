// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Article from 'App/Models/Article'
// import Env from '@ioc:Adonis/Core/Env'

export default class ArticlesController {
  public async viewAll({ request, view }) {
    const page = request.input('page', 1)
    const limit = 5
    const articles = await Database.from('articles')
      .select('*')
      .orderBy('pubDate', 'desc')
      .paginate(page, limit)
    articles.baseUrl('/news')
    // return articles
    return view.render('news/view', { articles })
  }
  public async viewArticle({ view, request }) {
    const { id } = request.body()
    await Database.from('articles').select('*').where('articles.id', id)

    return view.render('news/view')
  }
}
