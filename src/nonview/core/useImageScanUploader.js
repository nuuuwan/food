import { useCallback, useState } from "react";
import {
  compressImageDataUrl,
  estimateDataUrlBytes,
  readFileAsDataUrl,
} from "./imageProcessing";

export const useImageScanUploader = ({ startScan, navigateToProcessing }) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file, { awaitScan = false } = {}) => {
      if (!file) {
        return;
      }

      try {
        setIsUploading(true);
        const imageDataUrl = await readFileAsDataUrl(file);
        const compressedImageDataUrl = await compressImageDataUrl(imageDataUrl);
        const compressedBytes = estimateDataUrlBytes(compressedImageDataUrl);

        if (navigateToProcessing) {
          navigateToProcessing();
        }

        const scanPromise = startScan(compressedImageDataUrl, {
          originalBytes: file.size,
          compressedBytes,
        });

        if (awaitScan) {
          await scanPromise;
        }

        return compressedImageDataUrl;
      } finally {
        setIsUploading(false);
      }
    },
    [navigateToProcessing, startScan],
  );

  return { isUploading, uploadFile };
};
