import { Vue, Component } from "vue-property-decorator";
import createAuth0Client, {
  Auth0Client,
  GetTokenWithPopupOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions
} from "@auth0/auth0-spa-js";
import { User } from "./User";

export type Auth0Options = {
  domain: string;
  clientId: string;
  audience?: string;
  [key: string]: string | undefined;
};

// eslint-disable-next-line
export type RedirectCallback = (appState: any) => void;

@Component({})
export class VueAuth extends Vue {
  loading = true;
  isAuthenticated? = false;
  user?: User;
  auth0Client?: Auth0Client;
  popupOpen = false;
  error?: Error | unknown;

  async getUser() {
    const auth0User = await this.auth0Client?.getUser();
    console.log("auth0User: ", auth0User);
    return new User(auth0User);
  }

  /** Authenticates the user using a popup window */
  async loginWithPopup(o: PopupLoginOptions) {
    this.popupOpen = true;
    try {
      await this.auth0Client?.loginWithPopup(o);
    } catch (e) {
      // eslint-disable-next-line
      this.error = e
      console.error(e);
    } finally {
      this.popupOpen = false;
    }
    this.user = await this.getUser();
    this.isAuthenticated = true;
  }
  /** Authenticates the user using the redirect method */
  loginWithRedirect(o: RedirectLoginOptions) {
    return this.auth0Client?.loginWithRedirect(o);
  }

  /** Returns all the claims present in the ID token */
  getIdTokenClaims(o: GetIdTokenClaimsOptions) {
    return this.auth0Client?.getIdTokenClaims(o);
  }

  /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
  getTokenSilently(o: GetTokenSilentlyOptions) {
    return this.auth0Client?.getTokenSilently(o);
  }

  /** Gets the access token using a popup window */
  getTokenWithPopup(o: GetTokenWithPopupOptions) {
    return this.auth0Client?.getTokenWithPopup(o);
  }

  /** Logs the user out and removes their session on the authorization server */
  logout(o: LogoutOptions) {
    return this.auth0Client?.logout(o);
  }

  /** Use this lifecycle method to instantiate the SDK client */
  async init(
    onRedirectCallback: RedirectCallback,
    redirectUri: string,
    o: Auth0Options
  ) {
    console.log("auth0 init!!  options:", o);
    // Create a new instance of the SDK client using members of the given options object
    this.auth0Client = await createAuth0Client({
      domain: o.domain,
      client_id: o.clientId, // eslint-disable-line @typescript-eslint/camelcase
      audience: o.audience,
      redirect_uri: redirectUri // eslint-disable-line @typescript-eslint/camelcase
    });
    console.log("auth0Client: ", this.auth0Client);
    try {
      console.log("window.location.search: ", window.location.search);
      // If the user is returning to the app after authentication..
      if (
        window.location.search.includes("error=") ||
        (window.location.search.includes("code=") &&
          window.location.search.includes("state="))
      ) {
        // handle the redirect and retrieve tokens
        const {
          appState
        } = (await this.auth0Client?.handleRedirectCallback()) ?? {
          appState: undefined
        };

        // Notify subscribers that the redirect callback has happened, passing the appState
        // (useful for retrieving any pre-authentication state)
        onRedirectCallback(appState);
      }
    } catch (e) {
      console.error(e);
      this.error = e;
    } finally {
      // Initialize our internal authentication state when the page is reloaded
      this.isAuthenticated = await this.auth0Client?.isAuthenticated();
      this.user = await this.getUser();
      this.loading = false;
    }
  }
}
