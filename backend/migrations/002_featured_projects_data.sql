BEGIN;

-- Retain the old sample rows, but stop showing them as featured projects.
UPDATE projects
SET is_featured = FALSE
WHERE title IN ('Wayline', 'Tandem', 'Forge');

-- Update existing matching rows so the script works with the initial seed data.
UPDATE projects
SET slug = 'moneyflow',
    summary = 'Frontend-only finance prototype with preloaded sample expenses, client-side totals and category breakdowns, and editable budgets. No connected persistence is included, and analytics charts are placeholders.',
    date_label = 'Updated Mar 2026',
    tag = 'Finance prototype',
    color = 'yellow',
    repository_url = 'https://github.com/creatorhere/mini-project',
    live_demo_url = NULL,
    source_url = NULL,
    image_url = NULL,
    technologies = ARRAY['HTML', 'CSS', 'JavaScript', 'Tailwind CSS']::TEXT[],
    sort_order = 1,
    is_featured = TRUE
WHERE id = (
    SELECT id FROM projects
    WHERE slug = 'moneyflow' OR title = 'MoneyFlow'
    ORDER BY COALESCE(slug = 'moneyflow', FALSE) DESC, id
    LIMIT 1
);

UPDATE projects
SET slug = 'finbuddy-budgenix-fork',
    summary = 'Fork of kaihere14/Budgenix; this branch has no fork-specific code changes. The upstream app offers chat-based expense logging, rule-based budget advice, and spending charts.',
    date_label = 'Forked Nov 2025',
    tag = 'Open-source fork',
    color = 'green',
    repository_url = 'https://github.com/creatorhere/Budgenix',
    live_demo_url = 'https://finbuddy-alpha.vercel.app/',
    source_url = 'https://github.com/kaihere14/Budgenix',
    image_url = NULL,
    technologies = ARRAY['React', 'Node.js', 'Express', 'MongoDB Atlas']::TEXT[],
    sort_order = 2,
    is_featured = TRUE
WHERE id = (
    SELECT id FROM projects
    WHERE slug = 'finbuddy-budgenix-fork' OR title = 'FinBuddy / Budgenix fork'
    ORDER BY COALESCE(slug = 'finbuddy-budgenix-fork', FALSE) DESC, id
    LIMIT 1
);

UPDATE projects
SET slug = 'my-developer-portfolio',
    summary = 'A notebook-style developer portfolio built with React, FastAPI, and PostgreSQL on Tiger Cloud, with projects loaded from the API and contact messages saved to the database.',
    date_label = 'Updated Oct 2026',
    tag = 'Full-stack',
    color = 'blue',
    repository_url = 'https://github.com/creatorhere/My-portfolio-',
    live_demo_url = NULL,
    source_url = NULL,
    image_url = NULL,
    technologies = ARRAY['React', 'Vite', 'FastAPI', 'Python', 'PostgreSQL', 'Tiger Cloud']::TEXT[],
    sort_order = 3,
    is_featured = TRUE
WHERE id = (
    SELECT id FROM projects
    WHERE slug = 'my-developer-portfolio' OR title = 'My Developer Portfolio'
    ORDER BY COALESCE(slug = 'my-developer-portfolio', FALSE) DESC, id
    LIMIT 1
);

INSERT INTO projects (
    slug, title, summary, date_label, tag, color, repository_url, live_demo_url,
    source_url, image_url, technologies, sort_order, is_featured
)
VALUES
    (
        'moneyflow',
        'MoneyFlow',
        'Frontend-only finance prototype with preloaded sample expenses, client-side totals and category breakdowns, and editable budgets. No connected persistence is included, and analytics charts are placeholders.',
        'Updated Mar 2026',
        'Finance prototype',
        'yellow',
        'https://github.com/creatorhere/mini-project',
        NULL,
        NULL,
        NULL,
        ARRAY['HTML', 'CSS', 'JavaScript', 'Tailwind CSS']::TEXT[],
        1,
        TRUE
    ),
    (
        'finbuddy-budgenix-fork',
        'FinBuddy / Budgenix fork',
        'Fork of kaihere14/Budgenix; this branch has no fork-specific code changes. The upstream app offers chat-based expense logging, rule-based budget advice, and spending charts.',
        'Forked Nov 2025',
        'Open-source fork',
        'green',
        'https://github.com/creatorhere/Budgenix',
        'https://finbuddy-alpha.vercel.app/',
        'https://github.com/kaihere14/Budgenix',
        NULL,
        ARRAY['React', 'Node.js', 'Express', 'MongoDB Atlas']::TEXT[],
        2,
        TRUE
    ),
    (
        'my-developer-portfolio',
        'My Developer Portfolio',
        'A notebook-style developer portfolio built with React, FastAPI, and PostgreSQL on Tiger Cloud, with projects loaded from the API and contact messages saved to the database.',
        'Updated Oct 2026',
        'Full-stack',
        'blue',
        'https://github.com/creatorhere/My-portfolio-',
        NULL,
        NULL,
        NULL,
        ARRAY['React', 'Vite', 'FastAPI', 'Python', 'PostgreSQL', 'Tiger Cloud']::TEXT[],
        3,
        TRUE
    )
ON CONFLICT (slug) WHERE slug IS NOT NULL
DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    date_label = EXCLUDED.date_label,
    tag = EXCLUDED.tag,
    color = EXCLUDED.color,
    repository_url = EXCLUDED.repository_url,
    live_demo_url = EXCLUDED.live_demo_url,
    source_url = EXCLUDED.source_url,
    image_url = EXCLUDED.image_url,
    technologies = EXCLUDED.technologies,
    sort_order = EXCLUDED.sort_order,
    is_featured = EXCLUDED.is_featured;

COMMIT;
