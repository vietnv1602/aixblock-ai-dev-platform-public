import { OAuth2AuthorizationMethod } from 'workflow-blocks-framework'
import {
    BaseOAuth2ConnectionValue,
    OAuth2GrantType,
} from 'workflow-shared'

export type OAuth2Service<CONNECTION_VALUE extends BaseOAuth2ConnectionValue> =
  {
      claim(request: ClaimOAuth2Request): Promise<CONNECTION_VALUE>
      refresh(
          request: RefreshOAuth2Request<CONNECTION_VALUE>
      ): Promise<CONNECTION_VALUE>
  }

export type RefreshOAuth2Request<T extends BaseOAuth2ConnectionValue> = {
    blockName: string
    projectId: string | undefined
    platformId: string
    connectionValue: T
}

export type OAuth2RequestBody = {
    props?: Record<string, string>
    code: string
    clientId: string
    tokenUrl: string
    clientSecret?: string
    redirectUrl?: string
    grantType?: OAuth2GrantType
    authorizationMethod?: OAuth2AuthorizationMethod
    codeVerifier?: string
}

export type ClaimOAuth2Request = {
    projectId: string | undefined
    platformId: string
    blockName: string
    request: OAuth2RequestBody
}
