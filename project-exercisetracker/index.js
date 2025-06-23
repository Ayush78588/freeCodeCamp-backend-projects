const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/mongoose')
const userModel = require('./models/user');

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post('/api/users', async function (req, res) {
  const un = req.body.username;
  let user = await userModel.create({
    username: un,
    count: 0
  });
  res.json({
    username: un,
    _id: user._id
  });
});
app.get('/api/users', async function (req, res) {
  const user = await userModel.find({}, { username: 1 });
  res.send(user);
});
app.post('/api/users/:id/exercises', async function (req, res) {
  let { description, duration, date } = req.body;
  const formatedDate = date ? new Date(date).toDateString() : new Date().toDateString()

  // First find the user
  const user = await userModel.findByIdAndUpdate(req.params.id, { $inc: { count: 1 }, $push: { log: { description, duration, date: formatedDate } } }, { new: true });
  res.json({
    _id: user._id,
    username: user.username,
    description: description,
    duration: Number(duration),
    date: formatedDate
  });
});

app.get('/api/users/:id/logs', async function (req, res) {
  let user = await userModel.findOne({ _id: req.params.id }, { __v: 0 });
  let { from, to, limit } = req.query;
  let fromDate = from ? new Date(from) : null;
  let toDate = to ? new Date(to) : null;

  let arr = user.log.filter(function (ele) {
    let date = new Date(ele.date);
    return (date >= fromDate || !fromDate) && (date <= toDate || !toDate)
  });
  if (limit) {
    arr = arr.filter(function (ele, i) {
      return i < limit
    });
  }

  arr = arr.map((entry) => ({
    description: entry.description,
    duration: entry.duration,
    date: typeof entry.date === 'string'
      ? entry.date
      : new Date(entry.date).toDateString()
  }));


  res.json({
    _id: user._id,
    username: user.username,
    count: arr.length,
    log: arr
  });
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
