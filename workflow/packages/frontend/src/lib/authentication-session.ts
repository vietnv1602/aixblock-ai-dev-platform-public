import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';

import { AuthenticationResponse, isNil, Principal } from 'workflow-shared';

import { authenticationApi } from './authentication-api';
import { getStorageKeyPrefix } from './utils';

export const authenticationSession = {
  getTokenKey() {
    return `${getStorageKeyPrefix()}_token`;
  },
  saveResponse(response: AuthenticationResponse) {
    localStorage.setItem(this.getTokenKey(), response.token);
    window.dispatchEvent(new Event('storage'));
  },
  isJwtExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.exp && dayjs().isAfter(dayjs.unix(decoded.exp))) {
        return true;
      }
      return false;
    } catch (e) {
      return true;
    }
  },
  getToken(): string | null {
    return localStorage.getItem(this.getTokenKey()) ?? null;
  },

  getProjectId(): string | null {
    const token = this.getToken();
    if (isNil(token)) {
      return null;
    }
    const decodedJwt = getDecodedJwt(token);
    return decodedJwt.projectId;
  },
  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (isNil(token)) {
      return null;
    }
    const decodedJwt = getDecodedJwt(token);
    return decodedJwt.id;
  },
  appendProjectRoutePrefix(path: string): string {
    const projectId = this.getProjectId();
    if (isNil(projectId)) {
      return path;
    }
    return `/projects/${projectId}${path.startsWith('/') ? path : `/${path}`}`;
  },
  getPlatformId(): string | null {
    const token = this.getToken();
    if (isNil(token)) {
      return null;
    }
    const decodedJwt = getDecodedJwt(token);
    return decodedJwt.platform.id;
  },
  async switchToPlatform(platformId: string) {
    if (authenticationSession.getPlatformId() === platformId) {
      return;
    }
    const result = await authenticationApi.switchPlatform({
      platformId,
    });
    localStorage.setItem(this.getTokenKey(), result.token);
    window.location.href = '/';
  },
  async switchToSession(projectId: string) {
    if (authenticationSession.getProjectId() === projectId) {
      return;
    }
    const result = await authenticationApi.switchProject({ projectId });
    localStorage.setItem(this.getTokenKey(), result.token);
    window.dispatchEvent(new Event('storage'));
  },
  isLoggedIn(): boolean {
    return !!this.getToken();
  },
  clearSession() {
    localStorage.removeItem(this.getTokenKey());
  },
  logOut() {
    this.clearSession();
    window.location.href = '/sign-in';
  },
};

function getDecodedJwt(token: string): Principal {
  return jwtDecode<Principal>(token);
}
