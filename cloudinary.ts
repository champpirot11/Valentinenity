// cloudinary.ts
export const CLOUDINARY_CONFIG = {
  cloudName: 'Root', // ตรวจสอบว่าตัวพิมพ์ใหญ่-เล็กตรงกับ Dashboard
  uploadPreset: 'valentine_uploads',
};

export const uploadToCloudinary = async (
  file: File,
  folder: string
): Promise<string> => {
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('ขนาดไฟล์ต้องไม่เกิน 5MB');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('รองรับเฉพาะไฟล์ JPG, PNG, GIF เท่านั้น');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);

  try {
    console.log('Uploading to Cloudinary...', {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      preset: CLOUDINARY_CONFIG.uploadPreset,
      folder,
      fileSize: file.size,
      fileType: file.type,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error response:', errorData);
      throw new Error(errorData.error?.message || 'อัพโหลดรูปภาพล้มเหลว');
    }

    const data = await response.json();
    console.log('Upload success:', data.secure_url);
    return data.secure_url;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.message || 'ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
  }
};

export const getCloudinaryUrl = (
  url: string,
  options?: { width?: number; height?: number; quality?: string }
): string => {
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
