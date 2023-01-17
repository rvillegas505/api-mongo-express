const mongoose = require('mongoose');
const Trip = require('../models/trip.model');


(async () => {
    await mongoose.connect('mongodb://localhost:27017/familyTrips');

    const newTrip = await Trip.create({
        name: 'prueba de viaje',
        description: 'Prueba de descripcion',
        destination: 'berlin',
        category: 'amigos',
        start_date: '2022-05-02'
    });

    console.log(newTrip);
})();