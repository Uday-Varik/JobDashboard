import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getFollowUpSuggestion(params: {
  companyName: string;
  role: string;
  stage: string;
  appliedDate?: string;
  lastActivityDate?: string;
  contactName?: string;
}): Promise<string> {
  const daysSince = params.lastActivityDate
    ? Math.floor((Date.now() - new Date(params.lastActivityDate).getTime()) / 86400000)
    : params.appliedDate
    ? Math.floor((Date.now() - new Date(params.appliedDate).getTime()) / 86400000)
    : null;

  const prompt = `You are a job search coach. Give concise, actionable follow-up advice in under 3 sentences.

Application: ${params.role} at ${params.companyName}
Stage: ${params.stage}
${daysSince !== null ? `Days since last activity: ${daysSince}` : ""}
${params.contactName ? `Contact: ${params.contactName}` : ""}

Should I follow up? If yes, what should I say and when?`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function getApplicationInsights(params: {
  totalApplications: number;
  responseRate: number;
  stageBreakdown: { stage: string; count: number }[];
  topIndustries: string[];
  avgDaysToResponse?: number;
}): Promise<string> {
  const prompt = `You are a career coach. Give 3 specific, actionable insights as bullet points based on this job search data. Be honest and practical.

Stats:
- Total applications: ${params.totalApplications}
- Response rate: ${params.responseRate.toFixed(1)}%
- Stage breakdown: ${JSON.stringify(params.stageBreakdown)}
- Industries: ${params.topIndustries.join(", ") || "varied"}
${params.avgDaysToResponse ? `- Avg days to response: ${params.avgDaysToResponse}` : ""}

What patterns do you see and what should I do differently?`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
