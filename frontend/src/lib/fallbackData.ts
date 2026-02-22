import type { Article } from '@/types';

const demoAuthor = {
    _id: 'demo-author-001',
    name: 'Akshar Team',
    email: 'team@akshar.dev',
    username: 'akshar-team',
    bio: 'The creative minds behind Akshar — a platform for thoughtful writing.',
    followers: [],
    following: [],
    createdAt: '2025-12-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z',
};

const demoAuthor2 = {
    _id: 'demo-author-002',
    name: 'Aarav Sharma',
    email: 'aarav@akshar.dev',
    username: 'aarav-writes',
    bio: 'Exploring the intersection of technology and culture.',
    followers: [],
    following: [],
    createdAt: '2025-11-15T00:00:00.000Z',
    updatedAt: '2025-11-15T00:00:00.000Z',
};

const demoAuthor3 = {
    _id: 'demo-author-003',
    name: 'Priya Verma',
    email: 'priya@akshar.dev',
    username: 'priya-creates',
    bio: 'Writer, thinker, and lifelong learner.',
    followers: [],
    following: [],
    createdAt: '2025-10-20T00:00:00.000Z',
    updatedAt: '2025-10-20T00:00:00.000Z',
};

export const FALLBACK_ARTICLES: Article[] = [
    {
        _id: 'demo-001',
        title: 'The Art of Thoughtful Writing in a Distracted World',
        content: `<p>In an age of endless notifications and infinite scrolls, the act of sitting down to write — truly write — has become a quiet act of rebellion. We are surrounded by noise, yet the most powerful ideas often emerge from silence.</p>
<p>Writing is not just about putting words on a page. It is about slowing down, observing the world with intention, and giving shape to thoughts that would otherwise remain formless. The best writing doesn't shout; it whispers something true.</p>
<p>This is what Akshar is built for. A space where depth matters more than speed, where quality conversations replace engagement metrics, and where every word carries weight.</p>
<h2>Why Deep Writing Matters</h2>
<p>Research consistently shows that the act of writing by hand or in focused environments improves comprehension, memory retention, and creative thinking. When we write thoughtfully, we don't just communicate — we think more clearly.</p>
<p>The digital age has given us incredible tools, but it has also fragmented our attention. Akshar aims to bring back the joy of focused creation, one article at a time.</p>`,
        tags: ['writing', 'creativity', 'mindfulness'],
        status: 'published',
        author: demoAuthor,
        likes: [],
        likesCount: 42,
        slug: 'demo-art-of-thoughtful-writing',
        createdAt: '2026-02-18T10:30:00.000Z',
        updatedAt: '2026-02-18T10:30:00.000Z',
    },
    {
        _id: 'demo-002',
        title: 'Building Communities Around Ideas, Not Algorithms',
        content: `<p>Social media promised to connect us but ended up isolating us in algorithmic bubbles. What if a platform could bring people together around genuine ideas instead?</p>
<p>The most meaningful conversations happen when people feel safe to share, challenge, and grow together. That's the vision behind community-driven platforms — spaces where your feed is shaped by curiosity, not clicks.</p>
<h2>Beyond the Like Button</h2>
<p>Engagement should be measured in depth, not volume. A single thoughtful comment is worth more than a thousand hollow likes. When we design for depth, we create spaces where real connection can flourish.</p>
<p>Communities built around shared interests and authentic expression tend to be more resilient, more creative, and more fulfilling for their members.</p>`,
        tags: ['community', 'technology', 'social'],
        status: 'published',
        author: demoAuthor2,
        likes: [],
        likesCount: 38,
        slug: 'demo-building-communities-around-ideas',
        createdAt: '2026-02-15T14:00:00.000Z',
        updatedAt: '2026-02-15T14:00:00.000Z',
    },
    {
        _id: 'demo-003',
        title: 'The Philosophy of Samvaad: Meaningful Dialogue',
        content: `<p>The Sanskrit word <em>Samvaad</em> (संवाद) means dialogue — not just any conversation, but a meaningful exchange that leads to mutual understanding. In Indian philosophical traditions, samvaad was considered the highest form of intellectual engagement.</p>
<p>Unlike debate, which seeks to win, samvaad seeks to understand. It is a process of co-creation where both participants emerge wiser than they began.</p>
<h2>Bringing Samvaad Online</h2>
<p>Can digital spaces foster this kind of deep dialogue? We believe they can — with the right design choices. Comment sections don't have to be toxic. Discussions don't have to devolve into arguments. When we design for reflection rather than reaction, something beautiful emerges.</p>`,
        tags: ['philosophy', 'culture', 'dialogue'],
        status: 'published',
        author: demoAuthor3,
        likes: [],
        likesCount: 56,
        slug: 'demo-philosophy-of-samvaad',
        createdAt: '2026-02-12T09:15:00.000Z',
        updatedAt: '2026-02-12T09:15:00.000Z',
    },
    {
        _id: 'demo-004',
        title: 'Designing for Focus: Lessons from Minimalist Architecture',
        content: `<p>The best digital experiences, much like the best architecture, know what to leave out. Minimalism isn't about austerity — it's about creating space for what truly matters.</p>
<p>When we remove clutter from interfaces, we give users permission to focus. Every element that doesn't serve a purpose becomes a distraction. The whitespace isn't empty — it's breathing room for thought.</p>
<h2>Less Interface, More Experience</h2>
<p>The most powerful writing tools are often the simplest. A blank page, a blinking cursor, and the freedom to think — that's where great writing begins. Digital tools should enhance this experience, not overwhelm it.</p>
<p>At Akshar, every design decision starts with a question: does this help the writer write, and the reader read?</p>`,
        tags: ['design', 'minimalism', 'ux'],
        status: 'published',
        author: demoAuthor,
        likes: [],
        likesCount: 29,
        slug: 'demo-designing-for-focus',
        createdAt: '2026-02-08T16:45:00.000Z',
        updatedAt: '2026-02-08T16:45:00.000Z',
    },
    {
        _id: 'demo-005',
        title: 'From Akshar to Expression: The Journey of Every Writer',
        content: `<p><em>Akshar</em> (अक्षर) — the imperishable letter. In Sanskrit, it refers to the smallest unit of written language, yet it carries a profound meaning: that which cannot be destroyed. Every great story, every revolutionary idea, every love letter began with a single akshar.</p>
<p>The journey from that first letter to a fully formed piece of writing is one of the most human experiences there is. It requires courage, patience, and a willingness to be vulnerable on the page.</p>
<h2>Everyone Has a Story</h2>
<p>You don't need to be a professional writer to have something worth saying. The best blogs come from people who write because they must — because the ideas inside them demand expression. Your unique perspective is your greatest asset.</p>
<p>Start with one akshar. The rest will follow.</p>`,
        tags: ['writing', 'inspiration', 'culture'],
        status: 'published',
        author: demoAuthor2,
        likes: [],
        likesCount: 67,
        slug: 'demo-from-akshar-to-expression',
        createdAt: '2026-02-05T11:20:00.000Z',
        updatedAt: '2026-02-05T11:20:00.000Z',
    },
];

/**
 * Check whether a slug belongs to a fallback/demo article.
 */
export function isFallbackArticle(slug: string): boolean {
    return slug.startsWith('demo-');
}

/**
 * Find a fallback article by its slug.
 */
export function getFallbackArticleBySlug(slug: string): Article | undefined {
    return FALLBACK_ARTICLES.find((a) => a.slug === slug);
}
