import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  canComment,
  canCreateStartup,
  canDeleteStartup,
  canEditStartup,
  canManageRoles,
  canReplyToComments,
  canViewStartups,
  canVote,
  canVoteOnStartup,
} from '@/shared/lib/permissions';
import { Role } from '@/modules/auth/lib/roles';

describe('permissions', () => {
  it('canViewStartups', () => {
    assert.equal(canViewStartups(Role.PENDING), false);
    assert.equal(canViewStartups(Role.FOUNDER), true);
    assert.equal(canViewStartups(Role.EVALUATOR), true);
    assert.equal(canViewStartups(Role.ADMIN), true);
  });

  it('canCreateStartup', () => {
    assert.equal(canCreateStartup(Role.FOUNDER), true);
    assert.equal(canCreateStartup(Role.ADMIN), false);
    assert.equal(canCreateStartup(Role.EVALUATOR), false);
    assert.equal(canCreateStartup(Role.PENDING), false);
  });

  it('canEditStartup', () => {
    assert.equal(canEditStartup(Role.ADMIN, 'u1', 'u2'), true);
    assert.equal(canEditStartup(Role.FOUNDER, 'u1', 'u1'), true);
    assert.equal(canEditStartup(Role.FOUNDER, 'u1', 'u2'), false);
    assert.equal(canEditStartup(Role.EVALUATOR, 'u1', 'u1'), false);
  });

  it('canDeleteStartup matches canEditStartup', () => {
    assert.equal(canDeleteStartup(Role.ADMIN, 'u1', 'u2'), true);
    assert.equal(canDeleteStartup(Role.FOUNDER, 'u1', 'u1'), true);
    assert.equal(canDeleteStartup(Role.FOUNDER, 'u1', 'u2'), false);
    assert.equal(canDeleteStartup(Role.EVALUATOR, 'u1', 'u1'), false);
  });

  it('canVote for evaluator and founder', () => {
    assert.equal(canVote(Role.EVALUATOR), true);
    assert.equal(canVote(Role.FOUNDER), true);
    assert.equal(canVote(Role.ADMIN), false);
    assert.equal(canComment(Role.EVALUATOR), true);
    assert.equal(canComment(Role.FOUNDER), false);
  });

  it('canVoteOnStartup blocks voting on own startup', () => {
    assert.equal(canVoteOnStartup('u1', 'u1'), false);
    assert.equal(canVoteOnStartup('u1', 'u2'), true);
  });

  it('canReplyToComments only for startup author', () => {
    assert.equal(canReplyToComments('author', 'author'), true);
    assert.equal(canReplyToComments('other', 'author'), false);
  });

  it('canManageRoles only for admin', () => {
    assert.equal(canManageRoles(Role.ADMIN), true);
    assert.equal(canManageRoles(Role.FOUNDER), false);
  });
});
