interface Window {
    FB: {
      init(options: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }): void;
      login(
        callback: (response: { authResponse: { accessToken: string } | null }) => void,
        options?: { scope: string }
      ): void;
      api(
        path: string,
        callback: (response: any) => void
      ): void;
      getLoginStatus(
        callback: (response: { status: string }) => void
      ): void;
      AppEvents: {
        logPageView(): void;
      };
    };
    fbAsyncInit?: () => void;
  }