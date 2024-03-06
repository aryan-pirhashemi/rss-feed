import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Rss from './Rss'

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
  public rssID: string

  @column()
  public hash: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Rss)
  public rss: BelongsTo<typeof Rss> 
}
