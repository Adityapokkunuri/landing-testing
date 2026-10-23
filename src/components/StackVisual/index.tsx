import React, { useState } from 'react';
import { ThreeViewer, type ThreeViewerProps } from './ThreeViewer';
import { Annotations } from './Annotations';

export interface StackVisualProps extends ThreeViewerProps {
  showAnnotations?: boolean;
  framed?: boolean;
}

export const StackVisual: React.FC<StackVisualProps> = ({
  mode,
  activeLayer = 4,
  progress = 0,
  hoverExplode = false,
  onHoverChange,
  swapVersion = 'A',
  onLayerSelect,
  onLayerHover,
  showAnnotations = false,
  className = '',
  enableOrbit = true,
  autoRotate = false,
  transparent = true,
  framed = false,
}) => {
  const [internalActiveLayer, setInternalActiveLayer] = useState<number | null>(activeLayer ?? null);

  const currentLayer = activeLayer !== undefined ? activeLayer : internalActiveLayer;

  const handleSelect = (id: number) => {
    setInternalActiveLayer(id);
    if (onLayerSelect) {
      onLayerSelect(id);
    }
  };

  const containerClasses = framed
    ? `relative w-full h-full overflow-hidden rounded-2xl bg-card border border-border shadow-card ${className}`
    : `relative w-full h-full overflow-hidden ${className}`;

  return (
    <div className={containerClasses}>
      {/* 3D WebGL Canvas */}
      <ThreeViewer
        mode={mode}
        activeLayer={currentLayer}
        progress={progress}
        hoverExplode={hoverExplode}
        onHoverChange={onHoverChange}
        swapVersion={swapVersion}
        onLayerSelect={handleSelect}
        onLayerHover={onLayerHover}
        enableOrbit={enableOrbit}
        autoRotate={autoRotate}
        transparent={transparent}
        className="w-full h-full"
      />

      {/* Optional Overlay Annotations */}
      {showAnnotations && (
        <Annotations
          activeLayer={currentLayer || 4}
          onSelectLayer={handleSelect}
          visible={true}
        />
      )}
    </div>
  );
};

export { ThreeViewer } from './ThreeViewer';
export { Annotations } from './Annotations';
