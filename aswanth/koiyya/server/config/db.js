const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.resolve(__dirname, '../data');
const databaseFile = path.join(dataDir, 'newsroom.db');
const schemaFile = path.join(dataDir, 'schema.sql');

function ensureStorage() {
  fs.mkdirSync(dataDir, { recursive: true });

  if (!fs.existsSync(schemaFile)) {
    fs.writeFileSync(schemaFile, `
      CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        email TEXT,
        avatar TEXT,
        bio TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        author_id INTEGER,
        category_id INTEGER,
        read_time TEXT DEFAULT '5 min read',
        featured INTEGER DEFAULT 0,
        published_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES authors(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
      );
    `);
  }
}

function openDatabase() {
  ensureStorage();
  return new sqlite3.Database(databaseFile);
}

function parseContent(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [String(parsed || '')].filter(Boolean);
  } catch (error) {
    return [String(value)];
  }
}

function normalizeArticle(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category || 'General',
    summary: row.summary,
    content: parseContent(row.content),
    image: row.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    author: row.author || 'Staff Writer',
    readTime: row.read_time || '5 min read',
    featured: Boolean(row.featured),
    publishedAt: row.published_at || new Date().toISOString(),
  };
}

function slugify(value) {
  return String(value || 'untitled-story')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-story';
}

