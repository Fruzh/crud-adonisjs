/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import BooksController from '#controllers/books_controller'
import StudentsController from '#controllers/students_controller'

router.get('/', async () => {
  return {
    status: 'berhasil',
    message: 'Selamat datang',
    endpoint: {
      books: {
        list: '/books',
        detail: '/books/:id',
        create: '/books',
        update: '/books/:id',
        delete: '/books/:id',
      },
      students: {
        list: '/students',
        detail: '/students/:id',
        create: '/students',
        update: '/students/:id',
        delete: '/students/:id',
      }
    }
  }
})


router.resource('/books', BooksController).apiOnly()
router.resource('/students', StudentsController).apiOnly()