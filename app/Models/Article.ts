import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  beforeCreate,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Rss from './Rss'
import Hash from '@ioc:Adonis/Core/Hash'
import Topic from './Topic'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public link: string

  @column.dateTime()
  public linkpubDate: DateTime

  @column()
  public content: string

  @column()
  public contentSnippet: string

  @column()
  public image: string

  @column()
  public rssId: number

  @column()
  public hash: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  @beforeCreate()
  public static async hashRssLink(article: Article) {
    article.hash = await Hash.make(article.link)
  }
  @belongsTo(() => Rss)
  public rss: BelongsTo<typeof Rss>
  @manyToMany(() => Topic, {
    pivotTable: 'article_topics',
    pivotColumns: ['sort_order'],
  })
  public Topic: ManyToMany<typeof Topic>
}
