import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/helpers/mongo-helper'
import { AppointmentMongoRepository } from './appointment-mongo-repository'
import { mockAddAppointmentParams } from '@/domain/test'
import MockDate from 'mockdate'

let appointmentCollection: Collection

describe('Appointment Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    appointmentCollection = await MongoHelper.getCollection('appointments')
    await appointmentCollection.deleteMany({})
  })

  const makeSut = (): AppointmentMongoRepository => {
    return new AppointmentMongoRepository()
  }

  describe('Add', () => {
    test('Should return an appointment on add success', async () => {
      const sut = makeSut()
      const appointment = await sut.add(mockAddAppointmentParams())
      expect(appointment).toBeTruthy()
      expect(appointment.id).toBeTruthy()
      expect(appointment.name).toBe('any_name')
      expect(appointment.birthday).toEqual(new Date(new Date().setFullYear(new Date().getFullYear() - 20)))
      expect(appointment.appointment_date).toEqual(new Date(new Date().setDate(new Date().getDate() + 1)))
    })

    describe('LoadByName()', () => {
      test('Should return an appointment on loadByName success', async () => {
        const sut = makeSut()
        await appointmentCollection.insertOne(mockAddAppointmentParams())
        const appointment = await sut.loadByName('any_name')
        expect(appointment).toBeTruthy()
        expect(appointment.id).toBeTruthy()
        expect(appointment.name).toBe('any_name')
        expect(appointment.birthday).toEqual(new Date(new Date().setFullYear(new Date().getFullYear() - 20)))
        expect(appointment.appointment_date).toEqual(new Date(new Date().setDate(new Date().getDate() + 1)))
      })

      test('Should return null if loadByName fails', async () => {
        const sut = makeSut()
        const appointment = await sut.loadByName('any_name')
        expect(appointment).toBeFalsy()
      })
    })
    describe('LoadById()', () => {
      test('Should return an appointment on loadById success', async () => {
        const res = await appointmentCollection.insertOne(mockAddAppointmentParams())
        const sut = makeSut()
        const appointment = await sut.loadById(res.ops[0]._id)
        expect(appointment).toBeTruthy()
        expect(appointment.id).toBeTruthy()
      })
      /* OLHAR ISSO
        test('Should return null if loadById fails', async () => {
        const sut = makeSut()
        const appointment = await sut.loadById('any_id')
        expect(appointment).toBeFalsy()
      })
      */
    })
  })
})