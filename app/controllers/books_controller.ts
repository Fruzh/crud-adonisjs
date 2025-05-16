// app/controllers/books_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Book from '#models/book'
import { schema, rules } from '@adonisjs/validator'

export default class BooksController {
    public async index({ response }: HttpContext) {
        const books = await Book.all()
        return response.ok({
            message: 'Berhasil mengambil data buku',
            data: books,
        })
    }

    public async store({ request, response }: HttpContext) {
        const bookSchema = schema.create({
            title: schema.string({}, [rules.maxLength(255)]),
            author: schema.string({}, [rules.maxLength(255)]),
        })

        const data = await request.validate({ schema: bookSchema })
        const book = await Book.create(data)

        return response.created({
            message: 'Buku berhasil ditambahkan',
            data: book,
        })
    }

    public async show({ params, response }: HttpContext) {
        const book = await Book.find(params.id)
        if (!book) {
            return response.notFound({
                message: 'Buku tidak ditemukan',
            })
        }

        return response.ok({
            message: 'Berhasil mengambil data buku',
            data: book,
        })
    }

    public async update({ params, request, response }: HttpContext) {
        const book = await Book.find(params.id)
        if (!book) {
            return response.notFound({ message: 'Buku tidak ditemukan' })
        }

        const bookSchema = schema.create({
            title: schema.string({}, [rules.maxLength(255)]),
            author: schema.string({}, [rules.maxLength(255)]),
        })

        const data = await request.validate({ schema: bookSchema })

        book.merge(data)
        await book.save()

        return response.ok({
            message: 'Buku berhasil diperbarui',
            data: book,
        })
    }

    public async destroy({ params, response }: HttpContext) {
        const book = await Book.find(params.id)
        if (!book) {
            return response.notFound({ message: 'Buku tidak ditemukan' })
        }

        await book.delete()
        return response.ok({
            message: 'Buku berhasil dihapus',
        })
    }
}
