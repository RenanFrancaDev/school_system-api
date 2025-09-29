import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 60).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 255).notNullable()
      table.enum('type', ['student', 'teacher']).notNullable().defaultTo('student')
      table.string('registration', 20).notNullable().unique()
      table.date('birth_date').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
