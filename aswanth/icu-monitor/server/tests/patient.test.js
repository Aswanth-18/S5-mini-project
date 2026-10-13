const { buildTrendSummary } = require('../services/summaryService');

describe('patient summary generation', () => {
  it('summarizes a worsening trend', () => {
    const summary = buildTrendSummary([
      { heartRate: 78, spo2: 98, timestamp: Date.now() - 30 * 60000 },
      { heartRate: 104, spo2: 90, timestamp: Date.now() }
    ]);

    expect(summary).toContain('Heart rate');
    expect(summary.length).toBeGreaterThan(0);
  });
});