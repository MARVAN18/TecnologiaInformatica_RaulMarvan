const express = require('express')
const app = express()
const port = 3000

/*app.get('/:name', (req, res) => {
    console.log(req.query);
    console.log(req.params);
    res.send(`<h3>Hello ${req.params.name}!</h3>`)
});*/

app.post('/alumnos', (req,res)=>{
    res.json ([{'name' : 'Cucho'},{'name' : 'Raul'}, {'name' : 'Octavio'}, {'name' : 'Diana'}]);
});

app.post('/alumnos/:name',(req,res)=>{
    res.json({'name' : `${req.params.name}`});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
