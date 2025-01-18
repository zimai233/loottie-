export function parseLottieFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // 返回原始文件内容和文件名，并保留原始大小
        resolve({
          rawData: e.target.result,
          parsedData: JSON.parse(e.target.result),
          fileName: file.name.replace('.json', ''),
          originalSize: file.size
        });
      } catch (error) {
        reject(new Error('文件解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

export function removeLayer(lottieData, index) {
  const newData = { ...lottieData.parsedData };
  newData.layers = lottieData.parsedData.layers.filter((_, i) => i !== index);
  
  // 递归检查资源引用
  const usedAssets = new Set();
  
  function checkAssetUsage(layers) {
    layers.forEach(layer => {
      if (layer.refId) {
        usedAssets.add(layer.refId);
      }
      if (layer.layers) {
        checkAssetUsage(layer.layers);
      }
    });
  }
  
  checkAssetUsage(newData.layers);
  newData.assets = newData.assets.filter(asset => usedAssets.has(asset.id));

  // 简单删除图层，不进行任何优化
  return {
    ...lottieData,
    rawData: null, // 清除原始数据
    parsedData: newData
  };
}

export function downloadLottie(lottieData) {
  // 如果未修改，直接返回原始数据
  if (lottieData.rawData) {
    return lottieData.rawData;
  }
  // 否则返回最小化JSON字符串
  return JSON.stringify(lottieData.parsedData, null, 0);
}