import { DayValidation } from './day-validation'
import { LoadAppointmentsByDay } from '@/domain/usecases/appointment'
import { InvalidParamError } from '@/presentation/errors'
import { mockLoadAppointmentsByDay } from '@/validation/test'
import MockDate from 'mockdate'
import { mockListOfEditAppointmentParamsWithDifferentHours } from '@/domain/test'

type SutTypes = {
  sut: DayValidation
  loadAppointmentsByDayStub: LoadAppointmentsByDay
}

const makeSut = (): SutTypes => {
  const loadAppointmentsByDayStub = mockLoadAppointmentsByDay()
  const sut = new DayValidation('appointment_date', loadAppointmentsByDayStub)
  return {
    sut,
    loadAppointmentsByDayStub
  }
}

describe('Day Validation', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should mockLoadAppointmentsByDay return the correct values', async () => {
    const { loadAppointmentsByDayStub } = makeSut()
    const mockLoadAppointmentsByDay = await loadAppointmentsByDayStub.loadByDay(null as any)
    expect(mockLoadAppointmentsByDay.length).toEqual(20)
  })

  test('Should return if date is not defined', async () => {
    const { sut } = makeSut()
    const response = await sut.validate({ appointment_date: undefined })
    expect(response).toBeFalsy()
  })

  test('Should return an error if DayValidator returns false', async () => {
    const { sut, loadAppointmentsByDayStub } = makeSut()
    jest.spyOn(loadAppointmentsByDayStub, 'loadByDay').mockReturnValueOnce(Promise.resolve(mockListOfEditAppointmentParamsWithDifferentHours(20)))
    const response = await sut.validate({ appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)) })
    expect(response).toEqual(new InvalidParamError('appointment_date day, the chosen day is already full'))
  })

  test('Should return if date is a valid day', async () => {
    const { sut, loadAppointmentsByDayStub } = makeSut()
    jest.spyOn(loadAppointmentsByDayStub, 'loadByDay').mockReturnValueOnce(Promise.resolve(mockListOfEditAppointmentParamsWithDifferentHours(19)))
    const response = await sut.validate({ appointment_date: new Date(new Date().setDate(new Date().getDate() + 1)) })
    expect(response).toBeFalsy()
  })
})