const defaultArticles = [
  {
    title: 'AI infrastructure spending is reshaping the next decade of global growth',
    category: 'Tech',
    summary: 'Chipmakers, cloud providers, and power grids are racing to support the infrastructure needed for an AI-powered economy.',
    content: [
      'A new wave of capital is moving from software experimentation into physical infrastructure, with data centers, power systems, and semiconductor supply chains taking center stage.',
      'The scale of AI demand has pushed cloud providers and utilities to rethink capacity planning, cooling, and long-term network reliability.',
      'Analysts say the next growth cycle will reward firms that can combine compute throughput with sustainable energy and resilient delivery systems.'
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    author: 'Ava Brooks',
    readTime: '6 min read',
    featured: true,
  },
  {
    title: 'Cities are rebuilding power systems around climate risk, not just demand forecasts',
    category: 'World',
    summary: 'Urban resilience budgets are shifting toward backup energy, smart grids, and more reliable service during extreme weather events.',
    content: [
      'Local governments are reevaluating utilities as part of public resilience planning rather than a back-office service.',
      'The new design priorities include faster restoration, diversified supply, and adaptive infrastructure that can withstand repeated shocks.',
      'The result is a more practical model of city planning focused on continuity, trust, and everyday stability.'
    ],
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    author: 'Lina Morris',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'Productivity software buyers are demanding measurable returns before expansion',
    category: 'Business',
    summary: 'The market is shifting from feature-first pitches to proof-heavy adoption and direct ROI claims.',
    content: [
      'Enterprise buyers are looking for quicker payback and clearer operational gains, especially in workflow automation and reporting tools.',
      'Product teams are trimming feature sprawl to concentrate on specific pain points and measurable wins for teams under cost pressure.',
      'Investors are increasingly rewarding disciplined revenue quality over rapid but unfocused product expansion.'
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    author: 'David Chen',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'Turnout models are tightening as local trust and digital access reshape election strategy',
    category: 'Politics',
    summary: 'Campaigns are recalibrating toward neighborhood-level credibility, youth participation, and turnout quality.',
    content: [
      'Campaign teams are moving away from broad messaging alone and toward targeted ground operations that can verify community trust and turnout intent.',
      'The political story this cycle is increasingly local, with voters responding to services, neighborhood access, and clarity of leadership more than broad narratives.',
      'Operators say credibility and follow-through now matter as much as reach in determining success.'
    ],
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    author: 'Elliot Price',
    readTime: '4 min read',
    featured: false,
  },
  {
    title: 'Edge networks are bringing AI closer to the places where latency and trust matter most',
    category: 'Tech',
    summary: 'Distributed compute is becoming essential in retail, healthcare, and public infrastructure that cannot afford cloud lag.',
    content: [
      'Edge deployments are moving from experimental pilots into production systems where real-time response is critical.',
      'The advantage is not only lower latency but also better control over privacy, bandwidth use, and operational continuity.',
      'Businesses increasingly see edge architecture as a practical way to strengthen resilience and decision speed.'
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author: 'Nina Shah',
    readTime: '8 min read',
    featured: false,
  },
  {
    title: 'Publishers are investing in trust as the core growth metric behind audience loyalty',
    category: 'World',
    summary: 'Media businesses are shifting from raw reach to deeper community trust, quality context, and accountability.',
    content: [
      'Audiences are rewarding outlets that explain complexity and remain transparent about editorial standards and sourcing.',
      'Trust is now a visible business metric affecting subscriptions, partnerships, and brand health.',
      'Publishing teams increasingly frame product strategy around durable reader relationships rather than performance spikes alone.'
    ],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    author: 'Mila Foster',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'Transit agencies are prioritizing electric routes and safer access over expansion alone',
    category: 'Business',
    summary: 'Mobility planning is becoming more focused on reliability, affordability, and public access for underserved communities.',
    content: [
      'Transit modernization is now being measured by how effectively systems support work, education, and healthcare access.',
      'Cities are tying fleet upgrades to rider outcomes, cleaner operations, and improvements in daily reliability.',
      'The most successful plans balance infrastructure spending with public trust and neighborhood-level access.'
    ],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
    author: 'Samir Johnson',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'Policy labs are moving from pilots to measurable public outcomes and faster delivery',
    category: 'Politics',
    summary: 'Government innovation teams are being judged by visible resident outcomes, scale, and service quality.',
    content: [
      'Smaller pilot programs are being replaced by operational testing that ties innovation to delivery and accountability.',
      'Public leaders are increasingly focused on reducing the gap between a promising experiment and a reliable service that residents can use daily.',
      'The new benchmark is practical impact, not ideation alone.'
    ],
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    author: 'Harper Wells',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'Healthcare systems are using smarter data to connect treatment, staffing, and patient flow',
    category: 'Business',
    summary: 'Operational analytics is helping hospitals improve care continuity while reducing administrative friction.',
    content: [
      'Healthcare organizations are looking beyond dashboards toward workflow systems that blend staffing, patient flow, and treatment planning into one view.',
      'The focus is becoming more practical: fewer delays, clearer transitions, and more consistent patient experience across departments.',
      'Executives say the next gains will come from better coordination rather than isolated efficiency projects.'
    ],
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895977?auto=format&fit=crop&w=1200&q=80',
    author: 'Olivia Grant',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'New climate financing models are shifting capital toward resilient infrastructure and local adaptation',
    category: 'World',
    summary: 'Investors are expanding focus beyond clean energy toward adaptation, resilience, and community-level repair.',
    content: [
      'Public and private investors are becoming more interested in projects that reduce exposure to disaster losses and support faster recovery.',
      'The new financing models are designed to align capital with resilience outcomes over longer investment horizons.',
      'Experts say resilience is becoming a core economic concern rather than an environmental add-on.'
    ],
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    author: 'Iris Bell',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'Startup founders are rethinking product design around focus, trust, and slower growth',
    category: 'Tech',
    summary: 'The market is rewarding cleaner product strategy, deeper customer understanding, and steadier execution.',
    content: [
      'Founders are increasingly trimming expansion plans to stay focused on the few workflows that genuinely improve customer outcomes.',
      'Product design is moving toward clarity, fewer frictions, and trust-building communication over excitement-led launches.',
      'The result is a more durable startup model built around product-market fit rather than growth theater.'
    ],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    author: 'Marcus Hill',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'Fiscal policy debates are shifting toward long-term public capacity, not short-term stimulus alone',
    category: 'Politics',
    summary: 'Policymakers are widening the conversation around durable institutions, service capacity, and public investment quality.',
    content: [
      'A new policy conversation is emerging around what governments can reliably deliver beyond emergency responses and short-term recovery spending.',
      'The debate is increasingly centered on public capacity, administrative efficiency, and resilience across housing, energy, and digital services.',
      'Observers say the strongest plans connect immediate policy needs to long-term trust and institutional quality.'
    ],
    image: 'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1200&q=80',
    author: 'Rachel Gomez',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'Why art spaces are becoming the new economic signal for city growth',
    category: 'Culture',
    summary: 'Creative districts are increasingly acting as early indicators of neighborhood vitality, tourism, and investment confidence.',
    content: [
      'Cultural venues are now being watched closely as signals of economic momentum and community confidence, especially in neighborhoods undergoing rapid change.',
      'Developers and local leaders are using creative programming to shape identity, attract talent, and give residents a stronger sense of place.',
      'The economic story is no longer just about office space and housing; it is also about the cultural infrastructure that helps communities thrive.'
    ],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    author: 'Sofia Hart',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'The next energy grid is local, modular, and built for climate shocks',
    category: 'Climate',
    summary: 'Utilities are moving away from centralized systems and toward resilient local networks that can absorb disruption faster.',
    content: [
      'Climate adaptation is forcing grid planners to think differently about redundancy, flexibility, and local energy independence.',
      'New infrastructure models prioritize modular generation, storage, and public reliability over single-point dependency.',
      'The more resilient system is not necessarily the biggest one but the one that can recover quickly and maintain trust during disruption.'
    ],
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
    author: 'Noah Reeves',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'The real AI shift is not speed — it is governance, trust, and human accountability',
    category: 'Analysis',
    summary: 'The next phase of AI adoption is being shaped by policy discipline, management quality, and a clearer use of human oversight.',
    content: [
      'Leaders are moving past the excitement phase and asking harder questions about accountability, governance, and operational safety.',
      'The strongest AI strategies are building trust into workflows rather than assuming adoption alone will drive value.',
      'The organizations likely to win are those that combine compute capability with responsible oversight and realistic risk management.'
    ],
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    author: 'Amelia Stone',
    readTime: '8 min read',
    featured: true,
  }
];

async function seedDefaultArticles(db) {
  const countRow = await getRow(db, 'SELECT COUNT(*) AS total FROM articles');
  const total = Number(countRow?.total || 0);

  if (total >= defaultArticles.length) return;

  for (const article of defaultArticles) {
    const existing = await getRow(db, 'SELECT id FROM articles WHERE title = ? LIMIT 1', [article.title]);
    if (existing) continue;

    const authorId = await ensureAuthor(db, article.author);
    const categoryId = await ensureCategory(db, article.category);
    const slug = `${slugify(article.title)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await runSql(
      db,
      `INSERT INTO articles (slug, title, summary, content, image, author_id, category_id, read_time, featured, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        article.title,
        article.summary,
        JSON.stringify(article.content),
        article.image,
        authorId,
        categoryId,
        article.readTime || '5 min read',
        article.featured ? 1 : 0,
        new Date().toISOString(),
      ],
    );
  }
}

function runSql(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function runCallback(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getRow(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row || null);
    });
  });
}

function getAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows || []);
    });
  });
}

async function initializeDatabase() {
  const db = openDatabase();

  try {
    const schema = fs.readFileSync(schemaFile, 'utf8');
    await new Promise((resolve, reject) => {
      db.exec(schema, (error) => (error ? reject(error) : resolve()));
    });

    await seedDefaultArticles(db);

    return { connected: true, file: databaseFile };
  } catch (error) {
    console.warn('⚠️ Could not initialize SQLite database file.');
    console.warn(error.message);
    return { connected: false, error };
  } finally {
    db.close();
  }
}

async function withDatabase(operation) {
  const db = openDatabase();

  try {
    return await operation(db);
  } finally {
    db.close();
  }
}

async function ensureAuthor(db, name) {
  const safeName = (name || 'Staff Writer').trim();
  const existing = await getRow(db, 'SELECT id FROM authors WHERE name = ? LIMIT 1', [safeName]);

  if (existing) return existing.id;

  const result = await runSql(db, 'INSERT INTO authors (name) VALUES (?)', [safeName]);
  return result.id;
}

async function ensureCategory(db, category) {
  const safeName = (category || 'General').trim();
  const safeSlug = slugify(safeName) || 'general';

  const existing = await getRow(db, 'SELECT id FROM categories WHERE slug = ? OR name = ? LIMIT 1', [safeSlug, safeName]);

  if (existing) return existing.id;

  const result = await runSql(db, 'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', [safeName, safeSlug, `Stories about ${safeName}`]);
  return result.id;
}

