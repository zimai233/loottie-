import React, { useState, useCallback, useRef, useEffect } from 'react';
import { parseLottieFile, removeLayer, downloadLottie } from './utils/lottieUtils';
import Editor from './components/Editor';
import Preview from './components/Preview';
import LayerList from './components/LayerList';
import './App.css';

function App() {
  const [lottieData, setLottieData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // 确保文件输入元素存在
    if (!fileInputRef.current) {
      fileInputRef.current = document.createElement('input');
      fileInputRef.current.type = 'file';
      fileInputRef.current.accept = '.json';
      fileInputRef.current.style.display = 'none';
      fileInputRef.current.onchange = handleFileInputChange;
      document.body.appendChild(fileInputRef.current);
    }
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      const data = await parseLottieFile(file);
      setLottieData(data);
      setInitialData(data);
      setIsPlaying(true);
    } catch (error) {
      console.error('文件解析失败:', error);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileUpload(file);
    }
  }, []);

  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files[0]);
  };

  const handleSidebarUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePreviewClick = () => {
    if (!lottieData && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleLayerRemove = (index) => {
    const newData = removeLayer(lottieData, index);
    setLottieData(newData);
    setSelectedLayer(null);
    // 强制重新计算文件大小
    getFileInfo();
  };

  const handleLayerSelect = (index) => {
    setSelectedLayer(index);
  };

  const handleReset = () => {
    if (initialData) {
      setLottieData(initialData);
      setSelectedLayer(null);
      setIsPlaying(true);
    }
  };

  const getFileInfo = () => {
    if (!lottieData) return null;

    const { parsedData, fileName } = lottieData;
    const totalFrames = parsedData.op - parsedData.ip;
    const duration = (totalFrames / parsedData.fr).toFixed(2);
    const width = parsedData.w;
    const height = parsedData.h;
    const fileSize = (new Blob([JSON.stringify(parsedData)]).size / 1024).toFixed(2);

    return {
      name: fileName || parsedData.nm || '未命名',
      version: parsedData.v || '未知',
      frameRate: parsedData.fr,
      totalFrames,
      duration,
      dimensions: `${width}x${height}`,
      fileSize: `${fileSize} KB`,
      layerCount: parsedData.layers.length,
      assetsCount: parsedData.assets?.length || 0,
      markersCount: parsedData.markers?.length || 0
    };
  };

  const fileInfo = React.useMemo(() => getFileInfo(), [lottieData]);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>图层列表</h2>
          <button 
            className="sidebar-upload-button"
            onClick={handleSidebarUpload}
          >
            上传文件
          </button>
        </div>
        {lottieData && (
          <LayerList 
            layers={lottieData.parsedData.layers}
            selectedLayer={selectedLayer}
            onRemoveLayer={handleLayerRemove}
            onSelectLayer={handleLayerSelect}
          />
        )}
      </div>

      <div className="main-content">
        <div 
          className={`preview-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handlePreviewClick}
        >
          {lottieData ? (
            <Preview 
              lottieData={lottieData.parsedData}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
            />
          ) : (
            <div className="upload-area">
              <label htmlFor="file-upload">
                <div className="upload-icon"></div>
                <div>点击或拖动以上传 Lottie JSON 文件</div>
              </label>
            </div>
          )}
        </div>

        <div className="control-bar">
          <button 
            className="play-button"
            onClick={handleTogglePlay}
          >
            {isPlaying ? (
              <div className="pause-icon"></div>
            ) : (
              <div className="play-icon"></div>
            )}
          </button>
          <button className="reset-button" onClick={handleReset}>重置</button>
          <button
            className="download-button"
            onClick={() => {
              if (!lottieData) return;
              // 使用lottieUtils中的downloadLottie函数确保一致性
              const dataStr = downloadLottie(lottieData);
              const blob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${lottieData.fileName || 'animation'}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            下载 ({fileInfo?.fileSize || '0 KB'})
          </button>
          {lottieData && <Editor lottieData={lottieData} />}
        </div>

        {fileInfo && (
          <div className="file-info">
            <h3>文件信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">动画名称</span>
                <span className="info-value">{fileInfo.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">版本</span>
                <span className="info-value">{fileInfo.version}</span>
              </div>
              <div className="info-item">
                <span className="info-label">帧率</span>
                <span className="info-value">{fileInfo.frameRate} fps</span>
              </div>
              <div className="info-item">
                <span className="info-label">总帧数</span>
                <span className="info-value">{fileInfo.totalFrames}</span>
              </div>
              <div className="info-item">
                <span className="info-label">时长</span>
                <span className="info-value">{fileInfo.duration} 秒</span>
              </div>
              <div className="info-item">
                <span className="info-label">分辨率</span>
                <span className="info-value">{fileInfo.dimensions}</span>
              </div>
              <div className="info-item">
                <span className="info-label">文件大小</span>
                <span className="info-value">{fileInfo.fileSize}</span>
              </div>
              <div className="info-item">
                <span className="info-label">图层数量</span>
                <span className="info-value">{fileInfo.layerCount}</span>
              </div>
              <div className="info-item">
                <span className="info-label">资源数量</span>
                <span className="info-value">{fileInfo.assetsCount}</span>
              </div>
              <div className="info-item">
                <span className="info-label">标记数量</span>
                <span className="info-value">{fileInfo.markersCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
