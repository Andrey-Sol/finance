import { AuthUtils } from "../utils/auth-utils.js";
import { HttpUtils } from "../utils/http-utils.js";

export class Logout {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            location.href = '#/';
            return;
        }
        this.logout().then();
    }

    async logout() {
        await HttpUtils.request('/logout', 'POST', {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        })

        AuthUtils.removeAuthInfo();
        location.href = '#/login';
    }
}
