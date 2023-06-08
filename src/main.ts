import express from 'express';

const app = express();

const port = process.env.BACKEND_PORT;

app.get('/', (req, res) => {
    res.send("Hello world!").end()
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})