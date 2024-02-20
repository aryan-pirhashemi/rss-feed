// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
// import Env from '@ioc:Adonis/Core/Env'

export default class ArticlesController {
  public async viewAll({ request, view }) {
    const page = request.input('page', 1)
    const limit = 5
    // setInterval(
    //   () => {
    //     console.log('updated')
    //     RssSevices.updateArticles()
    //   },
    //   Env.get('UPDATE_TIME', 1) * 60000
    // )
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
  public async store({ response, request }) {
    const { title, content, image, distinct } = request.body()
    await Database.table('articles').insert({ title, distinct, image, content })
    return response.redirect().back()
  }
}
