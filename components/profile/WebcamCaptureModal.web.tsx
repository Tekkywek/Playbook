import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { WebcamCaptureModalProps } from '@/components/profile/WebcamCaptureModal.types';

const purple = '#6347D1';

/** Web build: platform file overrides `WebcamCaptureModal.tsx` — must export the same name. */
export function WebcamCaptureModal({ visible, onClose, onCapture }: WebcamCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setErr(null);
    let cancelled = false;
    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const v = videoRef.current;
        if (v) {
          v.srcObject = stream;
          await v.play().catch(() => {});
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [visible]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const uri = URL.createObjectURL(blob);
        onCapture(uri);
        onClose();
      },
      'image/jpeg',
      0.92
    );
  }, [onCapture, onClose]);

  const cancel = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    onClose();
  }, [onClose]);

  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(15, 23, 42, 0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 24,
          maxWidth: 520,
          width: '100%',
          boxShadow: '0 24px 80px rgba(99, 71, 209, 0.25)',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#0f172a', fontFamily: 'system-ui' }}>
          Take a photo
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#64748b', fontFamily: 'system-ui' }}>
          Allow camera access when your browser asks. Position your face in the frame, then capture.
        </p>
        {err ? (
          <p style={{ color: '#dc2626', fontSize: 14, marginBottom: 12, fontFamily: 'system-ui' }}>{err}</p>
        ) : null}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            borderRadius: 14,
            background: '#0f172a',
            minHeight: 220,
            objectFit: 'cover',
          }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={cancel}
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 15,
              color: '#475569',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={capture}
            disabled={!!err}
            style={{
              padding: '12px 22px',
              borderRadius: 12,
              border: 'none',
              background: purple,
              color: '#fff',
              cursor: err ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: 15,
              opacity: err ? 0.5 : 1,
            }}
          >
            Capture
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
