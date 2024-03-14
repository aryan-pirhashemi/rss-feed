import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unique().references('id').inTable('users').notNullable().unsigned()
      table.text('biography').notNullable().defaultTo('')
      table.string('location', 255).notNullable().defaultTo('')
      table.string('website', 255).notNullable().defaultTo('')
      table.string('company', 255).notNullable().defaultTo('')
      table.string('twitter_url', 255).notNullable().defaultTo('')
      table.string('facebook_url', 255).notNullable().defaultTo('')
      table.string('linkedin_url', 255).notNullable().defaultTo('')
      table.string('instagram_url', 255).notNullable().defaultTo('')
      table.string('youtube_url', 255).notNullable().defaultTo('')

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
