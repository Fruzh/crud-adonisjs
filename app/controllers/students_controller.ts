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
    })

    const data = await request.validate({ schema: studentSchema })

    // Cek apakah NIS sudah ada
    const existing = await Student.query().where('nis', data.nis).first()
    if (existing) {
      return response.conflict({ message: 'NIS sudah digunakan' })
    }

    const student = await Student.create(data)

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
    })

    const data = await request.validate({ schema: studentSchema })

    student.merge(data)
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
