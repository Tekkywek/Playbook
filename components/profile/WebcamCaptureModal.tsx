import type { WebcamCaptureModalProps } from '@/components/profile/WebcamCaptureModal.types';

/**
 * Native: webcam UI is web-only. Metro uses this file on iOS/Android (no `.web` override).
 * Web: Next/Webpack resolves `WebcamCaptureModal.web.tsx` instead — same export name.
 */
export function WebcamCaptureModal(_props: WebcamCaptureModalProps) {
  return null;
}
