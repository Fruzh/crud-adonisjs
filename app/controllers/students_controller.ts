import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import { schema, rules } from '@adonisjs/validator'

export default class StudentsController {
  public async index({ response }: HttpContext) {
    const students = await Student.all()
    return response.ok({
      message: 'Berhasil mengambil data siswa',
      data: students,
    })
  }

  public async store({ request, response }: HttpContext) {
    const studentSchema = schema.create({
      name: schema.string({}, [rules.maxLength(255)]),
      nis: schema.string({}, [rules.maxLength(20)]),
      kelas: schema.string({}, [rules.maxLength(10)]),
      email: schema.string({}, [rules.email(), rules.maxLength(255)]),
      phone: schema.string({}, [rules.maxLength(20)]),
      address: schema.string({}, [rules.maxLength(500)]),
      dateOfBirth: schema.date(),
      profilePicture: schema.string({}, [rules.maxLength(255)]),
    })

    const data = await request.validate({ schema: studentSchema })

    const existingNis = await Student.query().where('nis', data.nis).first()
    if (existingNis) {
      return response.conflict({ message: 'NIS sudah digunakan' })
    }

    const existingEmail = await Student.query().where('email', data.email).first()
    if (existingEmail) {
      return response.conflict({ message: 'Email sudah digunakan' })
    }

    const student = await Student.create({
      name: data.name,
      nis: data.nis,
      kelas: data.kelas,
      email: data.email,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      profilePicture: data.profilePicture,
    })

    return response.created({
      message: 'Siswa berhasil ditambahkan',
      data: student,
    })
  }

  public async show({ params, response }: HttpContext) {
    const student = await Student.find(params.id)
    if (!student) {
      return response.notFound({ message: 'Siswa tidak ditemukan' })
    }

    return response.ok({
      message: 'Berhasil mengambil data siswa',
      data: student,
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const student = await Student.find(params.id)
    if (!student) {
      return response.notFound({ message: 'Siswa tidak ditemukan' })
    }

    const studentSchema = schema.create({
      name: schema.string({}, [rules.maxLength(255)]),
      nis: schema.string({}, [rules.maxLength(20)]),
      kelas: schema.string({}, [rules.maxLength(10)]),
      email: schema.string({}, [rules.email(), rules.maxLength(255)]),
      phone: schema.string({}, [rules.maxLength(20)]),
      address: schema.string({}, [rules.maxLength(500)]),
      dateOfBirth: schema.date(),
      profilePicture: schema.string({}, [rules.maxLength(255)]),
    })

    const data = await request.validate({ schema: studentSchema })

    const existingNis = await Student.query()
      .where('nis', data.nis)
      .whereNot('id', params.id)
      .first()
    if (existingNis) {
      return response.conflict({ message: 'NIS sudah digunakan' })
    }

    const existingEmail = await Student.query()
      .where('email', data.email)
      .whereNot('id', params.id)
      .first()
    if (existingEmail) {
      return response.conflict({ message: 'Email sudah digunakan' })
    }

    student.merge({
      name: data.name,
      nis: data.nis,
      kelas: data.kelas,
      email: data.email,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      profilePicture: data.profilePicture,
    })
    await student.save()

    return response.ok({
      message: 'Siswa berhasil diperbarui',
      data: student,
    })
  }

  public async destroy({ params, response }: HttpContext) {
    const student = await Student.find(params.id)
    if (!student) {
      return response.notFound({ message: 'Siswa tidak ditemukan' })
    }

    await student.delete()
    return response.ok({
      message: 'Siswa berhasil dihapus',
    })
  }
}