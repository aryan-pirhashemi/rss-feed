import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number
  @column()
  public biography: string
  @column()
  public location: string
  @column()
  public website: string
  @column()
  public company: string
  @column()
  public twitter_url: string
  @column()
  public facebook_url: string
  @column()
  public linkedin_url: string
  @column()
  public instagram_url: string
  @column()
  public youtube_url: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
