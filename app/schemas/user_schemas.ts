import { schema, rules } from '@adonisjs/validator'

//Validation User Register
export const registerUserSchema = schema.create({
  name: schema.string([
    rules.minLength(2),
    rules.maxLength(60),
    rules.alphaNum({ allow: ['space', 'dash'] }),
    rules.regex(/^[a-zA-ZÀ-ÿ\s\u00f1\u00d1\-'.]+$/), //allows accent
  ]),
  email: schema.string([rules.email(), rules.normalizeEmail({ allLowercase: true })]),
  password: schema.string([rules.minLength(6), rules.maxLength(255), rules.confirmed()]),
  type: schema.enum(['student', 'teacher'] as const),
  birthDate: schema.date({ format: 'yyyy-MM-dd' }),
})

//Validation User Update
export const updateUserSchema = schema.create({
  name: schema.string.optional([
    rules.minLength(2),
    rules.maxLength(60),
    rules.alpha({ allow: ['space', 'dash'] }),
  ]),
  email: schema.string.optional([rules.email(), rules.normalizeEmail({ allLowercase: true })]),
  birthDate: schema.date.optional({ format: 'yyyy-MM-dd' }),
})

//Validation Login
export const loginUserSchema = schema.create({
  email: schema.string([rules.email(), rules.normalizeEmail({ allLowercase: true })]),
  password: schema.string(),
})

//reset password
export const changePasswordSchema = schema.create({
  currentPassword: schema.string(),
  newPassword: schema.string([rules.minLength(6), rules.maxLength(255), rules.confirmed()]),
})
