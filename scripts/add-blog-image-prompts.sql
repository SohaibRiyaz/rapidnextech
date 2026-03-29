-- Adds image_prompts column to blog_posts for storing AI image prompts
alter table public.blog_posts
add column if not exists image_prompts jsonb;
