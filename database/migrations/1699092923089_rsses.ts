import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rsses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.string('title').notNullable()
      table.string('rssLink').notNullable()
      table.string('siteLink').notNullable()
      table.text('description')
      table.string('image')

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
