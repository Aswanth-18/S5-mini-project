const { GoogleGenerativeAI } = require('@google/generative-ai');
const Vital = require('../models/Vital');
const Patient = require('../models/Patient');
const ApiError = require('../utils/ApiError');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildPrompt = (patient, vitals) => `
You are a clinical decision-support assistant in an ICU. Do NOT diagnose or prescribe. Analyze trends and produce risk indicators.

Patient: ${patient.name}, ${patient.age || '?'}y, ${patient.gender || '?'}
Diagnosis: ${patient.diagnosis || 'N/A'}
History: ${patient.medicalHistory || 'N/A'}

Recent vitals (oldest to newest):
${vitals.map(v => `${v.timestamp.toISOString()} | HR:${v.heartRate} BP:${v.systolic}/${v.diastolic} SpO2:${v.spo2} Temp:${v.temperature} RR:${v.respiratoryRate}`).join('\n')}

Respond ONLY with valid JSON, no markdown:
{
  "riskScore": <0-10>,
  "riskLevel": "low"|"medium"|"high",
  "clinicalSummary": "<2-3 sentence plain-language trend summary>",
  "reasoning": ["reason 1", "reason 2"],
  "alerts": [{"priority":"critical"|"high"|"medium", "message":"..."}]
}`;

exports.analyzePatient = async (patientId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) throw new ApiError(404, 'Patient not found');

  const vitals = await Vital.find({ patient: patientId }).sort({ timestamp: -1 }).limit(20);
  if (!vitals.length) throw new ApiError(400, 'No vitals recorded for this patient');

  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' });
    const result = await model.generateContent(buildPrompt(patient, [...vitals].reverse()));
    let text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    patient.riskScore = parsed.riskScore ?? 0;
    patient.riskLevel = parsed.riskLevel || 'low';
    patient.aiSummary = parsed.clinicalSummary;
    patient.aiReasoning = parsed.reasoning || [];
    patient.aiUpdatedAt = new Date();
    await patient.save();

    return parsed;
  } catch (e) {
    console.error('Gemini error:', e.message);
    throw new ApiError(502, 'AI analysis failed: ' + e.message);
  }
};