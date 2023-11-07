/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import Parser from 'rss-parser'
import Hash from '@ioc:Adonis/Core/Hash'

export default class RssService {
  private static rssList: any[] = []
  private static articles: any[] = []
  private static selectedRss?: any

  constructor() {}

  public async importRss(): Promise<void> {
    RssService.rssList = await Database.from('rsses').select('*')
  }

  public getRssList(): any[] {
    return RssService.rssList
  }
  

  public async pushRss(rssLink: string): Promise<void> {
    const parser = new Parser()

    /**
     * Extract relevant information from the fetched data
     * and fetch information about the RSS feed using the provided RSS link.
     */
    const { title, link, description, image } = await parser.parseURL(rssLink)
    await Database.table('rsses').insert({
      // Insert the RSS feed information into the 'rsses' table in the database.
      title,
      rssLink,
      link,
      description,
      image,
    })
  }
  public async extractAllRssArticles(): Promise<void> {
    for (const rss of RssService.rssList) {
      RssService.selectedRss = rss
      RssService.articles = rss.items
      this.hashArticlesContent()

    }
    
  }
  private async hashArticlesContent(){
    for(const article of RssService.articles){
      article.hash = await Hash.make(article.content)
      article.rssLink = RssService.selectedRss.rssLink
    }
  }


  public async extractSingleRssArticles(findRssLink: string): Promise<boolean> {
    if (await this.rExists(findRssLink)) {
      RssService.articles = RssService.selectedRss.items
      return true
    }
    return false
  }

  /**
   * Checks if an RSS link already exists in the collection of RSS data.
   * @param rssLink - The RSS link to check for existence.
   * @returns A boolean indicating whether the RSS link exists (true) or not (false).
   */
  public async rExists(rssLink: string): Promise<boolean> {
    console.log(rssLink)
    for (const rss of RssService.rssList) {
      if (rss.rssLink === rssLink) {
        RssService.selectedRss = rss
        return true // RSS link exists.
      }
    }
    return false // RSS link does not exist.
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
