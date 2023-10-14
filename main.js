const express = require('express')
const app = express()
 
// app.get('/', (req, res) => res.send('Hello World!'))
app.get("/", function(req, res){
  return res.send("Hello World!");
});

app.get("/page", function(req, res){
  return res.send("Hello Page!");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))