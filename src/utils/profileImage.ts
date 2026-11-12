const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const AVATAR_SIZE = 512;

const readImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Impossible de lire cette image.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Le fichier sélectionné ne peut pas être affiché.'));
      image.onload = () => resolve(image);
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

export const prepareProfileImage = async (file: File): Promise<string> => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choisissez une image JPG, PNG ou WEBP.');
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error('La taille de l’image ne doit pas dépasser 5 Mo.');
  }

  const image = await readImage(file);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Impossible de préparer cette image sur cet appareil.');

  const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - cropSize) / 2;
  const sourceY = (image.naturalHeight - cropSize) / 2;
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE
  );

  return canvas.toDataURL('image/jpeg', 0.82);
};
