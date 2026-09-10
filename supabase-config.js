// Supabase 프로젝트 공개 설정
// anon key는 브라우저에 노출되어도 안전하도록 설계된 공개 키이며,
// 실제 접근 제어는 Supabase Row Level Security 정책으로 처리됩니다.
const SUPABASE_URL = "https://sjiwicimxpwdtmxzskum.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaXdpY2lteHB3ZHRteHpza3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTAxMTcsImV4cCI6MjEwNDU4NjExN30.2RQXLM26qYmenEtt3CpKvOlPNLxFLRkcBr3Wv1CpV7Y";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
