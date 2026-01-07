"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../app/utils/api";

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const handleToken = async () => {
      if (token) {
        try {
          // Save to localStorage first
          localStorage.setItem("token", token);
          
          // Set cookie via server-side API
          const cookieResponse = await fetch('/api/auth/set-cookie', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
          
          if (cookieResponse.ok) {
            console.log('✅ OAuth token saved successfully');
          }
          
          // Call backend save-token endpoint
          await api.post(
            "/api/v1/auth/save-token",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          router.replace("/");
        } catch (error) {
          console.error('❌ OAuth token save failed:', error);
          router.push("/login?error=failed");
        }
      }
    };
    
    handleToken();
  }, [token, router]);

  return null;
}
