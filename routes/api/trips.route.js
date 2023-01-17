const router = require('express').Router();

const Trip = require('../../models/trip.model');

router.get('/', async (req, res) => {
    console.log('entrando aca');
    try {
        const trips = await Trip.find();
        res.json(trips);
    } catch (err){
        res.status(500).json({error: 'Ha ocurrido un error al traer viajes'});
        console.log(err);
    }
});

router.post('/', async (req, res) => {
    try{
        const newTrip = await Trip.create(req.body);
        res.json(newTrip);
    } catch{
        res.status(500).json({error: 'Ha ocurrido un error al insertar viaje'});
    }
});

router.put('/:tripId', async (req, res) => {
    try{
        const tripEdit = await Trip.findByIdAndUpdate(
            req.params.tripId,
            req.body,
            { new: true}
        );
        res.json(tripEdit);
    } catch(error){
        res.status(500).json({error: 'Ha ocurrido un error al actualizar viaje'});
    }
});

router.delete('/:tripId', async (req, res) => {
    try{
        const trip = await Trip.findByIdAndDelete(req.params.tripId);
        res.json(trip); 
    } catch(error){
        res.status(500).json({error: 'Ha ocurrido un error al eliminar viaje'});
    }
});


module.exports = router;