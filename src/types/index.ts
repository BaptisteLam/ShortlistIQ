export interface Profile {
  id: string;
  email: string;
  plan: "starter" | "pro";
  screens_used: number;
  screens_limit: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Screening {
  id: string;
  user_id: string;
  job_title: string;
  job_description: string;
  extracted_criteria: ExtractedCriteria;
  status: "draft" | "processing" | "completed" | "failed";
  total_resumes: number;
  created_at: string;
  completed_at: string | null;
}

export interface ExtractedCriteria {
  job_title: string;
  must_have: string[];
  nice_to_have: string[];
  experience_years: number | null;
  education: string | null;
  deal_breakers: string[];
}

export interface CandidateAnalysis {
  summary: string;
  skills_matched: string[];
  skills_missing: string[];
  experience_match: string;
  interview_questions: string[];
  strengths: string[];
  concerns: string[];
}

export interface Candidate {
  id: string;
  screening_id: string;
  file_name: string;
  candidate_name: string | null;
  score: number | null;
  match_level: "strong" | "moderate" | "weak" | null;
  analysis: CandidateAnalysis;
  resume_text: string | null;
  created_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  screening_id: string;
  resumes_screened: number;
  api_cost_cents: number;
  created_at: string;
}
