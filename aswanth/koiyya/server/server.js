const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
  initializeDatabase,
  listArticles,
  findArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('./config/db');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', async (req, res) => {
  const status = await initializeDatabase();

  res.json({
    status: status.connected ? 'ok' : 'error',
    database: 'sqlite',
    databaseFile: status.file || null,
    message: 'NovaWire newsroom API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/articles', async (req, res) => {
  const { category } = req.query;

  try {
    const articles = await listArticles({ category: category || 'Home' });
    return res.json(articles);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch articles', error: error.message });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const article = await findArticleById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.json(article);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch article', error: error.message });
  }
});

app.post('/api/admin/articles', async (req, res) => {
  const { title, category, summary, content, image, author, readTime, featured } = req.body;

  if (!title || !summary || !content || !author) {
    return res.status(400).json({ message: 'Title, summary, content, and author are required.' });
  }

  try {
    const article = await createArticle({ title, category, summary, content, image, author, readTime, featured });
    return res.status(201).json({ message: 'Article created successfully', id: article.id, slug: article.slug });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create article', error: error.message });
  }
});

app.put('/api/admin/articles/:id', async (req, res) => {
  const { title, category, summary, content, image, author, readTime, featured } = req.body;

  try {
    const updatedArticle = await updateArticle(req.params.id, { title, category, summary, content, image, author, readTime, featured });

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.json({ message: 'Article updated successfully', article: updatedArticle });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update article', error: error.message });
  }
});

app.delete('/api/admin/articles/:id', async (req, res) => {
  try {
    const removed = await deleteArticle(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete article', error: error.message });
  }
});

async function startServer() {
  const status = await initializeDatabase();
  if (!status.connected) {
    console.warn('⚠️ SQLite database was not initialized.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📦 SQLite database file: ${status.file || 'unavailable'}`);
  });
}

startServer();
