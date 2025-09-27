import { Suspense } from "react";
import OAuthSuccess from "../components/OAuthSuccess"; // atau sesuai path kamu

export default function OauthSuccess() {
  return (
    <Suspense>
      <OAuthSuccess />
    </Suspense>
  );
}
