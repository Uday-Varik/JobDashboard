const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://yyijsutbzqoidxywjrqu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5aWpzdXRienFvaWR4eXdqcnF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE4ODI0NiwiZXhwIjoyMDk1NzY0MjQ2fQ.6xhXELwNyTF3rRvgSZHOyR68ZJYuTaq-0qP9R2bmFlk"
);

async function seed() {
  console.log("Seeding database...\n");

  // ── Companies ──────────────────────────────────────────────────────────────
  const { data: companies, error: cErr } = await supabase
    .from("companies")
    .insert([
      { name: "Google",    website: "https://google.com",    industry: "Technology",   location: "Mountain View, CA" },
      { name: "Meta",      website: "https://meta.com",      industry: "Technology",   location: "Menlo Park, CA" },
      { name: "Apple",     website: "https://apple.com",     industry: "Technology",   location: "Cupertino, CA" },
      { name: "Stripe",    website: "https://stripe.com",    industry: "Fintech",      location: "San Francisco, CA" },
      { name: "OpenAI",    website: "https://openai.com",    industry: "AI/ML",        location: "San Francisco, CA" },
      { name: "Shopify",   website: "https://shopify.com",   industry: "E-Commerce",   location: "Ottawa, Canada" },
      { name: "Netflix",   website: "https://netflix.com",   industry: "Entertainment",location: "Los Gatos, CA" },
      { name: "Airbnb",    website: "https://airbnb.com",    industry: "Travel",       location: "San Francisco, CA" },
    ])
    .select("id, name");

  if (cErr) { console.error("Companies error:", cErr.message); return; }
  console.log(`✓ ${companies.length} companies`);

  const co = Object.fromEntries(companies.map((c) => [c.name, c.id]));

  // ── Applications (covers all stages + priorities + edge cases) ─────────────
  const today = new Date();
  const daysAgo = (n) => new Date(today - n * 86400000).toISOString().split("T")[0];

  const { data: apps, error: aErr } = await supabase
    .from("applications")
    .insert([
      // WISHLIST
      { company_id: co["Netflix"],  role_title: "Senior Data Engineer",         stage: "wishlist",     priority: "high",   salary_min: 180000, salary_max: 220000, job_url: "https://jobs.netflix.com/123", description: "Interesting ML infra role. Need to update resume first." },
      { company_id: co["Airbnb"],   role_title: "ML Platform Engineer",         stage: "wishlist",     priority: "medium", salary_min: 160000, salary_max: 200000 },

      // APPLIED
      { company_id: co["Google"],   role_title: "Senior Software Engineer",     stage: "applied",      priority: "high",   applied_date: daysAgo(14), salary_min: 200000, salary_max: 280000, job_url: "https://careers.google.com/456", description: "L5 SWE role in Search infra team. Applied via referral from ex-colleague." },
      { company_id: co["Shopify"],  role_title: "Staff Engineer - Payments",    stage: "applied",      priority: "medium", applied_date: daysAgo(7),  salary_min: 170000, salary_max: 210000 },
      { company_id: co["Airbnb"],   role_title: "Data Scientist - Trust",       stage: "applied",      priority: "low",    applied_date: daysAgo(3) },

      // PHONE SCREEN
      { company_id: co["Meta"],     role_title: "Research Engineer - GenAI",    stage: "phone_screen", priority: "high",   applied_date: daysAgo(21), salary_min: 220000, salary_max: 320000, description: "FAIR team. Had initial call with recruiter — went well. Technical screen next week." },
      { company_id: co["Stripe"],   role_title: "Backend Engineer - Billing",   stage: "phone_screen", priority: "high",   applied_date: daysAgo(10), salary_min: 190000, salary_max: 240000 },

      // TECHNICAL
      { company_id: co["OpenAI"],   role_title: "Applied AI Engineer",          stage: "technical",    priority: "high",   applied_date: daysAgo(30), salary_min: 250000, salary_max: 400000, description: "Take-home assignment submitted. Waiting on feedback." },
      { company_id: co["Google"],   role_title: "Staff ML Engineer",            stage: "technical",    priority: "high",   applied_date: daysAgo(18), salary_min: 280000, salary_max: 380000 },

      // FINAL ROUND
      { company_id: co["Apple"],    role_title: "Senior ML Engineer - Siri",    stage: "final_round",  priority: "high",   applied_date: daysAgo(45), salary_min: 230000, salary_max: 310000, description: "On-site loop done. 5 rounds, all positive signals. Waiting on HC decision." },

      // OFFER
      { company_id: co["Stripe"],   role_title: "Senior Software Engineer",     stage: "offer",        priority: "high",   applied_date: daysAgo(60), salary_min: 210000, salary_max: 260000, description: "Offer received: $235k base + $150k equity. Deadline in 2 weeks. Comparing with Apple." },

      // REJECTED
      { company_id: co["Meta"],     role_title: "Software Engineer - Ads",      stage: "rejected",     priority: "medium", applied_date: daysAgo(40), description: "Rejected after technical screen. Interviewer said strong fundamentals but weak on system design." },
      { company_id: co["Netflix"],  role_title: "Senior Backend Engineer",      stage: "rejected",     priority: "low",    applied_date: daysAgo(25) },

      // WITHDRAWN
      { company_id: co["Shopify"],  role_title: "Principal Engineer",           stage: "withdrawn",    priority: "low",    applied_date: daysAgo(50), description: "Withdrew — compensation range too low and fully on-site." },

      // Edge cases
      { company_id: co["Airbnb"],   role_title: "A" .repeat(80),               stage: "applied",      priority: "low",    applied_date: daysAgo(1) }, // very long role title
      { company_id: co["OpenAI"],   role_title: "Research Scientist",           stage: "applied",      priority: "high" },                              // no applied_date
    ])
    .select("id, role_title, stage");

  if (aErr) { console.error("Applications error:", aErr.message); return; }
  console.log(`✓ ${apps.length} applications`);

  const byRole = Object.fromEntries(apps.map((a) => [a.role_title, a.id]));

  // ── Contacts ───────────────────────────────────────────────────────────────
  const { error: ctErr } = await supabase.from("contacts").insert([
    // Linked to applications
    { application_id: byRole["Senior Software Engineer"],  name: "Sarah Chen",    role: "Technical Recruiter", email: "sarah.chen@google.com",   phone: "+1 (650) 555-0101", linkedin: "https://linkedin.com/in/sarahchen" },
    { application_id: byRole["Senior Software Engineer"],  name: "James Park",    role: "Hiring Manager",      email: "jpark@google.com",        phone: "+1 (650) 555-0102" },
    { application_id: byRole["Research Engineer - GenAI"], name: "Priya Sharma",  role: "Recruiter",           email: "priya@meta.com",           phone: "+1 (415) 555-0201", linkedin: "https://linkedin.com/in/priyasharma" },
    { application_id: byRole["Applied AI Engineer"],       name: "Tom Bradley",   role: "Technical Recruiter", email: "tbradley@openai.com",      linkedin: "https://linkedin.com/in/tombradley" },
    { application_id: byRole["Senior ML Engineer - Siri"], name: "Emily Watson",  role: "Recruiter",           email: "ewatson@apple.com",        phone: "+1 (408) 555-0301" },
    { application_id: byRole["Senior ML Engineer - Siri"], name: "Kevin Liu",     role: "Hiring Manager",      email: "kliu@apple.com",           phone: "+1 (408) 555-0302", linkedin: "https://linkedin.com/in/kevinliu" },
    { application_id: byRole["Senior Software Engineer"].replace("Google","Stripe"), name: "Rachel Green", role: "Recruiter", email: "rgreen@stripe.com", phone: "+1 (415) 555-0401" },

    // Standalone contacts (no application)
    { name: "David Kim",    role: "Engineering Manager at LinkedIn", email: "dkim@linkedin.com",  phone: "+1 (415) 555-9001", linkedin: "https://linkedin.com/in/davidkim",  notes: "Met at SF Tech Meetup. Said they're hiring in Q3." },
    { name: "Monica Patel", role: "Recruiter at Databricks",        email: "mpatel@databricks.com", phone: "+1 (628) 555-9002", notes: "Reached out on LinkedIn. Follow up in June." },
  ]);

  if (ctErr) { console.error("Contacts error:", ctErr.message); return; }
  console.log("✓ Contacts seeded");

  // ── Notes ──────────────────────────────────────────────────────────────────
  const notesData = [
    { id: byRole["Senior Software Engineer"],  content: "Recruiter Sarah confirmed L5 level. Interview loop will be 5 rounds: coding x2, system design x1, behavioral x1, team fit x1." },
    { id: byRole["Senior Software Engineer"],  content: "Completed first coding round — BFS/DFS problem, went smoothly. Interviewer was friendly." },
    { id: byRole["Research Engineer - GenAI"], content: "Phone screen done. 45 mins with Priya. Discussed background and motivation. Moving to technical screen." },
    { id: byRole["Applied AI Engineer"],       content: "Take-home: build a mini RAG pipeline. Spent ~8 hours. Submitted on time." },
    { id: byRole["Applied AI Engineer"],       content: "Follow-up email sent after 1 week of silence. No response yet." },
    { id: byRole["Senior ML Engineer - Siri"], content: "On-site completed. 5 interviewers. Panel seemed positive. HC review in progress." },
    { id: byRole["Senior Software Engineer (Stripe)"], content: "Offer details: $235k base, $150k RSU over 4 years, $30k signing. Deadline May 25." },
  ];

  // only insert notes for apps that exist
  const validNotes = notesData
    .filter((n) => n.id)
    .map(({ id, content }) => ({ application_id: id, content }));

  const appIds = apps.map((a) => a.id);
  const filteredNotes = [];
  for (const app of apps) {
    if (app.role_title === "Senior Software Engineer" && app.stage === "applied") {
      filteredNotes.push({ application_id: app.id, content: "Recruiter Sarah confirmed L5 level. Interview loop: coding x2, system design, behavioral, team fit." });
      filteredNotes.push({ application_id: app.id, content: "Completed first coding round — BFS/DFS problem. Went smoothly." });
    }
    if (app.role_title === "Research Engineer - GenAI") {
      filteredNotes.push({ application_id: app.id, content: "Phone screen done. 45 mins with Priya. Moving to technical screen." });
    }
    if (app.role_title === "Applied AI Engineer") {
      filteredNotes.push({ application_id: app.id, content: "Take-home: build a mini RAG pipeline. Spent ~8 hours. Submitted on time." });
      filteredNotes.push({ application_id: app.id, content: "Follow-up email sent after 1 week of silence. No response yet." });
    }
    if (app.role_title === "Senior ML Engineer - Siri") {
      filteredNotes.push({ application_id: app.id, content: "On-site completed. 5 interviewers. HC review in progress." });
    }
    if (app.role_title === "Senior Software Engineer" && app.stage === "offer") {
      filteredNotes.push({ application_id: app.id, content: "Offer: $235k base, $150k RSU over 4 years, $30k signing. Deadline in 2 weeks." });
    }
  }

  const { error: nErr } = await supabase.from("notes").insert(filteredNotes);
  if (nErr) { console.error("Notes error:", nErr.message); return; }
  console.log(`✓ ${filteredNotes.length} notes`);

  // ── Follow-ups ─────────────────────────────────────────────────────────────
  const fuData = [];
  for (const app of apps) {
    if (app.role_title === "Senior Software Engineer" && app.stage === "applied") {
      fuData.push({ application_id: app.id, due_date: daysAgo(-1),  message: "Send thank-you email to Sarah", completed: false });        // tomorrow
      fuData.push({ application_id: app.id, due_date: daysAgo(3),   message: "Check on interview feedback",   completed: true });          // completed
    }
    if (app.role_title === "Research Engineer - GenAI") {
      fuData.push({ application_id: app.id, due_date: daysAgo(0),   message: "Follow up on technical screen date", completed: false });    // today
    }
    if (app.role_title === "Applied AI Engineer") {
      fuData.push({ application_id: app.id, due_date: daysAgo(5),   message: "Chase take-home feedback",     completed: false });          // overdue
      fuData.push({ application_id: app.id, due_date: daysAgo(10),  message: "Send initial follow-up email", completed: true });           // completed
    }
    if (app.role_title === "Senior ML Engineer - Siri") {
      fuData.push({ application_id: app.id, due_date: daysAgo(-3),  message: "Follow up on HC decision",    completed: false });           // 3 days from now
    }
    if (app.role_title === "Senior Software Engineer" && app.stage === "offer") {
      fuData.push({ application_id: app.id, due_date: daysAgo(-7),  message: "Deadline — accept or decline Stripe offer", completed: false }); // future
      fuData.push({ application_id: app.id, due_date: daysAgo(2),   message: "Asked for deadline extension", completed: true });
    }
    if (app.role_title === "Staff Engineer - Payments") {
      fuData.push({ application_id: app.id, due_date: daysAgo(7),   message: "Follow up on application status", completed: false });       // overdue
    }
  }

  const { error: fErr } = await supabase.from("follow_ups").insert(fuData);
  if (fErr) { console.error("Follow-ups error:", fErr.message); return; }
  console.log(`✓ ${fuData.length} follow-ups`);

  console.log("\n✅ Seed complete!");
  console.log("\nSummary:");
  console.log("  Companies : 8");
  console.log(`  Apps      : ${apps.length} (all 8 stages covered)`);
  console.log(`  Notes     : ${filteredNotes.length}`);
  console.log(`  Follow-ups: ${fuData.length} (overdue, today, upcoming, completed)`);
  console.log("  Contacts  : 9 (linked + standalone)");
}

seed().catch(console.error);
