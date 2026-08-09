export type FacebookAuthResponse = {
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
};

export type FacebookLoginResponse = {
  authResponse?: FacebookAuthResponse;
  status?: string;
};

export type FacebookProfile = {
  id?: string;
  name?: string;
  email?: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
  error?: {
    message?: string;
  };
};

export type FacebookSdk = {
  init(options: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }): void;
  login(
    callback: (response: FacebookLoginResponse) => void,
    options: { scope: string },
  ): void;
  api(
    path: string,
    params: { fields: string },
    callback: (response: FacebookProfile) => void,
  ): void;
};

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

let facebookSdkPromise: Promise<FacebookSdk> | null = null;

export function loadFacebookSdk(appId: string): Promise<FacebookSdk> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Facebook SDK ใช้งานได้เฉพาะในเบราว์เซอร์"));
  }

  if (window.FB) return Promise.resolve(window.FB);
  if (facebookSdkPromise) return facebookSdkPromise;

  facebookSdkPromise = new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      if (!window.FB) {
        reject(new Error("ไม่สามารถโหลด Facebook SDK ได้"));
        return;
      }

      window.FB.init({
        appId,
        cookie: true,
        xfbml: false,
        version: "v23.0",
      });
      resolve(window.FB);
    };

    const existingScript = document.getElementById("facebook-jssdk");
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/th_TH/sdk.js";
    script.onerror = () => {
      facebookSdkPromise = null;
      reject(new Error("ไม่สามารถโหลด Facebook SDK ได้"));
    };
    document.head.appendChild(script);
  });

  return facebookSdkPromise;
}
