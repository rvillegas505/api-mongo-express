const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const tripModel = require('../../models/trip.model');


describe('Pruebas sobre la api de trips', () => {

    beforeAll( async () => {
        await mongoose.connect('mongodb://localhost:27017/familyTrips');
    });

    afterAll( async () => {
        await mongoose.disconnect();
    })

    describe('GET /api/trips', ()=> {

        let response;
        beforeEach( async () => {
            response = await request(app).get('/api/trips').send();
        });

        it('La ruta funciona', async () => {
            // const response = await request(app).get('/api/trips').send();
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('La peticion devuelve un array de viajes', async () => {
            expect(response.body).toBeInstanceOf(Array);

        });

    });

    describe('POST /api/trips', () => {

        const newTrip = {
            name: 'test trip',
            destination: 'milan',
            category: 'familiar',
            start_date: '2022-05-05'
        }

        const wrongTrip = {
            nombre: 'test trip',
            destination: 'milan',
            category: 'familiar',
            start_date: '2022-05-05'
        }

        afterAll(async () => {
            await tripModel.deleteMany({ name: 'test trip'});
        })

        it('la ruta funcione', async () => {
            const response = await request(app).post('/api/trips').send(newTrip);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('se inserta correctamente', async () => {
            const response = await request(app).post('/api/trips').send(newTrip);

            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(newTrip.name);
        });

        it('error en la insercion del viaje', async () => {
            const response = await request(app).post('/api/trips').send(wrongTrip);

            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        })
    });

    describe('PUT /api/trips', () => {

        let trip;
        beforeEach( async () => {
            trip = await tripModel.create({
                name: 'test trip',
                destination: 'barcelona',
                category: 'amigos',
                start_date: '2023-06-06'
            });
        });

        afterEach( async () => {
            await tripModel.findByIdAndDelete(trip._id);
        });

        it('La ruta funciona', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({
                name: 'trip updated'
            });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');

        });

        it('se actualiza el viaje correctamente', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({
                name: 'trip updated'
            });
            
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('trip updated');

        })
    });

    describe('DELETE /api/trips', () => {

        let trip;
        let response;
        beforeEach(async () => {
            trip = await tripModel.create({
                name: 'test trip',
                destination: 'madrid',
                category: 'familiar',
                start_date: '2022-05-05'
            });
            response = await request(app).delete(`/api/trips/${trip._id}`).send();
        });

        it('la ruta funciona', () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Borra correctamente', async () => {
            expect(response.body._id).toBeDefined();

            const foundTrip = await tripModel.findById(trip._id);
            expect(foundTrip).toBeNull();
        })
        
    })
})