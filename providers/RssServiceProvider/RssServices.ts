/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import Parser from 'rss-parser'
import Hash from '@ioc:Adonis/Core/Hash'

export default class RssService {
  constructor() {}

  /**
   * Imports RSS data from the 'rsses' table in the database.
   */
  public async importRss(): Promise<any> {
    return await Database.from('rsses').select('*')
  }

  /**
   * Retrieves relevant information from the fetched RSS feed and inserts it into the database.
   * @param rssLink - The RSS link to fetch information from.
   */
  public async pushRss(rssLink: string): Promise<void> {
    const parser = new Parser()

    // Extract relevant information from the fetched data
    // and fetch information about the RSS feed using the provided RSS link.
    const { title, link, description, image } = await parser.parseURL(rssLink)

    // Insert the RSS feed information into the 'rsses' table in the database.
    await Database.table('rsses').insert({
      title,
      rssLink,
      link,
      description,
      image,
    })
  }

  /**
   * Extracts articles from all RSS feeds in the RSS list and inserts them into the database.
   */
  public async extractAllRssArticles(): Promise<void> {
    const rssList = await this.importRss()
    for (const rss of rssList) {
      // Handle articles for each RSS feed
      await this.handleArticles(rss.rssLink)
    }
  }

  /**
   * Handles the insertion of articles into the database.
   * @param rssLink - The RSS link to fetch articles from.
   */
  private async handleArticles(rssLink: string): Promise<void> {
    const articles = await Database.from('articles').select('*').where('rssLink', rssLink)
    const parser = new Parser()
    const updateArticles: any[] = (await parser.parseURL(rssLink)).items.sort(function(item1, item2) {


      var d1 = new Date(item1.pubDate)
      var d2 = new Date(item2.pubDate)
      return d2.getTime() - d1.getTime()
  })
  articles.sort(function(item1, item2) {


    var d1 = new Date(item1.pubDate)
    var d2 = new Date(item2.pubDate)
    return d2.getTime() - d1.getTime()
})
    console.log('updated')

    if(articles.length===0){
      for (let i = 0; i < updateArticles.length; i++) {
        console.log("\n")
        console.log(updateArticles[i].title)
        console.log("\n")

        this.insertArticle(updateArticles[i], rssLink)
        
      }
    }else{
      for (let i = 0; i < updateArticles.length; i++) {
        console.log("\n")
        console.log(updateArticles[i].title)
        console.log("\n")

        // Verify if the article already exists in the database using a hash comparison
        if (await Hash.verify(articles[i].hash, updateArticles[i].link)) {
          continue // Skip insertion if the article already exists
        }
  
        // Insert the article into the 'articles' table in the database
        this.insertArticle(updateArticles[i], rssLink)
      }
    }
    

    
  }
  private async insertArticle(updateArticle, rssLink){
    // console.log(updateArticle)
      const { title, link, pubDate, content, contentSnippet, image, categories } = updateArticle
      const hash = await Hash.make(link)
      console.log(pubDate, categories)
      // Insert the article into the 'articles' table in the database
      await Database.table('articles').insert({ title, link, pubDate, hash, content, contentSnippet, image, rssLink, categories })
  }


  /**
   * Checks if an RSS link already exists in the collection of RSS data.
   * @param rssLink - The RSS link to check for existence.
   * @returns A boolean indicating whether the RSS link exists (true) or not (false).
   */
  public async rExists(rssLink: string): Promise<boolean> {
    const rssList = await this.importRss()
    for (const rss of rssList) {
      if (rss.rssLink === rssLink) {
        return true
      }
    }
    return false // RSS link does not exist.
  }

  /**
   * Updates articles for all RSS feeds by fetching and inserting the latest articles into the database.
   */
  public async updateArticles(): Promise<void> {
    const rssList = await Database.from('rsses').select('*')
    for (const rss of rssList) {
      // Handle articles for each RSS feed during the update process
      await this.handleArticles(rss.rssLink)
    }
  }
}
