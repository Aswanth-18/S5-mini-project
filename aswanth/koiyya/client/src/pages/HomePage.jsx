import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { uiText } from '../i18n';
import { formatDate } from '../services/api';

const marketData = [
  { name: 'S&P 500', value: '5,436.19', delta: '+1.42%' },
  { name: 'NASDAQ', value: '17,802.64', delta: '+1.89%' },
  { name: 'NIFTY 50', value: '23,842.31', delta: '+0.87%' },
  { name: 'Dow Jones', value: '39,817.05', delta: '+0.93%' },
  { name: 'FTSE 100', value: '8,216.44', delta: '+0.72%' },
  { name: 'Crude Oil', value: '$77.18', delta: '-0.34%' },
  { name: 'Gold', value: '$2,349.80', delta: '+1.12%' },
  { name: 'Bitcoin', value: '$62,184', delta: '+3.61%' },
];

const categoryCoverage = ['World', 'Business', 'Politics', 'Tech', 'Culture', 'Climate', 'Analysis'];

export default function HomePage({ articles, language = 'en' }) {
  const t = uiText[language] || uiText.en;
  const lead = articles.find((item) => item.featured) || articles[0];
  const stories = articles.slice(0, 6);
  const featured = articles.slice(0, 4);
  const trendingTopics = [
    t.aiInfrastructure,
    t.globalEconomy,
    t.climateAction,
    t.startupFunding,
    t.sportsAnalytics,
    t.culturalShifts,
  ];

  if (!lead) {
    return <div className="empty-state">{t.noArticles}</div>;
  }

  const climateData = [
    { key: 'heatIndex', value: '34°C' },
    { key: 'coastalRisk', value: 'Moderate' },
    { key: 'cleanPower', value: '38%' },
    { key: 'stormWatch', value: 'Low' },
  ];

  return (
    <main className="home-page">
      <div className="ticker-bar">
        <span className="ticker-label">{t.live}</span>
        <div className="ticker-track">
          <span>AI infrastructure spending expands across emerging markets</span>
          <span>Public resilience investment accelerates across coastal cities</span>
          <span>Editorial teams focus on trust, context, and local accountability</span>
        </div>
      </div>

      <section className="hero-layout">
        <motion.article
          className="featured-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="featured-copy">
            <span className="eyebrow">{t.morningBrief}</span>
            <h1>{lead.title}</h1>
            <p>{lead.summary}</p>
            <div className="meta-line">
              <span>{lead.author}</span>
              <span>{formatDate(lead.publishedAt)}</span>
              <span>{lead.readTime || '5 min read'}</span>
            </div>
            <div className="hero-actions">
              <Link to={lead.slug ? `/article/${lead.slug}` : `/article/${lead.id}`} className="primary-button">{t.readLead}</Link>
              <Link to="/search" className="secondary-button">{t.browseLatest}</Link>
            </div>
          </div>

          <div className="featured-visual">
            <img src={lead.image} alt={lead.title} />
          </div>
        </motion.article>

        <aside className="sidebar-panel">
          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.marketPulse}</span>
              <h3>{t.markets}</h3>
            </div>
            <div className="market-list">
              {marketData.map((entry) => (
                <div className="market-row" key={entry.name}>
                  <span>{entry.name}</span>
                  <div>
                    <strong>{entry.value}</strong>
                    <em>{entry.delta}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.climateBrief}</span>
              <h3>{t.resilienceWatch}</h3>
            </div>
            <div className="market-list">
              {climateData.map((entry) => (
                <div className="market-row" key={entry.key}>
                  <span>{t[entry.key]}</span>
                  <div>
                    <strong>{entry.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.trending}</span>
              <h3>{t.topics}</h3>
            </div>
            <div className="chip-row">
              {trendingTopics.map((topic) => (
                <span key={topic} className="chip-item">{topic}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="stats-grid">
        {[
          { value: '2.4M', label: 'daily readers' },
          { value: '76', label: 'news desks' },
          { value: '18K', label: 'stories indexed' },
          { value: '4.8/5', label: 'reader rating' },
        ].map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="editorial-rail">
        <div className="section-heading">
          <span className="eyebrow">{t.coverageMap}</span>
          <h2>{t.todaysNewsroom}</h2>
        </div>

        <div className="section-grid highlight-grid">
          {categoryCoverage.map((category) => {
            const count = articles.filter((item) => item.category === category).length;
            return (
              <Link key={category} to={`/category/${category.toLowerCase()}`} className="coverage-card">
                <span>{category}</span>
                <strong>{category}</strong>
                <small>{count} reports</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="content-grid">
        <div className="main-stack">
          <div className="section-heading">
            <span className="eyebrow">{t.latest}</span>
            <h2>{t.topStories}</h2>
          </div>

          <div className="story-grid">
            {stories.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>

        <aside className="side-stack">
          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.whatMattersNow}</span>
              <h3>{t.briefing}</h3>
            </div>
            <div className="brief-list">
              {featured.map((item) => (
                <div key={item.id} className="brief-item">
                  <span className="brief-tag">{item.category}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <small>{formatDate(item.publishedAt)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-box">
            <div className="panel-header">
              <span className="eyebrow">{t.editorsPick}</span>
              <h3>{t.deepReads}</h3>
            </div>
            <div className="compact-list">
              {articles.slice(0, 3).map((item) => (
                <div key={item.id} className="compact-item">
                  <h4>{item.title}</h4>
                  <span>{item.category} • {item.readTime || '5 min read'}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
