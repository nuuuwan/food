import {
  buildAnalysisPreview,
  buildCompressionDetail,
  buildFinalStatus,
  sleep,
  stageToStatus,
} from "./processingState";

export const runScanWorkflow = async ({
  imageData,
  scanMeta,
  foodAPIClient,
  setCurrentScan,
  setProcessingSnapshot,
  setAnalysisPreview,
  setAnalysisState,
  setProcessingStatus,
  completeAnalysis,
}) => {
  const compression = buildCompressionDetail(scanMeta);
  setCurrentScan(imageData);
  setProcessingSnapshot({
    previewImage: imageData,
    originalBytes: scanMeta.originalBytes || null,
    compressedBytes: scanMeta.compressedBytes || null,
  });
  setAnalysisPreview(null);
  setAnalysisState("scanning");
  setProcessingStatus({ title: "Preparing image", detail: compression.detail });

  const statusMap = stageToStatus(compression.compressed);
  let statusQueue = Promise.resolve();
  const enqueueStatus = (status, delayMs = 800) => {
    statusQueue = statusQueue.then(async () => {
      await sleep(delayMs);
      setProcessingStatus(status);
    });
  };

  const { analysis, meta } = await foodAPIClient.analyzeFoodPhotoWithMeta(
    imageData,
    (stage) => statusMap[stage] && enqueueStatus(statusMap[stage]),
  );

  await statusQueue;
  const preview = buildAnalysisPreview(analysis);
  setAnalysisPreview(preview);
  setProcessingStatus({
    title: "Reviewing result",
    detail: `Detected: ${preview.productName}`,
  });
  await sleep(700);
  enqueueStatus(buildFinalStatus(meta));
  await statusQueue;
  completeAnalysis(analysis.toJSON());
};
