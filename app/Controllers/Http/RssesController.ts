/* eslint-disable @typescript-eslint/naming-convention */
import Database from '@ioc:Adonis/Lucid/Database'
import Parser from 'rss-parser'
import Logger from '@ioc:Adonis/Core/Logger'

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

  private articlesArray: Array<Object>
  private CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
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
    const { title, siteLink, description, items, image } = await this.checkRss(rssLink)
    var hashedItems = ''
    var item = await Database.table('rsses').insert({
      title,
      rssLink,
      siteLink,
      description,
      items,
      image,
    })

    return response.redirect().toRoute('rss.view')
  }
  private async checkRss(rssLink) {
    const parser = new Parser()
    const { title, siteLink, description, items, image } = await parser.parseURL(rssLink)

    return { title, siteLink, description, items, image }
  }

  private async itemManage(items) {
    var articleDetails = {
      title: '',
      siteLink: '',
      pub_date: '',
      content: '',
      contentSnippet: '',
      categories: [],
    }
    for (let index = 0; index < items.length; index++) {
      articleDetails = items[index]
      this.articlesArray.push(articleDetails)
    }
  }
}
