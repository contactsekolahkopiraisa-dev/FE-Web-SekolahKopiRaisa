"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../utils/api";

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      api
        .post(
          "/api/v1/auth/save-token",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          router.replace("/");
        })
        .catch(() => {
          router.push("/login?error=failed");
        });
    }
  }, [token, router]);

  return null;
}
