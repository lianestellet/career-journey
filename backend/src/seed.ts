import { companyDb } from './db/companies.js';
import { projectDb } from './db/projects.js';
import { presentationDb } from './db/presentations.js';

async function seed() {
  console.log('🌱 Seeding database with sample data...');

  // Create sample companies
  const acmeCorp = await companyDb.create({
    name: 'Acme Corporation',
    description: 'A leading technology company specializing in cloud solutions and enterprise software. Worked on mission-critical systems serving millions of users.',
    startDate: '2021-06',
    endDate: '2024-01',
    location: 'San Francisco, CA',
    role: 'Senior Full Stack Developer',
  });

  const techStartup = await companyDb.create({
    name: 'TechStartup Inc',
    description: 'Fast-growing startup revolutionizing the fintech space with innovative mobile-first solutions.',
    startDate: '2019-03',
    endDate: '2021-05',
    location: 'New York, NY',
    role: 'Full Stack Developer',
  });

  const consultingFirm = await companyDb.create({
    name: 'Digital Consulting Partners',
    description: 'Boutique consulting firm providing technical expertise to Fortune 500 clients across various industries.',
    startDate: '2024-02',
    location: 'Remote',
    role: 'Lead Software Engineer',
  });

  console.log('✅ Created 3 companies');

  // Create sample projects for Acme Corp
  const cloudMigration = await projectDb.create({
    companyId: acmeCorp.id,
    name: 'Cloud Migration Platform',
    description: 'Led the migration of legacy on-premise systems to AWS, reducing infrastructure costs by 40%. Architected microservices-based solution handling 10M+ requests/day.',
    industry: 'Enterprise Cloud',
    technologies: ['AWS', 'Kubernetes', 'Docker', 'Node.js', 'PostgreSQL', 'Redis', 'TypeScript'],
    keywords: ['microservices', 'scalability', 'cost optimization', 'DevOps'],
    architectureDiagrams: [],
    startDate: '2022-03',
    endDate: '2023-08',
  });

  const analyticsEngine = await projectDb.create({
    companyId: acmeCorp.id,
    name: 'Real-time Analytics Engine',
    description: 'Built real-time analytics platform processing 50TB of data daily. Implemented custom data pipeline with sub-second latency for business intelligence dashboards.',
    industry: 'Data Analytics',
    technologies: ['Apache Kafka', 'Spark', 'Python', 'React', 'D3.js', 'MongoDB'],
    keywords: ['big data', 'real-time processing', 'data visualization', 'performance'],
    architectureDiagrams: [],
    startDate: '2021-08',
    endDate: '2022-02',
  });

  // Create sample projects for TechStartup
  const mobilePayment = await projectDb.create({
    companyId: techStartup.id,
    name: 'Mobile Payment App',
    description: 'Developed core payment processing system for mobile app with 500K+ active users. Implemented PCI-compliant payment gateway integration and fraud detection algorithms.',
    industry: 'Fintech',
    technologies: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT'],
    keywords: ['payments', 'security', 'mobile development', 'API integration'],
    architectureDiagrams: [],
    startDate: '2019-06',
    endDate: '2020-12',
  });

  const aiChatbot = await projectDb.create({
    companyId: techStartup.id,
    name: 'AI-Powered Customer Support',
    description: 'Built intelligent chatbot using NLP to handle 80% of customer inquiries automatically, reducing support costs by $200K annually.',
    industry: 'AI/ML',
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'React', 'PostgreSQL', 'OpenAI API'],
    keywords: ['machine learning', 'NLP', 'automation', 'customer service'],
    architectureDiagrams: [],
    startDate: '2020-03',
    endDate: '2021-04',
  });

  // Create sample projects for Consulting Firm
  const ecommerceRewrite = await projectDb.create({
    companyId: consultingFirm.id,
    name: 'E-commerce Platform Modernization',
    description: 'Leading team of 5 engineers to rewrite legacy e-commerce platform. Improving performance by 300% and adding modern features like personalization and real-time inventory.',
    industry: 'E-commerce',
    technologies: ['Next.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Vercel', 'Stripe'],
    keywords: ['modernization', 'performance', 'team leadership', 'agile'],
    architectureDiagrams: [],
    startDate: '2024-02',
  });

  console.log('✅ Created 6 projects');

  // Create sample presentations
  const frontendPresentation = await presentationDb.create({
    name: 'Senior Frontend Engineer - Meta',
    targetRole: 'Senior Frontend Engineer',
    targetCompany: 'Meta',
    notes: 'Focus on React, performance optimization, and large-scale systems',
    hiddenCompanyIds: [],
    hiddenProjectIds: [mobilePayment.id],
  });

  const fullstackPresentation = await presentationDb.create({
    name: 'Full Stack Tech Lead - Startup',
    targetRole: 'Full Stack Tech Lead',
    targetCompany: 'Stealth Startup',
    notes: 'Emphasize startup experience and end-to-end ownership',
    hiddenCompanyIds: [],
    hiddenProjectIds: [analyticsEngine.id],
  });

  const cloudPresentation = await presentationDb.create({
    name: 'Cloud Architect - AWS',
    targetRole: 'Senior Cloud Architect',
    targetCompany: 'Amazon Web Services',
    notes: 'Highlight cloud migration and AWS expertise',
    hiddenCompanyIds: [techStartup.id],
    hiddenProjectIds: [aiChatbot.id],
  });

  console.log('✅ Created 3 presentations');
  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('You can now:');
  console.log('  - View companies at http://localhost:5173/companies');
  console.log('  - View presentations at http://localhost:5173/presentations');
  console.log('');
  process.exit(0);
}

seed().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
