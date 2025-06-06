import { createHash } from 'crypto';
import { FastifyBaseLogger } from 'fastify';
import { DEFAULT_PLATFORM_LIMIT } from 'workflow-axb-shared';
import { cryptoUtils } from 'workflow-server-shared';
import {
    AuthenticationResponse,
    BlocksFilterType,
    isNil,
    NotificationStatus,
    PlatformRole,
    PrincipalType,
    Project,
    User,
    UserIdentity,
    UserIdentityProvider,
} from 'workflow-shared';
import { aiProviderService } from '../../ai/ai-provider.service';
import { appConnectionService } from '../../app-connection/app-connection-service/app-connection-service';
import { accessTokenManager } from '../../authentication/lib/access-token-manager';
import { userIdentityService } from '../../authentication/user-identity/user-identity-service';
import { platformService } from '../../platform/platform.service';
import { projectService } from '../../project/project-service';
import { blockTagService } from '../../tags/blocks/block-tag.service';
import { userService } from '../../user/user-service';
import { smtpEmailSender } from '../helper/email/email-sender/smtp-email-sender';
import { projectMemberService } from '../project-members/project-member.service';
import { projectLimitsService } from '../project-plan/project-plan.service';
import { externalTokenExtractor } from './lib/external-token-extractor';

export const managedAuthnService = (log: FastifyBaseLogger) => ({
    async externalToken({ externalAccessToken }: AuthenticateParams): Promise<AuthenticationResponse> {
        const externalPrincipal = await externalTokenExtractor(log).extract(externalAccessToken);

        const project = await getOrCreateProject({
            platformId: externalPrincipal.platformId,
            externalProjectId: externalPrincipal.externalProjectId,
        });

        await updateProjectLimits(
            project.platformId,
            project.id,
            externalPrincipal.pieces.tags,
            externalPrincipal.pieces.filterType,
            externalPrincipal.tasks,
            externalPrincipal.aiTokens
        );
        const user = await getOrCreateUser(externalPrincipal, log);

        await projectMemberService(log).upsert({
            projectId: project.id,
            userId: user.id,
            projectRoleName: externalPrincipal.projectRole,
        });

        if (externalPrincipal.token && externalPrincipal.url && user.externalId) {
            try {
                await appConnectionService(log).aixblockConnectionAuto({
                    url: externalPrincipal.url,
                    token: externalPrincipal.token,
                    platformId: externalPrincipal.platformId,
                    projectId: project.id,
                    userId: user.id,
                    externalId: externalPrincipal.externalUserId,
                });
                await aiProviderService.autoConnectAIxBlockProvider({
                    url: externalPrincipal.url,
                    token: externalPrincipal.token,
                    platformId: externalPrincipal.platformId,
                    projectId: project.id,
                });
            } catch (error) {
                console.error('Error while auto connect aixblock', error)
            }
        }

        const identity = await userIdentityService(log).getOneOrFail({
            id: user.identityId,
        });

        const token = await accessTokenManager.generateToken(
            {
                id: user.id,
                type: PrincipalType.USER,
                projectId: project.id,
                platform: {
                    id: externalPrincipal.platformId,
                },
                tokenVersion: identity.tokenVersion,
            },
            7 * 24 * 60 * 60 * 1000
        );
        return {
            id: user.id,
            platformRole: user.platformRole,
            status: user.status,
            externalId: user.externalId,
            platformId: user.platformId,
            firstName: identity.firstName,
            lastName: identity.lastName,
            email: identity.email,
            trackEvents: identity.trackEvents,
            newsLetter: identity.newsLetter,
            verified: identity.verified,
            token,
            projectId: project.id,
        };
    },
});

const updateProjectLimits = async (
    platformId: string,
    projectId: string,
    piecesTags: string[],
    piecesFilterType: BlocksFilterType,
    tasks: number | undefined,
    aiTokens: number | undefined
): Promise<void> => {
    const pieces = await getPiecesList({
        platformId,
        projectId,
        piecesTags,
        piecesFilterType,
    });
    const projectPlan = await projectLimitsService.getPlanByProjectId(projectId);
    await projectLimitsService.upsert(
        {
            nickname: projectPlan?.name ?? DEFAULT_PLATFORM_LIMIT.nickname,
            tasks: tasks ?? projectPlan?.tasks ?? DEFAULT_PLATFORM_LIMIT.tasks,
            aiTokens: aiTokens ?? projectPlan?.aiTokens ?? DEFAULT_PLATFORM_LIMIT.aiTokens,
            pieces,
            piecesFilterType,
        },
        projectId
    );
};

