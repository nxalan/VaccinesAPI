import { HttpResponse, HttpRequest, Controller, AddAppointment, Validation, LoadAppointmentById } from '.'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError, NameInUseError } from '@/presentation/errors'

export class AddAppointmentController implements Controller {
  constructor (
    private readonly addAppointment: AddAppointment,
    private readonly loadAppointmentById: LoadAppointmentById,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const appointment_id = httpRequest.params?.appointment_id
      if (appointment_id) {
        const storedAppointment = await this.loadAppointmentById.loadById(appointment_id)
        if (!storedAppointment) {
          return forbidden(new InvalidParamError('appointment_id'))
        }
      }
      const { name, birthday, appointment_date } = httpRequest.body
      const appointment = await this.addAppointment.add({
        appointment_id,
        name,
        birthday,
        appointment_date
      })
      if (!appointment) {
        return forbidden(new NameInUseError())
      }
      return ok(appointment)
    } catch (error) {
      return serverError(error)
    }
  }
}