import { Suspense } from "react";
import OAuthSuccess from "../../components/oauth-success/OAuthSuccess"; // atau sesuai path kamu

export default function OauthSuccess() {
  return (
    <Suspense>
      <OAuthSuccess />
    </Suspense>
  );
}