const getOrCreateUser = async (params: GetOrCreateUserParams, log: FastifyBaseLogger): Promise<User> => {
    const existingUser = await userService.getByPlatformAndExternalId({
        platformId: params.platformId,
        externalId: params.externalUserId,
    });

    if (!isNil(existingUser)) {
        if (params.token) {
            await userIdentityService(log).updateToken({
                id: existingUser.identityId,
                token: params.token,
            });
        }

        if (params.url) {
            await userIdentityService(log).updateUrl({
                id: existingUser.identityId,
                url: params.url,
            });
        }

        return existingUser;
    }
    const password = await cryptoUtils.generateRandomPassword();
    params.password = password;
    const identity = await getOrCreateUserIdentity(params, log);
    const user = await userService.create({
        externalId: params.externalUserId,
        platformId: params.platformId,
        identityId: identity.id,
        platformRole: PlatformRole.MEMBER,
    });

    const externalEmail = params.externalUserId.includes('::') ? params.externalUserId.split('::')[1] : params.externalUserId;

    // Send username and password to user after create new account
    smtpEmailSender(log).send({
        emails: [externalEmail],
        platformId: params.platformId,
        templateData: {
            name: 'register',
            vars: {
                email: externalEmail,
                username: identity.email,
                password,
            },
        },
    });

    return user;
};

const getOrCreateUserIdentity = async (params: GetOrCreateUserParams, log: FastifyBaseLogger): Promise<UserIdentity> => {
    const cleanedEmail = generateEmailHash(params);
    const existingIdentity = await userIdentityService(log).getIdentityByEmail(cleanedEmail);
    if (!isNil(existingIdentity)) {
        if (params.token) {
            await userIdentityService(log).updateToken({
                id: existingIdentity.id,
                token: params.token,
            });
        }

        if (params.url) {
            await userIdentityService(log).updateUrl({
                id: existingIdentity.id,
                url: params.url,
            });
        }

        return existingIdentity;
    }
    const identity = await userIdentityService(log).create({
        email: cleanedEmail,
        password: params.password as string,
        firstName: params.externalFirstName,
        lastName: params.externalLastName,
        trackEvents: true,
        newsLetter: false,
        provider: UserIdentityProvider.JWT,
        verified: true,
        token: params.token,
        url: params.url,
    });
    return identity;
};
const getOrCreateProject = async ({ platformId, externalProjectId }: GetOrCreateProjectParams): Promise<Project> => {
    const existingProject = await projectService.getByPlatformIdAndExternalId({
        platformId,
        externalId: externalProjectId,
    });

    if (!isNil(existingProject)) {
        return existingProject;
    }

    const platform = await platformService.getOneOrThrow(platformId);

    const project = await projectService.create({
        displayName: externalProjectId,
        ownerId: platform.ownerId,
        platformId,
        notifyStatus: NotificationStatus.NEVER,
        externalId: externalProjectId,
    });

    return project;
};

const getPiecesList = async ({ piecesFilterType, piecesTags, platformId }: UpdateProjectLimits): Promise<string[]> => {
    switch (piecesFilterType) {
        case BlocksFilterType.ALLOWED: {
            return blockTagService.findByPlatformAndTags(platformId, piecesTags);
        }
        case BlocksFilterType.NONE: {
            return [];
        }
    }
};

function generateEmailHash(params: { platformId: string; externalUserId: string }): string {
    const inputString = `managed_${params.platformId}_${params.externalUserId}`;
    return cleanEmailOtherwiseCompareFails(createHash('sha256').update(inputString).digest('hex'));
}

function cleanEmailOtherwiseCompareFails(email: string): string {
    return email.trim().toLowerCase();
}

type AuthenticateParams = {
    externalAccessToken: string;
};

type GetOrCreateUserParams = {
    id?: string;
    platformId: string;
    externalUserId: string;
    externalProjectId: string;
    externalFirstName: string;
    externalLastName: string;
    password?: string;
    token?: string;
    url?: string;
};

type GetOrCreateProjectParams = {
    platformId: string;
    externalProjectId: string;
};

type UpdateProjectLimits = {
    platformId: string;
    projectId: string;
    piecesTags: string[];
    piecesFilterType: BlocksFilterType;
};
