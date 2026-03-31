-- Fix duplicate blog SEO titles (keep all posts, make titles unique)
-- Run in Supabase SQL editor.

update blog_posts
set seo_title = 'WhatsApp Chatbot for Business: Support Automation | RapidNexTech'
where slug = 'revolutionize-customer-support-with-whatsapp-chatbot-for-business';

update blog_posts
set seo_title = 'WhatsApp Chatbot for Business: Sales Conversion | RapidNexTech'
where slug = 'boost-sales-with-whatsapp-chatbot-for-business';

update blog_posts
set seo_title = 'Aesthetic Clinic Lead Conversion Rates | RapidNexTech'
where slug = 'boost-aesthetic-clinic-lead-conversion-rates';

update blog_posts
set seo_title = 'Aesthetic Clinic Lead Conversion Strategy | RapidNexTech'
where slug = 'boost-aesthetic-clinic-lead-conversion';

update blog_posts
set seo_title = 'Instagram Marketing for Aesthetic Clinics: Lead Growth | RapidNexTech'
where slug = 'boost-aesthetic-clinic-leads-with-instagram-marketing';

update blog_posts
set seo_title = 'Instagram Marketing for Aesthetic Clinics: Capture More Leads | RapidNexTech'
where slug = 'instagram-marketing-for-aesthetic-clinics-capture-more-leads';
