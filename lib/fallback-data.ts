/**
 * Fallback content shown when the database has no services or projects yet.
 * Used only on the public home page.
 */

export const fallbackServices = [
  { id: 'f1', title: 'تطوير المواقع',        title_en: 'Web development',          description: 'مواقع سريعة، احترافية، ومتجاوبة مصممة حول هدف مشروعك.',                         description_en: 'Fast, professional websites designed around your business goal.',                           icon: 'Globe2',          slug: 'web-development'   },
  { id: 'f2', title: 'الأنظمة الإدارية',      title_en: 'Business systems',          description: 'أنظمة مخصصة لإدارة المبيعات، العملاء، المخزون والعمليات اليومية.',             description_en: 'Custom systems for sales, customers, inventory and daily operations.',                    icon: 'LayoutDashboard', slug: 'business-systems'  },
  { id: 'f3', title: 'تطبيقات الموبايل',      title_en: 'Mobile apps',               description: 'تطبيقات Android وiOS بتجربة استخدام واضحة وأداء عملي.',                        description_en: 'Android and iOS apps with clear UX and practical performance.',                           icon: 'Smartphone',      slug: 'mobile-apps'       },
  { id: 'f4', title: 'قواعد البيانات والربط', title_en: 'Databases & integrations',  description: 'بنية بيانات منظمة وربط آمن بين أجزاء النظام المختلفة.',                         description_en: 'Organized data architecture and secure integrations.',                                    icon: 'Database',        slug: 'databases'         },
  { id: 'f5', title: 'حلول مخصصة',            title_en: 'Custom solutions',           description: 'نحوّل الفكرة أو المشكلة المتكررة إلى أداة رقمية مناسبة.',                      description_en: 'We turn ideas and repetitive problems into useful digital tools.',                         icon: 'Sparkles',        slug: 'custom-solutions'  },
  { id: 'f6', title: 'تطوير وتحسين',           title_en: 'Development & improvement', description: 'تطوير الأنظمة الموجودة وتحسين السرعة وتجربة المستخدم.',                         description_en: 'Improve existing systems, speed and user experience.',                                    icon: 'Code2',           slug: 'development'       },
];

export const fallbackProjects = [
  { id: 'f1', title: 'أنظمة أعمال مخصصة',     title_en: 'Custom business systems',    category: 'BUSINESS SYSTEM', excerpt: 'حلول رقمية صُممت لتبسيط التشغيل والمتابعة اليومية.',                    excerpt_en: 'Digital solutions designed to simplify daily operations and follow-up.', slug: 'business-systems' },
  { id: 'f2', title: 'متاجر ومنصات رقمية',     title_en: 'Digital stores & platforms', category: 'WEB PLATFORM',    excerpt: 'تجارب ويب حديثة تساعد المشروع على الظهور والبيع بشكل أفضل.',          excerpt_en: 'Modern web experiences that help businesses present and sell better.',    slug: 'web-platforms'    },
  { id: 'f3', title: 'تطبيقات موبايل',          title_en: 'Mobile applications',        category: 'MOBILE APP',      excerpt: 'تطبيقات عملية تربط العميل بالخدمة في خطوات واضحة.',                    excerpt_en: 'Practical apps that connect customers with services in clear steps.',    slug: 'mobile-apps'      },
];
