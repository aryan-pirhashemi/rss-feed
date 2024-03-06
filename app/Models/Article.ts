import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Rss from './Rss'
import Hash from '@ioc:Adonis/Core/Hash'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public link: string

  @column()
  public linkpubDate: DateTime

  @column()
  public content: string

  @column()
  public contentSnippet: string

  @column()
  public image: string

  @column()
  public rssId: string

  @column()
  public hash: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Rss)
  public rss: BelongsTo<typeof Rss>
  @beforeCreate()
  public static async hashRssLink(article: Article) {
    article.hash = await Hash.make(article.link)
  }
}
