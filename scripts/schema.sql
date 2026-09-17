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

INSERT OR IGNORE INTO site_sections
(page,type,title,title_en,subtitle,subtitle_en,body,body_en,sort_order,visible) VALUES
('home','hero','نحوّل أفكارك إلى أنظمة رقمية قوية.','We turn ideas into powerful digital systems.','ShoTech Solutions • حلول رقمية','ShoTech Solutions • Digital solutions','نصمم ونبني مواقع حديثة، وأنظمة أعمال مخصصة، وتجارب رقمية تساعد المشاريع الطموحة على العمل بشكل أسرع وأوضح.','We design and build modern websites, custom business systems and digital experiences that help ambitious businesses move faster and work more clearly.',10,1),
('home','services','تقنية مصممة حول شغلك.','Technology designed around your business.','خدماتنا','Our services','من أول الفكرة إلى نظام جاهز للعمل، نبني حلولًا واضحة لها هدف حقيقي.','From the first idea to a production-ready system, we build focused solutions with a clear purpose.',20,1),
('home','about','عن ShoTech','About ShoTech','من نحن','About us','نبني منتجات رقمية عملية وأنظمة مخصصة حول الاحتياجات الحقيقية للمشاريع الطموحة.','We build practical digital products and custom systems around the real needs of ambitious businesses.',30,1),
('home','why','ليه ShoTech؟','Why ShoTech?','لماذا تختارنا','Why choose us','حلول مخصصة، تواصل واضح، بنية قابلة للتطوير، وطريقة شغل تركز على نتيجة حقيقية.','Custom solutions, clear communication, scalable architecture and a process focused on real results.',40,1),
('home','process','طريقة شغلنا','How we work','خطوات التنفيذ','Our process','نفهم، نصمم، نبني ونطلق — طريقة بسيطة بنتيجة أقوى.','Discover, design, build and launch — a simple process with a stronger result.',50,1),
('home','projects','أنظمة معمولة عشان تشتغل.','Systems built to perform.','أعمالنا','Our work','استكشف مجموعة من المشاريع التي بنيناها لحل مشاكل حقيقية في الأعمال.','Explore selected projects built to solve real business problems.',60,1),
('home','cta','خلينا نبني حاجة مفيدة','Let''s build something useful','ابدأ مشروعك','Start your project','احكيلنا أنت عايز تبني إيه، وإحنا نحدد معاك الحل الرقمي المناسب.','Tell us what you want to build and we will shape the right digital solution.',70,1),
('about','about','حلول ذكية. أنظمة قوية.','Smart solutions. Powerful systems.','','','نبني منتجات رقمية عملية وأنظمة مخصصة تساعد الشركات على العمل بشكل أفضل، والتحرك بشكل أسرع، والنمو بثقة.','We build practical digital products and custom systems that help businesses operate better, move faster and grow with confidence.',10,1),
('process','process','طريقة شغل واضحة. ونتيجة أقوى.','A clear process. A stronger result.','','','نفهم، نصمم، نبني ونطلق — وكل خطوة بتتدار حول أهداف مشروعك.','We discover, design, build and launch — with every step managed around your business goals.',10,1);
