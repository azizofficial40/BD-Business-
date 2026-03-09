export const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    console.log("Starting compression for:", file.name);
    
    // Add a timeout for compression
    const timeout = setTimeout(() => {
      reject(new Error("Compression timed out"));
    }, 30000);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      console.log("FileReader loaded");
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        console.log("Image loaded");
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600; // Reduced max width for faster upload
        const scaleSize = MAX_WIDTH / img.width;

        if (img.width <= MAX_WIDTH) {
          canvas.width = img.width;
          canvas.height = img.height;
        } else {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        }

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          clearTimeout(timeout);
          if (blob) {
            console.log("Blob created");
            resolve(blob);
          } else {
            console.error("Canvas to Blob conversion failed");
            reject(new Error("Canvas to Blob conversion failed"));
          }
        }, "image/jpeg", 0.6); // Reduced quality for faster upload
      };
      img.onerror = (error) => {
        clearTimeout(timeout);
        console.error("Image load error", error);
        reject(error);
      };
    };
    reader.onerror = (error) => {
      clearTimeout(timeout);
      console.error("FileReader error", error);
      reject(error);
    };
  });
};
