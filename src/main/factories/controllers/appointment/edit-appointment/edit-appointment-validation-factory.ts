import { ValidationComposite, DateValidation, DayValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { makeDbLoadAppointmentsByDay } from '@/main/factories/usecases/appointment/load-appointments-by-day/db-load-appointments-by-day-factory'

export const makeEditAppointmentValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['birthday', 'appointment_date']) {
    validations.push(new DateValidation(field))
  }

  for (const field of ['appointment_date']) {
    validations.push(new DayValidation(field, makeDbLoadAppointmentsByDay()))
  }

  return new ValidationComposite(validations)
}
