import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ARCHITECTURE_STEPS, type ArchitectureStep } from '../content/steps';

interface ComponentCycleContextType {
  activeLayer: number;
  hoveredLayer: number | null;
  effectiveLayer: number; // hoveredLayer if set, else activeLayer
  activeStep: ArchitectureStep;
  isHoverOverride: boolean;
  isModelExploded: boolean;
  setActiveLayer: (id: number) => void;
  setHoveredLayer: (id: number | null) => void;
  setIsModelExploded: (exploded: boolean) => void;
  isAutoCycling: boolean;
  setIsAutoCycling: (cycling: boolean) => void;
}

const ComponentCycleContext = createContext<ComponentCycleContextType | undefined>(undefined);

export const ComponentCycleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLayer, setActiveLayer] = useState<number>(4); // Default to layer 4 (intelligence hero layer)
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const [isModelExploded, setIsModelExploded] = useState<boolean>(false);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);
  
  const timerRef = useRef<number | null>(null);

  // Auto-cycle layers 1 -> 8 every 2.5 seconds when not hovering
  useEffect(() => {
    if (!isAutoCycling || hoveredLayer !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setActiveLayer((prev) => (prev % 8) + 1);
    }, 2800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoCycling, hoveredLayer]);

  const effectiveLayer = hoveredLayer !== null ? hoveredLayer : activeLayer;
  const activeStep = ARCHITECTURE_STEPS.find((s) => s.plateId === effectiveLayer) || ARCHITECTURE_STEPS[3];

  return (
    <ComponentCycleContext.Provider
      value={{
        activeLayer,
        hoveredLayer,
        effectiveLayer,
        activeStep,
        isHoverOverride: hoveredLayer !== null,
        isModelExploded,
        setActiveLayer,
        setHoveredLayer,
        setIsModelExploded,
        isAutoCycling,
        setIsAutoCycling,
      }}
    >
      {children}
    </ComponentCycleContext.Provider>
  );
};

export const useComponentCycle = (): ComponentCycleContextType => {
  const context = useContext(ComponentCycleContext);
  if (!context) {
    throw new Error('useComponentCycle must be used within a ComponentCycleProvider');
  }
  return context;
};
