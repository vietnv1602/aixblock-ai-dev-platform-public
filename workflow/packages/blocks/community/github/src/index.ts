import { createCustomApiCallAction } from 'workflow-blocks-common';
import {
    OAuth2PropertyValue,
    PieceAuth,
    createPiece,
} from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { githubCreateCommentOnAIssue } from './lib/actions/create-comment-on-a-issue';
import { githubCreateCommitCommentAction } from './lib/actions/create-commit-comment';
import { githubCreateDiscussionCommentAction } from './lib/actions/create-discussion-comment';
import { githubCreateIssueAction } from './lib/actions/create-issue';
import { githubCreatePullRequestReviewCommentAction } from './lib/actions/create-pull-request-review-comment';
import { githubGetIssueInformation } from './lib/actions/get-issue-information';
import { githubLockIssueAction } from './lib/actions/lock-issue';
import { githubRawGraphqlQuery } from './lib/actions/raw-graphql-query';
import { githubUnlockIssueAction } from './lib/actions/unlock-issue';
import { githubTriggers } from './lib/trigger';

export const githubAuth = PieceAuth.OAuth2({
  required: true,
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  scope: ['admin:repo_hook', 'admin:org', 'repo'],
});

export const github = createPiece({
  displayName: 'GitHub',
  description:
    'Developer platform that allows developers to create, store, manage and share their code',

  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/github.png',
  categories: [BlockCategory.DEVELOPER_TOOLS],
  auth: githubAuth,
  actions: [
    githubCreateIssueAction,
    githubGetIssueInformation,
    githubCreateCommentOnAIssue,
    githubLockIssueAction,
    githubUnlockIssueAction,
    githubRawGraphqlQuery,
    githubCreatePullRequestReviewCommentAction,
    githubCreateCommitCommentAction,
    githubCreateDiscussionCommentAction,
    createCustomApiCallAction({
      baseUrl: () => 'https://api.github.com',
      auth: githubAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as OAuth2PropertyValue).access_token}`,
      }),
    }),
  ],
  authors: [
    'kishanprmr',
    'MoShizzle',
    'AbdulTheActivePiecer',
    'khaledmashaly',
    'abuaboud',
    'tintinthedev',
  ],
  triggers: githubTriggers,
});
