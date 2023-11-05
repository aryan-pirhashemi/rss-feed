/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
import Database from '@ioc:Adonis/Lucid/Database'
import RssSevices from '@ioc:Services/Rss';
import { DateTime } from 'luxon'
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
    const rsses = await this.importData();
    console.log(rsses)
    // return articles
    return view.render('rss/view', { rsses })
  }

  public create({ view }) {
    return view.render('rss/create')
  }
  public async store({ response, request }) {
    const newDate = DateTime.local().toISO()
    const { rssLink } = request.body()
    if(await this.rExists(rssLink)){
        console.log(rssLink + " already exists in the database.")
        return response.redirect().toRoute('rsses.view')
    }
    const info = await RssSevices.checkRss(rssLink)
    console.log(info)
    const { title, link, description, image } = info
    await Database.table('rsses').insert({
      title,
      rssLink,
      link,
      description,
      image
    })

    return response.redirect().toRoute('rsses.view')
  }
  private async  rExists(rssLink){
    const rsses = await this.importData()
    for (let index = 0; index < rsses.length; index++) {
        const rss = rsses[index];
        if (rss.rssLink === rssLink){
            return true
        }
    }
    return false
  }
  private async importData(){
    return await Database.from('rsses').select('*')
  }
}
