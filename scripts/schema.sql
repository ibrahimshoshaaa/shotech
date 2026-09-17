-- ============================================================
-- ShoTech Solutions — Database Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, title_en TEXT DEFAULT '', slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, excerpt_en TEXT DEFAULT '', content TEXT, content_en TEXT DEFAULT '',
  cover_image TEXT, images TEXT DEFAULT '[]', technologies TEXT DEFAULT '[]',
  category TEXT, category_en TEXT DEFAULT '', demo_url TEXT, github_url TEXT,
  status TEXT DEFAULT 'draft', featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, title_en TEXT DEFAULT '', description TEXT, description_en TEXT DEFAULT '',
  content TEXT DEFAULT '', content_en TEXT DEFAULT '', slug TEXT, cover_image TEXT DEFAULT '',
  icon TEXT DEFAULT 'Code2', sort_order INTEGER DEFAULT 0, visible INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
  phone TEXT, message TEXT NOT NULL, status TEXT DEFAULT 'unread', created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS site_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT, page TEXT NOT NULL DEFAULT 'home', type TEXT NOT NULL DEFAULT 'custom',
  title TEXT DEFAULT '', title_en TEXT DEFAULT '', subtitle TEXT DEFAULT '', subtitle_en TEXT DEFAULT '',
  body TEXT DEFAULT '', body_en TEXT DEFAULT '', icon TEXT DEFAULT '', image TEXT DEFAULT '',
  button_text TEXT DEFAULT '', button_text_en TEXT DEFAULT '', button_url TEXT DEFAULT '', data TEXT DEFAULT '{}',
  sort_order INTEGER DEFAULT 0, visible INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO settings (key, value) VALUES
('companyName','ShoTech Solutions'),('companyName_en','ShoTech Solutions'),
('tagline','حلول ذكية. أنظمة قوية.'),('tagline_en','Smart solutions. Powerful systems.'),
('email',''),('whatsapp',''),('facebook',''),('instagram',''),('linkedin',''),('github',''),
('seoTitle','ShoTech Solutions'),('seoTitle_en','ShoTech Solutions | Digital solutions that make a difference'),
('seoDescription','حلول رقمية ذكية وأنظمة قوية تساعد عملك على النمو.'),
('seoDescription_en','Smart digital solutions and powerful systems that help businesses grow.'),
('aboutTitle','حلول ذكية. أنظمة قوية.'),('aboutTitle_en','Smart solutions. Powerful systems.'),
('aboutBody','نبني منتجات رقمية عملية وأنظمة مخصصة تساعد الشركات على العمل بشكل أفضل، والتحرك بشكل أسرع، والنمو بثقة.'),
('aboutBody_en','We build practical digital products and custom systems that help businesses operate better, move faster and grow with confidence.'),
('processTitle','طريقة شغل واضحة. ونتيجة أقوى.'),('processTitle_en','A clear process. A stronger result.'),
('processBody','نفهم، نصمم، نبني ونطلق حلولًا رقمية حول احتياجات كل مشروع.'),
('processBody_en','We discover, design, build and launch digital solutions around the real needs of each business.');

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug_unique ON services(slug) WHERE slug IS NOT NULL AND slug <> '';
