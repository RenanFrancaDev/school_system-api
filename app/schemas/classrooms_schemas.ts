import { schema, rules } from '@adonisjs/validator'

// Validation for classroom creation

export const createClassroomSchema = schema.create({
  name: schema.string([rules.minLength(2), rules.maxLength(10)]),
  capacity: schema.number([rules.range(1, 50)]),
})

// Validation for classroom update
export const updateClassroomSchema = schema.create({
  name: schema.string.optional([rules.minLength(2), rules.maxLength(10)]),
  capacity: schema.number.optional([rules.range(1, 1000)]),
  isAvailable: schema.boolean.optional(),
})
