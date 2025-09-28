import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'allocations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .unique()
        .notNullable()
      table.integer('classroom_id').unsigned().references('id').inTable('classrooms').notNullable()
      table.integer('teacher_id').unsigned().references('id').inTable('users').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
