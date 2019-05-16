const Room = use('App/Models/Room')
const Ws = use('Ws')
const Message = use('App/Models/Message')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with rooms
 */
class RoomController {
  /**
   * Show a list of all rooms.
   * GET /rooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index({ request, auth }) {
    const { page, limit } = request.all()

    return auth.user.rooms()
      .with('invite')
      .with('place')
      .paginate({ page, limit })
  }

  /**
   * Create/save a new room.
   * POST /rooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const fields = request.all()

    if (auth.user.cannot('create', Room)) {
      return response.forbidden()
    }

    const room = await Room.create({
      ...fields,
      admin_id: auth.user.id,
    })

    await room.users().attach([auth.user.id])

    return response.created(await Room.find(room.id))
  }

  /**
   * Display a single room.
   * GET /rooms/:id
   *
   * @param {object} ctx
   */
  async show({ params }) {
    return Room.find(params.id)
  }

  /**
   * Update room details.
   * PUT or PATCH /rooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const fields = request.all()
    const room = await Room.find(params.id)

    room.merge(fields)
    await room.save()

    return response.updated(room)
  }

  /**
   * Remove user from room.
   * DELETE /rooms/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy({ params, auth: { user }, response }) {
    const room = await Room.find(params.id)
    const chat = Ws.getChannel('room:*')
    const topic = chat.topic(`room:${room.id}`)

    if (topic) topic.broadcast('guest:left', user)

    await Message.create({
      text: `${user.name} покинул к событие`,
      room_id: room.id
    })

    await room.users().detach([user.id])
    return response.deleted(`${user.name} left ${room.title}`)
  }
}

module.exports = RoomController
