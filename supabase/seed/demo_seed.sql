-- CampusCalm Initial Seed Data
-- Standard Interventions
INSERT INTO interventions (id, title, category, duration_minutes, description) VALUES
('box_breathing', '4-4-4 Box Breathing Reset', 'Breathing', 3, 'Slow regulated breathing to down-regulate sympathetic nervous system response.'),
('grounding_54321', '5-4-3-2-1 Sensory Grounding', 'Grounding', 4, 'Multi-sensory mindfulness technique to anchor racing thoughts in physical space.'),
('bubble_zen', 'Bubble Zen Calming Game', 'Calming Game', 3, 'Rhythmic bubble popping synchronized with gentle chime tones.'),
('study_planner_reset', 'Stress-to-Action Study Sprint', 'Planning', 5, 'Deconstruct overwhelming syllabi into 25-minute manageable chunks.'),
('mind_match', 'Mind Match Memory Focus', 'Focus Game', 3, 'Gentle memory pairing to restore working memory without pressure.'),
('rain_soundscape', 'Soothing Monsoon Rain Audio', 'Audio', 10, 'Continuous synthesized rain soundscape designed to mask hostel corridor noise.')
ON CONFLICT (id) DO NOTHING;

-- Pre-seeded anonymous community posts
INSERT INTO community_posts (author_alias, category, content, reactions) VALUES
('Anonymous Falcon', 'Exam stress', 'To anyone freaking out about tomorrow''s Database exam: remember that everyone in the lecture hall is feeling equally overwhelmed. Just review indexing and SQL joins. We got this!', '{"hug": 24, "relate": 42, "strength": 19}'),
('Anonymous Otter', 'Hostel life', 'First semester in the hostel was so lonely for me. If you''re eating alone at the mess hall today, remember it takes time to find your people. It gets significantly better after mid-sem.', '{"hug": 58, "relate": 37, "strength": 29}'),
('Anonymous Panda', 'Placement pressure', 'Got rejected in the final round of an on-campus drive. Felt like my world ended for 24 hours. Took a long walk, talked to a senior, and realized this is just round 1 of a 40-year career.', '{"hug": 83, "relate": 64, "strength": 51}')
ON CONFLICT DO NOTHING;
