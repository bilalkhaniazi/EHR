var express = require('express')
var router = express.Router()

router.post('/', (req, res) => {
    const {labs, orders} = req.body;

    if (orders.length === 0 && labs.length === 0) {
        return res.status(400).json({message: 'Unsuccessful SimStudio submission.'})
    };
    console.log(labs, orders)
    res.status(201).json({
        message: "Data received successfully.",
        receivedData: {
            orderItemsCount: orders ? orders.length : 0,
            labResultsCount: labs ? labs.length : 0,
        },       
    })
});

router.get('/', function(res, req, next) {
    const medication = {
        id: Date.now(),
        selectedMed: Milrinone,
        dose: 2.5,
        priority: 'NOW',
        frequency: 'Continuous',
        comments: "",
        adminInstructions: "asdf",    
    }

    res.json(medication)
})
module.exports = router