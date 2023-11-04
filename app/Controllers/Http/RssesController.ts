/* eslint-disable @typescript-eslint/naming-convention */
import Database from '@ioc:Adonis/Lucid/Database'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RssesController {
  // private feedOptions  {
  //   title: string,
  //   siteLink: string,
  //   pub_date: string,
  //   content: string,
  //   contentSnippet: string,
  //   categories: Array<string>
  // }

  public async view({ view }) {
    const rsses = await Database.from('rsses').select('*')
    // return articles
    return view.render('rss/view', { rsses })
  }

  public create({ view }) {
    return view.render('rss/create')
  }
  public async store({ response, request }) {
    const { rssLink } = request.body()
    const { title, siteLink, description, image } = await checkRss(rssLink)

    var item = await Database.table('rsses').insert({
      title,
      rssLink,
      siteLink,
      description,
      image,
    })

    return response.redirect().toRoute('rss.view')
  }
}
