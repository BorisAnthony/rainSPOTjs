/**
 * rainSPOT.canvas.js
 * https://github.com/BorisAnthony/rainSPOTjs
 * @version 1.0.0
 * @author Boris Anthony
 * @license MIT
 * @copyright (c) 2024 Boris Anthony
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function create_rainSPOT_Canvas({ inputString, options = {} }) {
  // Validate input
  if (inputString.length !== 49 || !/^\d+$/.test(inputString)) {
    throw new Error('Invalid input string. Must be 49 digits.');
  }

  // Destructure options with default values
  let {
    canvasSize = 140,
    useCSS = false,
    colorPalette = {
      0: '#fff6', // transparent
      1: '#13eefc', // light blue 0.2mm - 1.5mm
      2: '#3aaadc', // blue 1.5mm - 5mm
      3: '#1774c4', // dark blue > 5mm
      9: '#22d690' // green 0.02mm - 02.mm
    },
    rangeRings = {
      enabled: true,
      colors: {
        1: '#000',
        3: '#000',
        5: '#000',
        7: '#0000'
      },
      strokeWidth: 2
    },
    crossHairs = {
      enabled: true,
      style: 'brackets',
      color: '#000',
      strokeWidth: 2
    }
  } = options;

  // Constants and calculated values
  const baseSize   = 140;
  canvasSize = Math.max(baseSize, Math.round(canvasSize / 7) * 7);
  const sizeRatio  = canvasSize / baseSize;
  const cellSize   = canvasSize / 7;

  // Create canvas and get context
  const canvas  = document.createElement('canvas');
  canvas.width  = canvasSize;
  canvas.height = canvasSize;
  const ctx     = canvas.getContext('2d');

  // Split string into rows and reverse the order
  const rows = inputString.match(/.{1,7}/g).reverse();

  // Draw grid
  rows.forEach((row, y) => {
    for (let x = 0; x < 7; x++) {
      const digit = parseInt(row[x], 10);
      ctx.fillStyle = colorPalette[digit] || '#000000';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  });

  // Draw rangeRings
  if (rangeRings.enabled) {
    const minStrokeWidth = 1;
    const maxStrokeWidth = canvasSize / 3.5;
    
    // Calculate stroke width, ensuring it's within bounds and scaled appropriately
    const rangeRingsStrokeWidth = Math.min(
      maxStrokeWidth,
      Math.max(minStrokeWidth, rangeRings.strokeWidth * sizeRatio)
    );

    [1, 3, 5, 7].forEach(r => {
      const radius = Math.floor(((r * cellSize) - rangeRingsStrokeWidth) / 2);
      
      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = typeof rangeRings.colors === 'string' 
          ? rangeRings.colors 
          : (rangeRings.colors[r] || 'rgba(0, 0, 0, 0.5)');
        ctx.lineWidth = rangeRingsStrokeWidth;
        ctx.stroke();
      }
    });
  }

  // Draw crossHairs
  if (crossHairs.enabled) {
    
    const crossHairsStrokeWidth = Math.max(1, crossHairs.strokeWidth * sizeRatio);
    const rangeRingsStrokeOffset = rangeRings.enabled 
      ? Math.min(canvasSize / 3.5, Math.max(1, rangeRings.strokeWidth * sizeRatio))
      : 0;
    
    if (crossHairs.style === 'bullseye') {
    
      _drawCrosshair(ctx, { x: canvasSize / 2, y: 0 }, { x: canvasSize / 2, y: canvasSize }, crossHairs.color, crossHairsStrokeWidth);
      _drawCrosshair(ctx, { x: 0, y: canvasSize / 2 }, { x: canvasSize, y: canvasSize / 2 }, crossHairs.color, crossHairsStrokeWidth);
    
    } else if (crossHairs.style === 'brackets') {

      const bracketLength = cellSize / 2;
      const offset = rangeRingsStrokeOffset / 2;
      
      // North bracket
      _drawCrosshair(ctx, 
        { x: canvasSize / 2, y: bracketLength + offset }, 
        { x: canvasSize / 2, y: bracketLength + cellSize + offset }, 
        crossHairs.color, 
        crossHairsStrokeWidth);
      // East bracket
      _drawCrosshair(ctx, 
        { x: canvasSize - ((cellSize / 2) + offset), y: canvasSize / 2 }, 
        { x: canvasSize - (cellSize + offset) - bracketLength, y: canvasSize / 2 }, 
        crossHairs.color, 
        crossHairsStrokeWidth);
      // South bracket
      _drawCrosshair(ctx, 
        { x: canvasSize / 2, y: canvasSize - (cellSize / 2) - offset }, 
        { x: canvasSize / 2, y: canvasSize - (cellSize + offset) - bracketLength }, 
        crossHairs.color, crossHairsStrokeWidth);
      // West bracket
      _drawCrosshair(ctx, 
        { x: (cellSize / 2) + offset, y: canvasSize / 2 }, 
        { x: (cellSize + bracketLength) + offset, y: canvasSize / 2 }, 
        crossHairs.color, 
        crossHairsStrokeWidth);
    }
  }

  // Create and return image
  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  return img;
}

// Helper function for drawing crossHairs
function _drawCrosshair(ctx, start, end, color, strokeWidth) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}