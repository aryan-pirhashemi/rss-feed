import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('rss_id').notNullable().unsigned().references('id').inTable('rsses')
      table.text('title').notNullable()
      table.string('link').unique()
      table.dateTime('pubDate')
      table.text('content')
      table.text('content_snippet')
      table.string('image')
      table.string('hash').notNullable().unique()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
