/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import Parser from 'rss-parser'

export default class RssService {
  private static rssList: Array<any>
  private static items: Array<any>
  constructor(){
    
  }
  public async importRss(){
    RssService.rssList = await Database.from('rsses').select('*')
  }
  public getRssList(){
    return RssService.rssList
  }
  public async pushRss(rssLink: string) {
    const parser = new Parser()
    
    /**
     * Extract relevant information from the fetched data 
     * and Fetch information about the RSS feed using the provided RSS link
     */
    const { title, link, description, image } = await parser.parseURL(rssLink)
    await Database.table('rsses').insert({ 
      // Insert the RSS feed information into the 'rsses' table in the database
      title,
      rssLink,
      link,
      description,
      image
    })
  }
    

  public extractArticles(findRssLink: string): boolean {
    for(const rss of RssService.rssList){
      if(rss.rssLink === findRssLink){
        RssService.items =  rss.items
        return true
      }
    }
    return false

  }

    /**
   * Checks if an RSS link already exists in the collection of RSS data.
   * @param rssLink - The RSS link to check for existence.
   * @returns A boolean indicating whether the RSS link exists (true) or not (false).
   */
  public async rExists(rssLink) {
    
    for (const rss of RssService.rssList) {
      if (rss.rssLink === rssLink) {
        return true; // RSS link exists
      }
    }
    return false; // RSS link does not exist
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
