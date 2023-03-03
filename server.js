const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
mongoose.connect('mongodb://127.0.0.1:27017/collection',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("connection open"))
.catch((err)=>console.log("connection failed"))
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
const Article = mongoose.model('Article', articleSchema);
app.get('/', async (req, res) => {
  const articles = await Article.find().sort('-createdAt');
  res.render('index', { articles });
});
app.get('/articles/new', (req, res) => {
  res.render('new');
});
app.post('/articles', async (req, res) => {
  const { title, content } = req.body;
  const article = new Article({ title, content });
  await article.save();
  res.redirect('/');
});
app.get('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  res.render('show', { article });
});
app.get('/articles/:id/edit', async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  res.render('edit', { article });
});
app.patch('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const article = await Article.findByIdAndUpdate(id, { title, content }, { new: true });
  res.redirect(`/articles/${article.id}`);
});
app.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  await Article.findByIdAndDelete(id);
  res.redirect('/');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
