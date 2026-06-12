import { prisma } from '@/shared/lib/prisma';

export type StartupListItem = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  authorName: string;
  authorId: string;
  score: number;
  voteCount: number;
  commentCount: number;
  fileCount: number;
  userVote: number | null;
};

export type VoteFilter = 'all' | 'voted' | 'not_voted';

export async function getStartupsList(options: {
  q?: string;
  sort?: string;
  order?: string;
  userId?: string;
  voteFilter?: VoteFilter;
}): Promise<StartupListItem[]> {
  const { q, sort = 'score', order = 'desc', userId, voteFilter = 'all' } =
    options;

  const where = q
    ? {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      }
    : undefined;

  const startups = await prisma.startup.findMany({
    where,
    include: {
      author: { select: { id: true, name: true } },
      votes: { select: { value: true, userId: true } },
      _count: { select: { comments: true, files: true } },
    },
  });

  const items: StartupListItem[] = startups.map((s) => {
    const score = s.votes.reduce((sum, v) => sum + v.value, 0);
    const userVote = userId
      ? (s.votes.find((v) => v.userId === userId)?.value ?? null)
      : null;

    return {
      id: s.id,
      title: s.title,
      description: s.description,
      createdAt: s.createdAt,
      authorName: s.author.name,
      authorId: s.author.id,
      score,
      voteCount: s.votes.length,
      commentCount: s._count.comments,
      fileCount: s._count.files,
      userVote,
    };
  });

  let filtered = items;
  if (userId && voteFilter !== 'all') {
    filtered = items.filter((item) => {
      const voted = item.userVote !== null;
      return voteFilter === 'voted' ? voted : !voted;
    });
  }

  filtered.sort((a, b) => {
    if (sort === 'date') {
      const diff = a.createdAt.getTime() - b.createdAt.getTime();
      return order === 'asc' ? diff : -diff;
    }
    const diff = a.score - b.score;
    return order === 'asc' ? diff : -diff;
  });

  return filtered;
}

export function calcScore(votes: { value: number }[]): number {
  return votes.reduce((sum, v) => sum + v.value, 0);
}
