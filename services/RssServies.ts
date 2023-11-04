/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import Parser from 'rss-parser'

export class RssService {
  private CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
  public async checkRss(rssLink) {
    const parser = new Parser()
    // const { title, siteLink, description, items, image } 

    return await parser.parseURL(rssLink)
  }
  public async importRss(){
    return await Database.from('rsses').select('*')
  }

//   private async itemManage(items) {
//     var articleDetails = {
//       title: '',
//       siteLink: '',
//       pub_date: '',
//       content: '',
//       contentSnippet: '',
//       categories: [],
//     }
//     var hasher = new Hasher()
//     var articleHash = ''
//     for (let index = 0; index < items.length; index++) {
//       articleDetails = items[index]
//       articleHash = hasher.md5(JSON.stringify(articleDetails))
//       this.hashedArticlesArray.push(articleHash)
//     }
//   }
}
