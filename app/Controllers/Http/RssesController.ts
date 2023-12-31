/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
import Database from '@ioc:Adonis/Lucid/Database';
import RssSevices from '@ioc:Services/Rss';
import validateLink from 'App/Validators/RssLinkValidator'

export default class RssesController {

  
  /**
   * Imports the rss list from the database and renders the view with them.
   * @param ctx - The context object.
   * @returns A render of the rss view.edge file.
   */
  public async view({ view }) {
    
    
    const rsses = await RssSevices.importRss()
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
    const payload = await request.validate(validateLink)
    // Extract the 'rssLink' from the request body
    const { rssLink } = request.body()

    if (await RssSevices.rExists(rssLink)) { 
        // Check if the RSS link already exists in the database
        console.log("Link already exists.")
      return response.redirect().toRoute('rsses.view') 
        // Redirect to the view page if the RSS link already exists
    }
    RssSevices.pushRss(rssLink)
    return response.redirect().toRoute('rsses.view') 
    // Redirect to the view page after storing the RSS feed
  }
  public async remove({response, params}){
    const { id } =  params;
    try{
      await Database.from("articles").where("rssID", id).delete()
      await Database.from("rsses").where("id", id).delete()
    }catch(error){
        console.log('error ==>  ', error)
    }
    await setInterval(()=>{}, 3000)
    return response.redirect().toRoute('rsses.view') 
  }


}


