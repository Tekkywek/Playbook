export type WebcamCaptureModalProps = {
  visible: boolean;
  onClose: () => void;
  /** Local URI (e.g. blob URL on web) suitable for uploadProfileImage / ImagePicker output */
  onCapture: (localUri: string) => void;
};
