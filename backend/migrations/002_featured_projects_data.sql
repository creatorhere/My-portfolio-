BEGIN;

-- Retain the old sample rows, but stop showing them as featured projects.
UPDATE projects
SET is_featured = FALSE
WHERE title IN ('Wayline', 'Tandem', 'Forge');

-- Hide rows from the prior finance-project entry without deleting their history.
UPDATE projects
SET is_featured = FALSE
WHERE repository_url = 'https://github.com/creatorhere/mini-project';

-- Reuse an existing Haunted Terminal row or its prior finance-project row.
UPDATE projects
SET slug = 'haunted-terminal',
    title = 'Haunted Terminal',
    summary = 'A Python terminal wrapper that runs normal commands and asks a local Ollama Gemma 3 model for a brief ghostly response based on the command and up to 400 characters of output. Timestamped responses are saved to a local log.',
    date_label = 'Oct 2026',
    tag = 'Developer tools',
    color = 'dark',
    repository_url = 'https://github.com/creatorhere/haunted-terminal',
    live_demo_url = NULL,
    source_url = NULL,
    image_url = NULL,
    technologies = ARRAY['Python 3.9+', 'Ollama', 'Gemma 3:1b', 'ollama Python package']::TEXT[],
    sort_order = 1,
    is_featured = TRUE
WHERE id = (
    SELECT id FROM projects
    WHERE slug = 'haunted-terminal'
       OR title = 'Haunted Terminal'
       OR repository_url = 'https://github.com/creatorhere/mini-project'
    ORDER BY
        CASE
            WHEN slug = 'haunted-terminal' THEN 1
            WHEN title = 'Haunted Terminal' THEN 2
            ELSE 3
        END,
        id
    LIMIT 1
);

-- If duplicate legacy rows exist, leave only the canonical featured project.
UPDATE projects
SET is_featured = FALSE
WHERE (title = 'Haunted Terminal'
       OR repository_url = 'https://github.com/creatorhere/mini-project')
  AND slug IS DISTINCT FROM 'haunted-terminal';

UPDATE projects
SET slug = 'finbuddy-budgenix-fork',
    title = 'FinBuddy / Budgenix fork',
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
    title = 'My Developer Portfolio',
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
        'haunted-terminal',
        'Haunted Terminal',
        'A Python terminal wrapper that runs normal commands and asks a local Ollama Gemma 3 model for a brief ghostly response based on the command and up to 400 characters of output. Timestamped responses are saved to a local log.',
        'Oct 2026',
        'Developer tools',
        'dark',
        'https://github.com/creatorhere/haunted-terminal',
        NULL,
        NULL,
        NULL,
        ARRAY['Python 3.9+', 'Ollama', 'Gemma 3:1b', 'ollama Python package']::TEXT[],
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
