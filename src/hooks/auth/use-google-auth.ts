import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';

export const useGoogleAuth = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Lấy Google Auth URL để redirect
  const getGoogleAuthUrl = useMutation({
    mutationFn: async () => {
      setIsRedirecting(true);
      try {
        // Lấy URL từ backend với redirect_uri đã được thêm vào
        const url = await authService.getGoogleAuthUrl();
        
        if (!url) {
          throw new Error("Không nhận được URL chuyển hướng Google");
        }
        
        window.location.href = url;
        return url;
      } catch (error) {
        setIsRedirecting(false);
        throw error;
      }
    },
    onError: (error) => {
      setIsRedirecting(false);
    }
  });

  const handleGoogleLogin = async () => {
    // ... existing code ...
  };

  return {
    getGoogleAuthUrl,
    isRedirecting
  };
}; 