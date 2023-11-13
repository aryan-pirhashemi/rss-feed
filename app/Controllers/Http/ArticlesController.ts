// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import RssSevices from '@ioc:Services/Rss'
import Env from '@ioc:Adonis/Core/Env'

export default class ArticlesController {
  public async viewAll({ view }) {
    await RssSevices.extractAllRssArticles()
    setInterval(
      () => {
        RssSevices.updateArticles()
        console.log('updated')
      },
      // Env.get('UPDATE_TIME', 5) * 60000
      10000
    )

    const articles = await Database.from('articles').select('*')
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