async function listArticles(filters = {}) {
  const { category } = filters;

  return withDatabase(async (db) => {
    let query = `
      SELECT a.*, au.name AS author, c.name AS category
      FROM articles a
      LEFT JOIN authors au ON au.id = a.author_id
      LEFT JOIN categories c ON c.id = a.category_id
    `;
    const params = [];

    if (category && category !== 'Home') {
      query += ' WHERE c.name = ?';
      params.push(category);
    }

    query += ' ORDER BY a.published_at DESC, a.id DESC';
    const rows = await getAll(db, query, params);
    return rows.map(normalizeArticle);
  });
}

async function findArticleById(id) {
  return withDatabase(async (db) => {
    const row = await getRow(
      db,
      `
        SELECT a.*, au.name AS author, c.name AS category
        FROM articles a
        LEFT JOIN authors au ON au.id = a.author_id
        LEFT JOIN categories c ON c.id = a.category_id
        WHERE a.id = ?
        LIMIT 1
      `,
      [id],
    );

    return row ? normalizeArticle(row) : null;
  });
}

async function createArticle(articleInput) {
  const { title, category, summary, content, image, author, readTime, featured } = articleInput;

  if (!title || !summary || !content || !author) {
    throw new Error('Title, summary, content, and author are required.');
  }

  const articleContent = Array.isArray(content) ? content : [content];
  const safeCategory = category || 'General';

  return withDatabase(async (db) => {
    const authorId = await ensureAuthor(db, author);
    const categoryId = await ensureCategory(db, safeCategory);
    const slug = `${slugify(title)}-${Date.now()}`;

    const result = await runSql(
      db,
      `
        INSERT INTO articles (slug, title, summary, content, image, author_id, category_id, read_time, featured, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        slug,
        title,
        summary,
        JSON.stringify(articleContent),
        image || '',
        authorId,
        categoryId,
        readTime || '5 min read',
        featured ? 1 : 0,
        new Date().toISOString(),
      ],
    );

    return { id: result.id, slug };
  });
}

async function updateArticle(id, articleInput) {
  const { title, category, summary, content, image, author, readTime, featured } = articleInput;

  return withDatabase(async (db) => {
    const authorId = await ensureAuthor(db, author || 'Staff Writer');
    const categoryId = await ensureCategory(db, category || 'General');

    const result = await runSql(
      db,
      `
        UPDATE articles
        SET title = ?, summary = ?, content = ?, image = ?, author_id = ?, category_id = ?, read_time = ?, featured = ?, published_at = ?
        WHERE id = ?
      `,
      [
        title,
        summary,
        JSON.stringify(Array.isArray(content) ? content : [content]),
        image || '',
        authorId,
        categoryId,
        readTime || '5 min read',
        featured ? 1 : 0,
        new Date().toISOString(),
        id,
      ],
    );

    if (!result.changes) {
      return null;
    }

    return findArticleById(id);
  });
}

async function deleteArticle(id) {
  return withDatabase(async (db) => {
    const result = await runSql(db, 'DELETE FROM articles WHERE id = ?', [id]);
    return result.changes > 0;
  });
}

module.exports = {
  initializeDatabase,
  listArticles,
  findArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  openDatabase,
  databaseFile,
};
