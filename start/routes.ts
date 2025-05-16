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
  return { hello: 'world' }
})

router.resource('/books', BooksController).apiOnly()
router.resource('/students', StudentsController).apiOnly()