import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const navItems = ['Home', 'World', 'Business', 'Politics', 'Tech', 'Culture', 'Climate', 'Analysis'];
const API_BASE = 'http://localhost:5000/api';

const emptyForm = {
  title: '',
  category: 'World',
  summary: '',
  content: '',
  author: '',
  readTime: '5 min read',
  image: '',
  featured: true,
};

function formatDate(value) {
  if (!value) return 'Today';
  try {
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Today';
  }
}

function getAccent(category) {
  const accents = {
    Home: 'cyan',
    World: 'blue',
    Business: 'green',
    Politics: 'gold',
    Tech: 'purple',
    Culture: 'rose',
    Climate: 'green',
    Analysis: 'gold',
  };
  return accents[category] || 'cyan';
}

function fetchJson(url, options = {}) {
  return fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || 'Request failed');
    }
    return payload;
  });
}

function Header() {
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);

  const handleStart = () => {
    navigate('/world');
  };

  const handleSubscribe = () => {
    setSubscribed(true);
    window.setTimeout(() => setSubscribed(false), 1800);
  };

  return (
    <header className="topbar-wrap">
      <Link to="/" className="brand-block" aria-label="NovaWire home">
        <span className="brand-mark">N</span>
        <div>
          <p className="brand-name">NovaWire</p>
          <span className="brand-subtitle">newsroom</span>
        </div>
      </Link>

      <nav className="primary-nav" aria-label="Main categories">
        {navItems.map((item) => (
          <NavLink
            key={item}
            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {item}
          </NavLink>
        ))}
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Admin
        </NavLink>
      </nav>

      <div className="header-tools">
        <button type="button" className="ghost-btn" onClick={handleStart}>Start</button>
        <button type="button" className="primary-btn" onClick={handleSubscribe}>
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>
    </header>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function StoryCard({ story }) {
  return (
    <article className="story-card fade-up">
      <img src={story.image} alt={story.title} />
      <div className="story-body">
        <span className={`story-tag ${getAccent(story.category)}`}>{story.category}</span>
        <h3>{story.title}</h3>
        <p>{story.summary}</p>
        <div className="story-meta">
          <span>{story.readTime || '5 min read'}</span>
          <Link to={`/article/${story.id}`}>Read more</Link>
        </div>
      </div>
    </article>
  );
}

function HomePage({ articles }) {
  const featured = useMemo(() => articles.find((article) => article.featured) || articles[0], [articles]);
  const topStories = articles.slice(0, 6);
  const marketData = [
    { name: 'S&P 500', value: '5,436.19', delta: '+1.42%' },
    { name: 'NASDAQ', value: '17,802.64', delta: '+1.89%' },
    { name: 'NIFTY 50', value: '23,842.31', delta: '+0.87%' },
    { name: 'Crude Oil', value: '$77.18', delta: '-0.34%' },
  ];
  const trendingTopics = ['AI infrastructure', 'Global economy', 'Climate action', 'Startup funding', 'Sports analytics', 'Cultural shifts'];
  const quickStats = [
    { value: '2.4M', label: 'daily readers' },
    { value: '76', label: 'news desks' },
    { value: '18K', label: 'stories indexed' },
    { value: '4.8/5', label: 'reader rating' },
  ];
  const editorialSections = [
    { name: 'World', text: 'Global dispatch', count: articles.filter((item) => item.category === 'World').length },
    { name: 'Business', text: 'Market watch', count: articles.filter((item) => item.category === 'Business').length },
    { name: 'Politics', text: 'Policy desk', count: articles.filter((item) => item.category === 'Politics').length },
    { name: 'Tech', text: 'Signal report', count: articles.filter((item) => item.category === 'Tech').length },
    { name: 'Culture', text: 'Weekend lens', count: articles.filter((item) => item.category === 'Culture').length },
    { name: 'Climate', text: 'Resilience lab', count: articles.filter((item) => item.category === 'Climate').length },
    { name: 'Analysis', text: 'Deep explainers', count: articles.filter((item) => item.category === 'Analysis').length },
  ];

  if (!featured) {
    return <div className="empty-state">No articles available yet.</div>;
  }

  return (
    <>
      <div className="ticker-bar">
        <span className="ticker-label">Live</span>
        <div className="ticker-track">
          <span>AI investments surge in emerging markets</span>
          <span>Storm recovery funding expands across five cities</span>
          <span>Global policymakers accelerate climate resilience plans</span>
        </div>
      </div>

      <main className="dashboard-layout">
        <section className="hero-layout">
          <div className="featured-panel fade-up">
            <div className="featured-copy">
              <span className="eyebrow">Morning brief</span>
              <h1>{featured.title}</h1>
              <p>{featured.summary}</p>
              <div className="meta-row">
                <span>{featured.author}</span>
                <span>{formatDate(featured.publishedAt || featured.published_at)}</span>
                <span>{featured.readTime || '5 min read'}</span>
              </div>
              <div className="hero-actions">
                <Link to={`/article/${featured.id}`} className="primary-btn">Read the lead</Link>
                <Link to="/world" className="secondary-btn">Start reading</Link>
              </div>
            </div>
            <div className="featured-visual">
              <img src={featured.image} alt={featured.title} />
            </div>
          </div>

          <aside className="widgets-panel">
            <div className="panel-box fade-up">
              <SectionHeader eyebrow="Market pulse" title="Markets" />
              <div className="market-list">
                {marketData.map((item) => (
                  <div key={item.name} className="market-row">
                    <span>{item.name}</span>
                    <div>
                      <strong>{item.value}</strong>
                      <em>{item.delta}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-box fade-up">
              <SectionHeader eyebrow="Trending" title="Topics" />
              <div className="chip-row">
                {trendingTopics.map((topic) => (
                  <span key={topic} className="chip-item">{topic}</span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="stats-grid">
          {quickStats.map((stat) => (
            <div key={stat.label} className="stat-card fade-up">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="editorial-rail fade-up">
          <div className="section-banner">
            <span className="eyebrow">Coverage map</span>
            <h2>Today’s newsroom</h2>
          </div>
          <div className="explore-grid">
            {editorialSections.map((section) => (
              <Link
                key={section.name}
                to={section.name === 'Home' ? '/' : `/${section.name.toLowerCase()}`}
                className="explore-card"
              >
                <span>{section.text}</span>
                <strong>{section.name}</strong>
                <small>{section.count} reports</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="insight-grid">
          <div className="panel-box fade-up">
            <SectionHeader eyebrow="Analysis" title="What matters now" />
            <div className="list-stack">
              {articles.slice(0, 4).map((item) => (
                <div key={item.id} className="brief-item">
                  <span className="brief-tag">{item.category}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <small>{item.summary}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-box fade-up">
            <SectionHeader eyebrow="Culture" title="Weekend watch" />
            <div className="editor-list">
              {articles.slice(0, 3).map((item) => (
                <div key={`${item.id}-culture`} className="editor-item">
                  <h4>{item.title}</h4>
                  <span>{item.category} • {item.readTime || '5 min read'}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="content-grid">
          <section className="main-column fade-up">
            <SectionHeader eyebrow="Latest" title="Top stories" />
            <div className="story-grid">
              {topStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>

          <aside className="right-column">
            <div className="panel-box fade-up">
              <SectionHeader eyebrow="Briefing" title="Top stories" />
              <div className="list-stack">
                {topStories.slice(0, 4).map((item) => (
                  <div key={item.id} className="brief-item">
                    <span className="brief-tag">{item.category}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <small>{formatDate(item.publishedAt || item.published_at)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-box fade-up">
              <SectionHeader eyebrow="Editor’s pick" title="Deep reads" />
              <div className="editor-list">
                {articles.slice(0, 3).map((item) => (
                  <div key={item.id} className="editor-item">
                    <h4>{item.title}</h4>
                    <span>{item.category} • {item.readTime || '5 min read'}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

function CategoryPage({ articles, category }) {
  const items = useMemo(
    () => articles.filter((article) => article.category === category),
    [articles, category],
  );

  if (!items.length) {
    return <div className="empty-state">No stories yet for {category}.</div>;
  }

  const heroStory = items[0];
  const remaining = items.slice(1);

  return (
    <main className="category-page">
      <section className="category-hero fade-up">
        <div className="category-hero-copy">
          <span className="eyebrow">{category}</span>
          <h1>{heroStory.title}</h1>
          <p>{heroStory.summary}</p>
          <div className="meta-row">
            <span>{heroStory.author}</span>
            <span>{formatDate(heroStory.publishedAt || heroStory.published_at)}</span>
            <span>{heroStory.readTime || '5 min read'}</span>
          </div>
          <Link to={`/article/${heroStory.id}`} className="primary-btn inline-btn">Read story</Link>
        </div>
        <img src={heroStory.image} alt={heroStory.title} />
      </section>

      <div className="story-grid category-grid">
        {remaining.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </main>
  );
}

function ArticlePage({ articles }) {
  const { id } = useParams();
  const article = useMemo(
    () => articles.find((item) => String(item.id) === String(id)),
    [articles, id],
  );

  if (!article) {
    return <div className="empty-state">Article not found.</div>;
  }

  const related = articles
    .filter((item) => item.category === article.category && item.id !== article.id)
    .slice(0, 3);

  const contentParagraphs = Array.isArray(article.content)
    ? article.content
    : [article.summary, article.summary, article.summary];

  return (
    <main className="article-page fade-up">
      <article className="article-shell">
        <div className="article-hero">
          <div className="article-badge-row">
            <span className={`story-tag ${getAccent(article.category)}`}>{article.category}</span>
            <span className="read-time">{article.readTime || '5 min read'}</span>
          </div>
          <h1>{article.title}</h1>
          <div className="meta-row article-meta">
            <span>{article.author}</span>
            <span>{formatDate(article.publishedAt || article.published_at)}</span>
          </div>
        </div>

        <img className="article-image" src={article.image} alt={article.title} />

        <div className="article-body">
          {contentParagraphs.map((paragraph, index) => (
            <p key={`${article.id}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>

      <aside className="related-panel">
        <SectionHeader eyebrow="Related" title="More stories" />
        <div className="related-list">
          {related.map((item) => (
            <Link key={item.id} to={`/article/${item.id}`} className="related-item">
              <img src={item.image} alt={item.title} />
              <div>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </main>
  );
}

function AdminPage({ articles, refreshArticles }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      featured: Boolean(form.featured),
      content: (form.content || '').split('\n').filter(Boolean),
    };

    try {
      const url = editingId ? `${API_BASE}/admin/articles/${editingId}` : `${API_BASE}/admin/articles`;
      const method = editingId ? 'PUT' : 'POST';
      await fetchJson(url, {
        method,
        body: JSON.stringify(payload),
      });
      setStatus(editingId ? 'Article updated successfully.' : 'Article created successfully.');
      setForm(emptyForm);
      setEditingId(null);
      refreshArticles();
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleEdit = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      category: article.category,
      summary: article.summary,
      content: Array.isArray(article.content) ? article.content.join('\n\n') : article.summary,
      author: article.author,
      readTime: article.readTime || '5 min read',
      image: article.image,
      featured: Boolean(article.featured),
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/articles/${id}`, { method: 'DELETE' });
      setStatus('Article deleted.');
      refreshArticles();
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <main className="admin-page fade-up">
      <div className="admin-shell">
        <section className="panel-box form-panel">
          <SectionHeader eyebrow="Admin" title={editingId ? 'Edit article' : 'Create article'} />
          <form className="admin-form" onSubmit={handleSubmit}>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Article title" required />
            <select name="category" value={form.category} onChange={handleChange}>
              {navItems.map((item) => (
                <option key={item} value={item === 'Home' ? 'Home' : item}>{item}</option>
              ))}
            </select>
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author name" required />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required />
            <input name="readTime" value={form.readTime} onChange={handleChange} placeholder="Read time" />
            <textarea name="summary" value={form.summary} onChange={handleChange} placeholder="Summary" rows="3" required />
            <textarea name="content" value={form.content} onChange={handleChange} placeholder="Article body (one paragraph per line)" rows="8" required />
            <label className="checkbox-row">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Feature on homepage
            </label>
            <div className="form-actions">
              <button type="submit" className="primary-btn">{editingId ? 'Update article' : 'Create article'}</button>
              {editingId && (
                <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          {status && <p className="status-message">{status}</p>}
        </section>

        <section className="panel-box list-panel">
          <SectionHeader eyebrow="Database" title="Article list" />
          <div className="article-admin-list">
            {articles.map((article) => (
              <div key={article.id} className="admin-row">
                <div>
                  <strong>{article.title}</strong>
                  <span>{article.category}</span>
                </div>
                <div className="admin-actions">
                  <button type="button" className="secondary-btn" onClick={() => handleEdit(article)}>Edit</button>
                  <button type="button" className="ghost-btn danger" onClick={() => handleDelete(article.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshArticles = async () => {
    try {
      setLoading(true);
      const payload = await fetchJson(`${API_BASE}/articles`);
      setArticles(payload);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  const pageContent = useMemo(() => {
    if (loading) return <div className="loading-state">Loading stories…</div>;
    if (error) return <div className="empty-state">Unable to load stories: {error}</div>;
    return null;
  }, [loading, error]);

  return (
    <BrowserRouter>
      <div className="news-app-shell">
        <Header />
        {pageContent || (
          <Routes>
            <Route path="/" element={<HomePage articles={articles} />} />
            <Route path="/world" element={<CategoryPage articles={articles} category="World" />} />
            <Route path="/business" element={<CategoryPage articles={articles} category="Business" />} />
            <Route path="/politics" element={<CategoryPage articles={articles} category="Politics" />} />
            <Route path="/tech" element={<CategoryPage articles={articles} category="Tech" />} />
            <Route path="/culture" element={<CategoryPage articles={articles} category="Culture" />} />
            <Route path="/climate" element={<CategoryPage articles={articles} category="Climate" />} />
            <Route path="/analysis" element={<CategoryPage articles={articles} category="Analysis" />} />
            <Route path="/article/:id" element={<ArticlePage articles={articles} />} />
            <Route path="/admin" element={<AdminPage articles={articles} refreshArticles={refreshArticles} />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
