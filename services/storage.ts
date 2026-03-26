import { Platform } from 'react-native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from '@/lib/firebase';
import * as ImageManipulator from 'expo-image-manipulator';

export async function uploadProfileImage(localUri: string, uid: string): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase not configured');
  let blob: Blob;
  // Web: skip ImageManipulator — it can stall on blob/data URIs from webcam; upload as JPEG if possible.
  if (Platform.OS === 'web') {
    const response = await fetch(localUri);
    blob = await response.blob();
  } else {
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        localUri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const response = await fetch(manipulated.uri);
      blob = await response.blob();
    } catch {
      const response = await fetch(localUri);
      blob = await response.blob();
    }
  }
  const r = ref(storage, `profiles/${uid}/avatar.jpg`);
  await uploadBytes(r, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(r);
}

export async function uploadHighlightVideo(localUri: string, uid: string, id: string): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase not configured');
  const response = await fetch(localUri);
  const blob = await response.blob();
  const r = ref(storage, `highlights/${uid}/${id}.mp4`);
  await uploadBytes(r, blob, { contentType: 'video/mp4' });
  return getDownloadURL(r);
}
