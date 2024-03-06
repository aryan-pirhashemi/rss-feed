/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database';
import Parser from 'rss-parser';
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
// Create a single instance of the Parser class


  public async pushRss(rssLink: string) {
    try {
      // Validate or sanitize the 'rssLink' input if needed

      // Extract relevant information from the fetched data
      // and fetch information about the RSS feed using the provided RSS link.
      const { title, link, description, image } = await this.parser.parseURL(rssLink);

      // Insert the RSS feed information into the 'rsses' table in the database.
      await Database.table('rsses').insert({
        title,
        rssLink,
        link,
        description,
        image,
      });
      return (await Database.from('rsses').where('rssLink', rssLink).select('id'))[0].id

    } catch (error) {
      // Handle any potential errors appropriately (e.g., logging, error reporting, fallback behavior)
      console.error('Error pushing RSS:', error);
      throw error; // Rethrow the error to propagate it to the caller if necessary
    }
  }



  /**
   * Handles the insertion of articles into the database.
   * @param rssLink - The RSS link to fetch articles from.
   */
  public async handleArticles(rssLink: string, rssID: string): Promise<void> {
    const articles = await Database.from('articles')
      .select('*')
      .where('rssID', rssID)
      .orderBy('pubDate', 'desc');

    const parser = new Parser();
    const updateArticles = (await parser.parseURL(rssLink)).items;

      const topArticleDatabase = articles[articles.length - 1];
      let articleArrayID = 0;
      
      for (let i = updateArticles.length - 1; i >= 0; i--) {
        if (await Hash.verify(topArticleDatabase.hash, updateArticles[i].link)) {
          articleArrayID = i;
          break;
        }
        
        if(articleArrayID === 0){
          // Batch insert all new articles
          const articleData = await Promise.all(updateArticles.map(async (article) => ({
            title: article.title,
            link: article.link,
            pubDate: article.pubDate,
            content: article.content,
            contentSnippet: article.contentSnippet,
            categories: article.categories,
            hash: await Hash.make(article.link || ''),
            rssID: rssID,
          })));
          await Database.table('articles').insert(articleData);
        }
        // Batch insert new articles
        const newArticleData = await Promise.all(updateArticles.slice(articleArrayID + 1).map(async (article) => ({
          title: article.title,
          link: article.link,
          pubDate: article.pubDate,
          content: article.content,
          contentSnippet: article.contentSnippet,
          categories: article.categories,
          hash: await Hash.make(article.link || ''),
          rssID: rssID,
        })));
        await Database.table('articles').insert(newArticleData);
      }
  }

  /**
   * Checks if an RSS link already exists in the collection of RSS data.
   * @param rssLink - The RSS link to check for existence.
   * @returns A boolean indicating whether the RSS link exists (true) or not (false).
   */
  public async rExists(rssLink: string): Promise<boolean> {
    const rssList = await this.importRss();
    return rssList.some((rss) => rss.rssLink === rssLink);
  }

  public async updateArticles(): Promise<void> {
    const rssList = await Database.from('rsses').select('*')
    for (const rss of rssList) {
      // Handle articles for each RSS feed during the update process
      await this.handleArticles(rss.rssLink, rss.id)
    }
  }
}