/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database';
import Parser from 'rss-parser';
import Rss from "App/Models/Rss"
import Article from "App/Models/Rss"
import { Iupdatable } from '../../services/IUpdatable';
import Hash from '@ioc:Adonis/Core/Hash';

interface IFetcher{
  parseURL()
  parseString()
}

export default class RssService implements Iupdatable {
  private parser:Parser;
  constructor(parser: IFetcher) {
    this.parser = parser;
  }

  /**
   * Imports RSS data from the 'rsses' table in the database.
   */
  public async importRss(): Promise<any> {
    return await Database.from('rsses').select('*');
  }

  /**
   * Retrieves relevant information from the fetched RSS feed and inserts it into the database.
   * @param rssLink - The RSS link to fetch information from.
   */
  public async pushRss(rssLink: string) {
    try {
      // Extract relevant information from the fetched data
      // and fetch information about the RSS feed using the provided RSS link.
      const { title, link, description, image } = await this.parser.parseURL(rssLink);
      
      const rss = await Rss.findBy('rssLink', rssLink)
      if(!(rss === null)){
        return 'Rss already exists.'
      }
      await Rss.firstOrCreate({rssLink: rssLink}, {
        rssLink: rssLink,
        title : title,
        link : link,
        description : description,
        image : String(image)
      })
      this.handleArticles(rss)

      // Insert the RSS feed information into the 'rsses' table in the database.
    } catch (error) {
      // Handle any potential errors appropriately (e.g., logging, error reporting, fallback behavior)
      console.error('Error pushing RSS:', error);
      throw error; // Rethrow the error to propagate it to the caller if necessary
    }
    return 'Rss inserted'
  }



  /**
   * Handles the insertion of articles into the database.
   * @param rssLink - The RSS link to fetch articles from.
   */
  public async handleArticles(rss: Rss): Promise<void> {
    const articles = await Database.from('articles')
      .select('*')
      .where('rssId', rss.id)
      .orderBy('pubDate', 'desc');

    const parser = new Parser();
    var updateArticles = (await parser.parseURL(rss.rssLink)).items;

      const topArticleDatabase = articles[articles.length - 1];
      let articleArrayID = 0;
      
      for (let i = updateArticles.length - 1; i >= 0; i--) {
        if (await Hash.verify(topArticleDatabase.hash, updateArticles[i].link)) {
          articleArrayID = i;
          break;
        }
      }
      if(articleArrayID === 0){
        this.insertArticles(updateArticles, rss.id)
      }
      // Batch insert new articles
      updateArticles = updateArticles.slice(articleArrayID + 1)
      this.insertArticles(updateArticles, rss.id)
    }

  public async updateArticles(): Promise<void> {
    const rssList = await Database.from('rsses').select('*')
    for (const rss of rssList) {
      // Handle articles for each RSS feed during the update process
      await this.handleArticles(rss.rssLink, rss.id)
    }
  }

  private async insertArticles(articles, rssId){
    // Batch insert all new articles
    const articleData = await Promise.all(articles.map(async (article) => ({
      title: article.title,
      link: article.link,
      pubDate: article.pubDate,
      content: article.content,
      contentSnippet: article.contentSnippet,
      categories: article.categories,
      rssId: rssId,
    })));
    await Database.table('articles').insert(articleData);
  }
}