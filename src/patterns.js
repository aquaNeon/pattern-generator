export const patterns = {
  grid: (p, config) => {
    const { cols, rows, cellSize, colors, shapeType, rotation, gap } = config;
    p.background(colors.bg);
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * (cellSize + gap) + cellSize / 2;
        const y = j * (cellSize + gap) + cellSize / 2;
        const colorIndex = (i + j) % colors.palette.length;
        
        p.push();
        p.translate(x, y);
        p.rotate(p.radians(rotation * (i + j)));
        p.noStroke();
        p.fill(colors.palette[colorIndex]);
        
        switch(shapeType) {
          case 'rect':
            p.rectMode(p.CENTER);
            p.rect(0, 0, cellSize * 0.8, cellSize * 0.8);
            break;
          case 'circle':
            p.circle(0, 0, cellSize * 0.8);
            break;
          case 'triangle':
            p.triangle(-cellSize/3, cellSize/3, cellSize/3, cellSize/3, 0, -cellSize/3);
            break;
          case 'wave':
            p.beginShape();
            for (let a = 0; a < p.TWO_PI; a += 0.1) {
              const r = cellSize * 0.3 * (1 + 0.3 * p.sin(a * 3));
              p.vertex(r * p.cos(a), r * p.sin(a));
            }
            p.endShape(p.CLOSE);
            break;
        }
        p.pop();
      }
    }
  },
  
  bars: (p, config) => {
    const { cols, rows, colors, direction, thickness, gap } = config;
    p.background(colors.bg);
    p.noStroke();
    
    const totalBars = direction === 'horizontal' ? rows : cols;
    const barLength = direction === 'horizontal' ? p.width : p.height;
    
    for (let i = 0; i < totalBars; i++) {
      const colorIndex = i % colors.palette.length;
      p.fill(colors.palette[colorIndex]);
      
      if (direction === 'horizontal') {
        const y = i * (thickness + gap);
        p.rect(0, y, barLength, thickness);
      } else {
        const x = i * (thickness + gap);
        p.rect(x, 0, thickness, barLength);
      }
    }
  },
  
  checker: (p, config) => {
    const { cols, rows, cellSize, colors, shapeType, gap } = config;
    p.background(colors.bg);
    p.noStroke();
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const isOdd = (i + j) % 2 === 1;
        if (!isOdd) continue;
        
        const x = i * (cellSize + gap);
        const y = j * (cellSize + gap);
        const colorIndex = Math.floor(p.random(colors.palette.length));
        p.fill(colors.palette[colorIndex]);
        
        if (shapeType === 'rect') {
          p.rect(x, y, cellSize, cellSize);
        } else {
          p.circle(x + cellSize/2, y + cellSize/2, cellSize);
        }
      }
    }
  },
  
  scattered: (p, config) => {
    const { density, colors, shapeType, sizeMin, sizeMax, rotation } = config;
    p.background(colors.bg);
    p.noStroke();
    
    for (let i = 0; i < density; i++) {
      const x = p.random(p.width);
      const y = p.random(p.height);
      const size = p.random(sizeMin, sizeMax);
      const colorIndex = Math.floor(p.random(colors.palette.length));
      const angle = p.random(rotation);
      
      p.push();
      p.translate(x, y);
      p.rotate(p.radians(angle));
      p.fill(colors.palette[colorIndex]);
      
      switch(shapeType) {
        case 'rect':
          p.rectMode(p.CENTER);
          p.rect(0, 0, size, size);
          break;
        case 'circle':
          p.circle(0, 0, size);
          break;
        case 'triangle':
          p.triangle(-size/2, size/2, size/2, size/2, 0, -size/2);
          break;
        case 'dash':
          p.rectMode(p.CENTER);
          p.rect(0, 0, size * 2, size * 0.3);
          break;
      }
      p.pop();
    }
  }
};

export const presets = {
  'Music Categories': {
    pattern: 'bars',
    cols: 12,
    rows: 12,
    thickness: 30,
    gap: 8,
    direction: 'vertical',
    colors: {
      bg: '#7C3AED',
      palette: ['#FCD34D', '#34D399']
    }
  },
  'Geometric Grid': {
    pattern: 'grid',
    cols: 6,
    rows: 6,
    cellSize: 100,
    gap: 20,
    shapeType: 'triangle',
    rotation: 15,
    colors: {
      bg: '#EF4444',
      palette: ['#3B82F6', '#EC4899']
    }
  },
  'Scattered Shapes': {
    pattern: 'scattered',
    density: 150,
    sizeMin: 15,
    sizeMax: 50,
    shapeType: 'dash',
    rotation: 45,
    colors: {
      bg: '#EC4899',
      palette: ['#10B981', '#3B82F6']
    }
  },
  'Checker Wave': {
    pattern: 'checker',
    cols: 10,
    rows: 10,
    cellSize: 60,
    gap: 20,
    shapeType: 'circle',
    colors: {
      bg: '#10B981',
      palette: ['#FCD34D', '#EF4444']
    }
  }
};