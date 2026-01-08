import { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { patterns, presets } from './patterns';

function App() {
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const configRef = useRef(null);
  
  const [config, setConfig] = useState({
    pattern: 'grid',
    cols: 8,
    rows: 8,
    cellSize: 80,
    gap: 10,
    thickness: 40,
    density: 200,
    sizeMin: 20,
    sizeMax: 60,
    direction: 'vertical',
    shapeType: 'rect',
    rotation: 0,
    colors: {
      bg: '#FFFFFF',
      palette: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B']
    }
  });

  // Keep config in ref for p5 to access
  configRef.current = config;

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(800, 800);
        p.pixelDensity(2);
      };

      p.draw = () => {
        const currentConfig = configRef.current;
        if (currentConfig.pattern && patterns[currentConfig.pattern]) {
          patterns[currentConfig.pattern](p, currentConfig);
        }
        p.noLoop();
      };
    };

    if (canvasRef.current && !p5InstanceRef.current) {
      p5InstanceRef.current = new p5(sketch, canvasRef.current);
    }

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  // Trigger redraw when config changes
  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.redraw();
    }
  }, [config]);

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateColors = (type, value, index = null) => {
    setConfig(prev => {
      const newColors = { ...prev.colors };
      if (type === 'bg') {
        newColors.bg = value;
      } else if (index !== null) {
        newColors.palette[index] = value;
      }
      return { ...prev, colors: newColors };
    });
  };

  const addColor = () => {
    setConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        palette: [...prev.colors.palette, '#000000']
      }
    }));
  };

  const removeColor = (index) => {
    if (config.colors.palette.length > 2) {
      setConfig(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          palette: prev.colors.palette.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const applyPreset = (presetName) => {
    setConfig(prev => ({ ...prev, ...presets[presetName] }));
  };

  const regenerate = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.redraw();
    }
  };

  const downloadPattern = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.save('pattern.png');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Brand Pattern Generator</h1>
            <p>Create custom geometric patterns for your brand</p>
          </div>
          <div className="header-buttons">
            <button onClick={regenerate} className="btn-secondary">
              🔄 Regenerate
            </button>
            <button onClick={downloadPattern} className="btn-primary">
              ⬇️ Download PNG
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="grid-container">
          {/* Canvas */}
          <div className="canvas-section">
            <div className="canvas-container" ref={canvasRef}></div>
            <p className="canvas-info">800×800px • 2x pixel density</p>
          </div>

          {/* Controls */}
          <div className="controls-panel">
            {/* Presets */}
            <div className="control-section">
              <h3>Quick Presets</h3>
              <div className="preset-grid">
                {Object.keys(presets).map(name => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name)}
                    className="preset-btn"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Type */}
            <div className="control-section">
              <h3>Pattern Type</h3>
              <select
                value={config.pattern}
                onChange={(e) => updateConfig('pattern', e.target.value)}
              >
                <option value="grid">Grid</option>
                <option value="bars">Bars</option>
                <option value="checker">Checker</option>
                <option value="scattered">Scattered</option>
              </select>
            </div>

            {/* Pattern Controls */}
            <div className="control-section">
              <h3>Controls</h3>
              
              {config.pattern === 'grid' && (
                <>
                  <div className="control-group">
                    <label>Columns: {config.cols}</label>
                    <input type="range" min="3" max="20" value={config.cols} onChange={(e) => updateConfig('cols', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Rows: {config.rows}</label>
                    <input type="range" min="3" max="20" value={config.rows} onChange={(e) => updateConfig('rows', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Size: {config.cellSize}px</label>
                    <input type="range" min="20" max="150" value={config.cellSize} onChange={(e) => updateConfig('cellSize', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Gap: {config.gap}px</label>
                    <input type="range" min="0" max="30" value={config.gap} onChange={(e) => updateConfig('gap', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Rotation: {config.rotation}°</label>
                    <input type="range" min="0" max="90" value={config.rotation} onChange={(e) => updateConfig('rotation', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Shape</label>
                    <select value={config.shapeType} onChange={(e) => updateConfig('shapeType', e.target.value)}>
                      <option value="rect">Rectangle</option>
                      <option value="circle">Circle</option>
                      <option value="triangle">Triangle</option>
                      <option value="wave">Wave</option>
                    </select>
                  </div>
                </>
              )}

              {config.pattern === 'bars' && (
                <>
                  <div className="control-group">
                    <label>Count: {config.direction === 'horizontal' ? config.rows : config.cols}</label>
                    <input type="range" min="5" max="30" value={config.direction === 'horizontal' ? config.rows : config.cols} onChange={(e) => updateConfig(config.direction === 'horizontal' ? 'rows' : 'cols', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Thickness: {config.thickness}px</label>
                    <input type="range" min="10" max="80" value={config.thickness} onChange={(e) => updateConfig('thickness', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Gap: {config.gap}px</label>
                    <input type="range" min="0" max="30" value={config.gap} onChange={(e) => updateConfig('gap', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Direction</label>
                    <select value={config.direction} onChange={(e) => updateConfig('direction', e.target.value)}>
                      <option value="vertical">Vertical</option>
                      <option value="horizontal">Horizontal</option>
                    </select>
                  </div>
                </>
              )}

              {config.pattern === 'checker' && (
                <>
                  <div className="control-group">
                    <label>Columns: {config.cols}</label>
                    <input type="range" min="4" max="20" value={config.cols} onChange={(e) => updateConfig('cols', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Rows: {config.rows}</label>
                    <input type="range" min="4" max="20" value={config.rows} onChange={(e) => updateConfig('rows', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Size: {config.cellSize}px</label>
                    <input type="range" min="20" max="120" value={config.cellSize} onChange={(e) => updateConfig('cellSize', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Gap: {config.gap}px</label>
                    <input type="range" min="0" max="30" value={config.gap} onChange={(e) => updateConfig('gap', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Shape</label>
                    <select value={config.shapeType} onChange={(e) => updateConfig('shapeType', e.target.value)}>
                      <option value="rect">Rectangle</option>
                      <option value="circle">Circle</option>
                    </select>
                  </div>
                </>
              )}

              {config.pattern === 'scattered' && (
                <>
                  <div className="control-group">
                    <label>Density: {config.density}</label>
                    <input type="range" min="50" max="500" value={config.density} onChange={(e) => updateConfig('density', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Min Size: {config.sizeMin}px</label>
                    <input type="range" min="5" max="50" value={config.sizeMin} onChange={(e) => updateConfig('sizeMin', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Max Size: {config.sizeMax}px</label>
                    <input type="range" min="20" max="100" value={config.sizeMax} onChange={(e) => updateConfig('sizeMax', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Rotation: {config.rotation}°</label>
                    <input type="range" min="0" max="360" value={config.rotation} onChange={(e) => updateConfig('rotation', parseInt(e.target.value))} />
                  </div>
                  <div className="control-group">
                    <label>Shape</label>
                    <select value={config.shapeType} onChange={(e) => updateConfig('shapeType', e.target.value)}>
                      <option value="rect">Rectangle</option>
                      <option value="circle">Circle</option>
                      <option value="triangle">Triangle</option>
                      <option value="dash">Dash</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Colors */}
            <div className="control-section">
              <h3>Colors</h3>
              
              <div className="control-group">
                <label>Background</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={config.colors.bg}
                    onChange={(e) => updateColors('bg', e.target.value)}
                  />
                  <input
                    type="text"
                    className="color-hex"
                    value={config.colors.bg}
                    onChange={(e) => updateColors('bg', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="color-palette-header">
                <label style={{marginBottom: 0}}>Palette</label>
                <button onClick={addColor} className="add-color-btn">+ Add</button>
              </div>
              
              {config.colors.palette.map((color, i) => (
                <div key={i} className="color-row">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColors('palette', e.target.value, i)}
                  />
                  <input
                    type="text"
                    className="color-hex"
                    value={color}
                    onChange={(e) => updateColors('palette', e.target.value, i)}
                  />
                  {config.colors.palette.length > 2 && (
                    <button
                      onClick={() => removeColor(i)}
                      className="remove-color-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;