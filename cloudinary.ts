// cloudinary.ts
export const CLOUDINARY_CONFIG = {
  cloudName: 'Root', // Replace with actual cloud name if needed, but 'Root' is placeholder
  uploadPreset: 'valentine_uploads',
};

export const uploadToCloudinary = async (
  file: File | Blob,
  folder: string
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'อัพโหลดรูปภาพล้มเหลว');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
  }
};

export const getCloudinaryUrl = (
  url: string,
  options?: { width?: number; height?: number; quality?: string }
): string => {
  // Transform Cloudinary URL for optimization
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const { width, height, quality = 'auto' } = options || {};
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  let transformation = `q_${quality}`;
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  if (width || height) transformation += ',c_fill';
  
  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
};
