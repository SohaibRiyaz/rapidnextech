-- Remove duplicate blog posts created during queue loop
-- Review the slugs before running in production.

delete from public.blog_posts
where slug in (
  'revolutionize-property-sales-with-real-estate-chatbot-automation',
  'boost-botox-clinic-bookings-with-whatsapp-automation',
  'boost-botox-bookings-with-whatsapp-automation',
  'convert-website-visitors-into-appointments',
  'streamline-appointments-with-aesthetic-clinic-booking-system',
  'streamline-aesthetic-clinic-bookings-with-smart-solutions',
  'reduce-clinic-appointment-no-shows-with-automation',
  'revolutionizing-clinic-front-desks-with-ai-receptionists',
  'boost-lead-response-time-conversion',
  'lead-response-time-conversion-speed-up-sales',
  'boosting-business-with-ai-chat-assistants',
  'unlock-instagram-marketing-for-aesthetic-clinics',
  'boost-bookings-with-business-automation-for-service-businesses',
  'boost-aesthetic-clinic-leads-with-instagram'
);
