/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
import RssSevices from '@ioc:Services/Rss';

export default class RssesController {

  /**
   * Imports the rss list from the database and renders the view with them.
   * @param ctx - The context object.
   * @returns A render of the rss view.edge file.
   */
  public async view({ view }) {
    await RssSevices.importRss();
    
    const rsses = RssSevices.getRssList()
    return view.render('rss/view', { rsses })
  }

  /**
   * Returns a render of the rss create form.
   * @param ctx - The context object.
   * @returns A render of the create.edge file.
   */
  public create({ view }) {
    return view.render('rss/create')
  }

  /**
   * Stores a new RSS feed in the database.
   * - Checks if the RSS link already exists in the database.
   * - If the RSS link exists, redirects to the view page.
   * - If the RSS link does not exist:
   *   - Fetches information about the RSS feed using the provided link.
   *   - Inserts the title, RSS link, link, description, and image into the 'rsses' table in the database.
   *   - Redirects to the view page.
   * @param ctx - The context object.
   * @returns A redirection to the view page.
   */
  public async store( { response, request  } ) {
    // Extract the 'rssLink' from the request body
    const { rssLink } = request.body()
    if (await RssSevices.rExists(rssLink)) { 
        // Check if the RSS link already exists in the database
        console.log("Link already exists.")
      return response.redirect().toRoute('rsses.view') 
        // Redirect to the view page if the RSS link already exists
    }

    await RssSevices.pushRss(rssLink) 

    return response.redirect().toRoute('rsses.view') 
    // Redirect to the view page after storing the RSS feed
  }


}