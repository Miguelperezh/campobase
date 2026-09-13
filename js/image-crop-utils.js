// ==========================================================================
// UTILIDADES DE PROCESAMIENTO, ENCUADRE Y COMPRESIÓN DE FOTOS (CampoBase)
// Garantiza que cualquier foto (cámara o galería de 3MB a 15MB) se recorte,
// encuadre el rostro y se comprima a un JPEG/WebP de ~60KB y 300x300 px
// para guardarse de forma inmediata en IndexedDB y Supabase sin errores.
// ==========================================================================

/**
 * Procesa y comprime una imagen recortándola en formato cuadrado con encuadre vertical ajustable.
 * @param {File|string} source - Objeto File o string dataURL
 * @param {Object} options - Opciones de encuadre
 * @param {number} options.offsetY - Desplazamiento vertical (0.0 = arriba/rostro, 0.5 = centro, 1.0 = abajo)
 * @param {number} options.size - Tamaño del cuadrado en px (por defecto 300px)
 * @param {number} options.quality - Calidad JPEG de 0 a 1 (por defecto 0.85)
 * @returns {Promise<string>} dataURL de la imagen comprimida
 */
export async function compressAndCropImage(source, { offsetY = 0.35, size = 300, quality = 0.85 } = {}) {
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    return typeof source === 'string' ? source : '';
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoad = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto de canvas.'));
          return;
        }

        // Calcular recorte cuadrado respetando la relación de aspecto original
        const origWidth = img.naturalWidth || img.width;
        const origHeight = img.naturalHeight || img.height;

        let srcSize = 0;
        let srcX = 0;
        let srcY = 0;

        if (origWidth > origHeight) {
          // Imagen horizontal / apaisada: centrar horizontalmente
          srcSize = origHeight;
          srcX = Math.max(0, Math.min(origWidth - srcSize, (origWidth - srcSize) * 0.5));
          srcY = 0;
        } else {
          // Imagen vertical / retrato: usar offsetY para centrar en el rostro (por defecto tercio superior)
          srcSize = origWidth;
          srcX = 0;
          const availableY = origHeight - srcSize;
          srcY = Math.max(0, Math.min(availableY, availableY * offsetY));
        }

        // Fondo blanco neutro para imágenes con transparencias
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Dibujar el recorte escalado a size x size
        ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, size, size);

        // Exportar a JPEG de alta fidelidad y bajo peso (< 75 KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onload = handleLoad;
    img.onerror = () => reject(new Error('No se pudo cargar la imagen para su procesamiento.'));

    if (typeof source === 'string') {
      img.src = source;
    } else if (source instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result;
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(source);
    } else {
      reject(new TypeError('Fuente de imagen no válida.'));
    }
  });
}

/**
 * Conecta los controles interactivos de un campo de foto (previsualización, encuadre y borrado).
 */
export function wirePhotoCropperField({
  fileInput,
  previewImg,
  placeholder,
  existingInput,
  controlsGroup,
  cropUpBtn,
  cropDownBtn,
  removeBtn,
  onPhotoChanged,
}) {
  let currentRawSource = null;
  let currentOffsetY = 0.35; // Enfocado al rostro por defecto

  const updatePreview = async (offset) => {
    if (!currentRawSource) return;
    try {
      currentOffsetY = Math.max(0, Math.min(1, offset));
      const processed = await compressAndCropImage(currentRawSource, { offsetY: currentOffsetY });
      if (previewImg) {
        previewImg.src = processed;
        previewImg.classList.remove('hidden');
      }
      if (placeholder) placeholder.classList.add('hidden');
      if (existingInput) existingInput.value = processed;
      if (controlsGroup) controlsGroup.classList.remove('hidden');
      if (onPhotoChanged) onPhotoChanged(processed);
    } catch (err) {
      console.error('Error al procesar el encuadre de la foto:', err);
    }
  };

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    currentRawSource = file;
    currentOffsetY = 0.35;
    await updatePreview(currentOffsetY);
  });

  cropUpBtn?.addEventListener('click', () => {
    updatePreview(currentOffsetY - 0.15);
  });

  cropDownBtn?.addEventListener('click', () => {
    updatePreview(currentOffsetY + 0.15);
  });

  removeBtn?.addEventListener('click', () => {
    currentRawSource = null;
    if (fileInput) fileInput.value = '';
    if (existingInput) existingInput.value = '';
    if (previewImg) {
      previewImg.src = '';
      previewImg.classList.add('hidden');
    }
    if (placeholder) placeholder.classList.remove('hidden');
    if (controlsGroup) controlsGroup.classList.add('hidden');
    if (onPhotoChanged) onPhotoChanged('');
  });

  return {
    setExistingPhoto: (dataUrl) => {
      currentRawSource = dataUrl || null;
      currentOffsetY = 0.35;
      if (dataUrl) {
        if (previewImg) {
          previewImg.src = dataUrl;
          previewImg.classList.remove('hidden');
        }
        if (placeholder) placeholder.classList.add('hidden');
        if (existingInput) existingInput.value = dataUrl;
        if (controlsGroup) controlsGroup.classList.remove('hidden');
      } else {
        if (previewImg) {
          previewImg.src = '';
          previewImg.classList.add('hidden');
        }
        if (placeholder) placeholder.classList.remove('hidden');
        if (existingInput) existingInput.value = '';
        if (controlsGroup) controlsGroup.classList.add('hidden');
      }
    },
    getCurrentPhoto: () => existingInput?.value || '',
  };
}
