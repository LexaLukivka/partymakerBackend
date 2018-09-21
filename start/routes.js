/* eslint-disable max-len */
const Route = use('Route')

const SUD = new Map([[['store', 'update', 'destroy'], ['auth']]])

Route.get('/', () => 'Server is running')
/**
 *
 * Authentication routes
 *
 * */
Route.post('login', 'AuthController.login').validator('Auth/Login')
Route.post('register', 'AuthController.register').validator('Auth/Register')
Route.post('login/facebook', 'AuthController.facebook')
Route.post('login/google', 'AuthController.google')
Route.get('user', 'AuthController.user').middleware('auth')

/**
 *
 * User routes
 *
 * */
Route.resource('users', 'UserController')
  .validator([['users.store', 'User/Create'], ['users.update', 'User/Edit']])
  .middleware(SUD)

/**
 *
 * Places routes
 *
 * */

Route.resource('places', 'PlaceController')
  .validator([['places.store', 'Place/Create'], ['places.update', 'Place/Edit']])
  .middleware(SUD)

/**
 *
 * Group routes
 *`
 * */
Route.resource('group/:group_id/users', 'Group/UserController').middleware('auth')
Route.resource('group', 'GroupController')
  .validator([['group.store', 'Group/Create'], ['group.update', 'Group/Edit']])
  .middleware(SUD)

Route.resource('group/:group_id/users', 'Group/UserController').middleware('auth')


/**
 *
 * Events routes
 *`
 * */
Route.resource('events', 'Events/EventsController')
  .validator([['events.store', 'Events/Store']])
  .middleware(SUD)

/**
 *
 * Places routes
 *
 * */

Route.resource('places/:place_id/votes', 'Place/RatingController').middleware('auth')
Route.resource('places', 'Place/PlaceController').middleware(SUD)

Route.put('settings', 'SettingsController.update').middleware('auth')

Route.resource('upload', 'UploadController')
