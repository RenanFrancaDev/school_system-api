import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Classroom from './classroom.js'
import Allocation from './allocation.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare type: 'student' | 'teacher'

  @column()
  declare registration: string

  @column.date()
  declare birthDate: DateTime

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Classroom, { foreignKey: 'teacherId' })
  declare classrooms: HasMany<typeof Classroom>

  @hasMany(() => Allocation, { foreignKey: 'teacherId' })
  declare allocations: HasMany<typeof Allocation>

  @hasOne(() => Allocation, { foreignKey: 'studentId' })
  declare studentAllocation: HasOne<typeof Allocation>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
