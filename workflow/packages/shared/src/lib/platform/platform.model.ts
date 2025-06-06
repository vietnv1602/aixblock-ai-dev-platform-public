import { Static, Type } from '@sinclair/typebox'
import { LocalesEnum } from '../common'
import { BaseModelSchema, Nullable } from '../common/base-model'
import { ApId } from '../common/id-generator'
import { FederatedAuthnProviderConfig, FederatedAuthnProviderConfigWithoutSensitiveData } from '../federated-authn'

export type PlatformId = ApId

export enum FilteredPieceBehavior {
    ALLOWED = 'ALLOWED',
    BLOCKED = 'BLOCKED',
}

export const SMTPInformation = Type.Object({
    user: Type.String(),
    senderEmail: Type.String(),
    senderName: Type.String(),
    password: Type.String(),
    host: Type.String(),
    port: Type.Number(),
})

export type SMTPInformation = Static<typeof SMTPInformation>

export const PlatformUsage = Type.Object({
    tasks: Type.Number(),
    aiCredits: Type.Number(),
})

export type PlatformUsage = Static<typeof PlatformUsage>

export const Platform = Type.Object({
    ...BaseModelSchema,
    ownerId: ApId,
    name: Type.String(),
    primaryColor: Type.String(),
    logoIconUrl: Type.String(),
    fullLogoUrl: Type.String(),
    favIconUrl: Type.String(),
    /**
    * @deprecated Use projects filter instead.
    */
    filteredPieceNames: Type.Array(Type.String()),
    /**
    * @deprecated Use projects filter instead.
    */
    filteredPieceBehavior: Type.Enum(FilteredPieceBehavior),
    smtp: Nullable(SMTPInformation),
    cloudAuthEnabled: Type.Boolean(),
    environmentsEnabled: Type.Boolean(),
    analyticsEnabled: Type.Boolean(),
    showPoweredBy: Type.Boolean(),
    auditLogEnabled: Type.Boolean(),
    embeddingEnabled: Type.Boolean(),
    managePiecesEnabled: Type.Boolean(),
    manageTemplatesEnabled: Type.Boolean(),
    customAppearanceEnabled: Type.Boolean(),
    manageProjectsEnabled: Type.Boolean(),
    projectRolesEnabled: Type.Boolean(),
    customDomainsEnabled: Type.Boolean(),
    globalConnectionsEnabled: Type.Boolean(),
    customRolesEnabled: Type.Boolean(),
    apiKeysEnabled: Type.Boolean(),
    /**
     * @deprecated flow issues is open source
     */
    flowIssuesEnabled: Type.Boolean(),
    alertsEnabled: Type.Boolean(),
    defaultLocale: Type.Optional(Type.Enum(LocalesEnum)),
    ssoEnabled: Type.Boolean(),
    enforceAllowedAuthDomains: Type.Boolean(),
    allowedAuthDomains: Type.Array(Type.String()),
    federatedAuthProviders: FederatedAuthnProviderConfig,
    emailAuthEnabled: Type.Boolean(),
    licenseKey: Type.Optional(Type.String()),
    pinnedPieces: Type.Array(Type.String()),
})

export type Platform = Static<typeof Platform>


export const PlatformWithoutSensitiveData = Type.Composite([Type.Object({
    federatedAuthProviders: Nullable(FederatedAuthnProviderConfigWithoutSensitiveData),
    defaultLocale: Nullable(Type.String()),
    smtp: Nullable(Type.Object({})),
    hasLicenseKey: Type.Optional(Type.Boolean()),
    licenseExpiresAt: Type.Optional(Type.String()),
    isCopilotEnabled: Type.Optional(Type.Boolean()),
}), Type.Pick(Platform, [
    'id',
    'created',
    'updated',
    'ownerId',
    'name',
    'primaryColor',
    'logoIconUrl',
    'fullLogoUrl',
    'favIconUrl',
    'filteredPieceNames',
    'filteredPieceBehavior',
    'cloudAuthEnabled',
    'gitSyncEnabled',
    'analyticsEnabled',
    'showPoweredBy',
    'environmentsEnabled',
    'auditLogEnabled',
    'embeddingEnabled',
    'managePiecesEnabled',
    'manageTemplatesEnabled',
    'customAppearanceEnabled',
    'manageProjectsEnabled',
    'projectRolesEnabled',
    'customDomainsEnabled',
    'globalConnectionsEnabled',
    'customRolesEnabled',
    'apiKeysEnabled',
    'flowIssuesEnabled',
    'alertsEnabled',
    'ssoEnabled',
    'enforceAllowedAuthDomains',
    'allowedAuthDomains',
    'emailAuthEnabled',
    'pinnedPieces',
])])

export type PlatformWithoutSensitiveData = Static<typeof PlatformWithoutSensitiveData>
