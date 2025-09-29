import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classrooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name', 20).notNullable().unique()
      table.integer('capacity').notNullable()
      table.boolean('is_available').notNullable().defaultTo(true)
      table.uuid('teacher_id').references('id').inTable('users').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
