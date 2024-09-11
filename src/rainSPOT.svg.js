/**
 * rainSPOT.svg.js
 * https://github.com/BorisAnthony/rainSPOTjs
 * @version 1.0.0
 * @author Boris Anthony
 * @license MIT
 * @copyright (c) 2024 Boris Anthony
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function create_rainSPOT_SVG({inputString, options = {}}) {
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

  // Calculate strokeWidths
  const rangeRingsStrokeWidth = Math.min(rangeRings.strokeWidth / 20, canvasSize / (20 * 3.5));
  const crossHairsStrokeWidth = crossHairs.strokeWidth / 20;

  // Split string into rows and reverse the order
  const rows = inputString.match(/.{1,7}/g).reverse();

  // Create SVG element
  const svg = _createSVGElement('svg', {
    viewBox: '0 0 7 7',
    width: canvasSize.toString(),
    height: canvasSize.toString()
  });

  // Create <defs>
  const defs = _createSVGElement('defs', {});
  svg.appendChild(defs);

  // Build Grid
  rows.forEach((row, y) => {
    for (let x = 0; x < 7; x++) {
      const digit = parseInt(row[x], 10);
      const rect = _createSVGElement('rect', {
        x: x,
        y: y,
        width: 1,
        height: 1
      });

      if (useCSS) {
        rect.setAttribute('class', 's' + digit);
      } else {
        rect.setAttribute('fill', colorPalette[digit] || 'rgba(255, 255, 255, 0)');
      }
      
      svg.appendChild(rect);
    }
  });

  // Draw Graticule
  if (rangeRings.enabled) {
    const rings = [1, 3, 5, 7];

    rings.forEach(r => {
      const strokeColor = rangeRings.colors[r] || 'rgba(0 0 0 / 1)';

      const ring = _createSVGElement('circle', {
        cx: '3.5',
        cy: '3.5',
        r: (r / 2) - (rangeRingsStrokeWidth / 2),
        'stroke-width': rangeRingsStrokeWidth,
        fill: 'transparent',
        stroke: strokeColor
      });

      svg.appendChild(ring);
    });
  }

  // Draw Reticule
  if (crossHairs.enabled) {
    if (crossHairs.style === 'bullseye') {
      const bullsEyeLine = _createSVGElement('line', {
        id: 'bullsEyeLine',
        x1: '3.5',
        y1: '0',
        x2: '3.5',
        y2: '7',
        stroke: crossHairs.color,
        'stroke-width': crossHairsStrokeWidth
      });
      defs.appendChild(bullsEyeLine);
      
      const useBullsEyeLine1 = _createSVGElement('use', {
        href: '#bullsEyeLine',
      });

      const useBullsEyeLine2 = useBullsEyeLine1.cloneNode(true);
      _setAttributes(useBullsEyeLine2, {
        transform: 'rotate(90 3.5 3.5)'
      });
      
      const bullsEyeGroup = _createSVGElement('g', {});
      _appendChildren(bullsEyeGroup, [useBullsEyeLine1, useBullsEyeLine2]);

      svg.appendChild(bullsEyeGroup);
    } else if (crossHairs.style === 'brackets') {
      const bracketsLine = _createSVGElement('line', {
        id: 'bracketsLine',
        x1: '3.5',
        y1: 0.5 + rangeRingsStrokeWidth / 2,
        x2: '3.5',
        y2: 1.5 + rangeRingsStrokeWidth / 2,
        stroke: crossHairs.color,
        'stroke-width': crossHairsStrokeWidth
      });
      defs.appendChild(bracketsLine);
      
      const bracketsLineN = _createSVGElement('use', {
        href: '#bracketsLine',
      });

      const bracketsLineE = bracketsLineN.cloneNode(true);
      _setAttributes(bracketsLineE, {
        transform: 'rotate(90 3.5 3.5)'
      });

      const bracketsLineS = bracketsLineN.cloneNode(true);
      _setAttributes(bracketsLineS, {
        transform: 'rotate(180 3.5 3.5)'
      });

      const bracketsLineW = bracketsLineN.cloneNode(true);
      _setAttributes(bracketsLineW, {
        transform: 'rotate(270 3.5 3.5)'
      });

      const bracketsGroup = _createSVGElement('g', {});
      _appendChildren(bracketsGroup, [bracketsLineN, bracketsLineE, bracketsLineS, bracketsLineW]);

      svg.appendChild(bracketsGroup);
    }
    // Note: 'radar' style is not implemented in this version
  }

  return svg;
}

// Helper Functions
function _createSVGElement(tagName, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  _setAttributes(element, attributes);
  return element;
}

function _setAttributes(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

function _appendChildren(element, children) {
  children.forEach(child => element.appendChild(child));
}