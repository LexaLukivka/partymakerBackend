module.exports = class Create {

  // noinspection JSUnusedGlobalSymbols
  get rules() {
    return {
      name: 'required',
      email: 'required|email|unique:users,email',
      phone: 'required|unique:users,phone',
      password: 'required',
      avatar_url: 'url',
      provider_id: 'integer',
      provider: 'in:google,facebook',
      provider_token: 'string',
    }
  }

  // noinspection JSUnusedGlobalSymbols
  get messages() {
    return {
      'name.required': 'Имя и Фамилия пользователя обязательны',
      'email.required': 'email пользователя обязательн',
      'email.email': 'Неправильный формат почты',
      'email.unique': 'Пользователь с такой почтой уже есть',
      'phone.required': 'телефон пользователя обязательн',
      'phone.unique': 'Пользователь с таким телефоном уже есть',
      'password.required': 'пароль пользователя обязательн',
      'avatar_url.url': 'фото пользователя должно быть в виде сслыки',
    }
  }

  // noinspection JSUnusedGlobalSymbols
  get validateAll() {
    return true
  }
}
