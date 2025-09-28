import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classrooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 10).notNullable().unique()
      table.integer('capacity').notNullable()
      table.boolean('is_available').notNullable().defaultTo(true)
      table.integer('teacher_id').unsigned().references('id').inTable('users').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
