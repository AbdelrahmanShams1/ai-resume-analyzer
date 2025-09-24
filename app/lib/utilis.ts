import clsx, { type ClassValue } from "clsx";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs : ClassValue[])=> twMerge(clsx(inputs))


export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUIDRandom = () =>{
  return crypto.randomUUID()
}

export function useAuthRedirect(
  conditions: boolean[],    
  redirectTo: string,
  dependencies: any[] = []
) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isValid = conditions.every(Boolean);
    if (isValid) {
      navigate(redirectTo, { replace: true });
    }
  }, [...dependencies]);
}
