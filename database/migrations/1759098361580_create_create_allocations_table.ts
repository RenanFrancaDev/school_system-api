import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'allocations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('student_id').references('id').inTable('users').unique().notNullable()
      table.uuid('classroom_id').references('id').inTable('classrooms').notNullable()
      table.uuid('teacher_id').references('id').inTable('users').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
