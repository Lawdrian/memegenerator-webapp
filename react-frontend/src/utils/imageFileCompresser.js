import imageCompression from 'browser-image-compression';

export async function compressImageFile(imageFile, fileSizeLimit) {
  const options = {
    maxSizeMB: fileSizeLimit || 1, // (max file size in MB)
    maxWidthOrHeight: 1920, // this will also reduce the image dimensions
    useWebWorker: true
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.log(error);
  }
}