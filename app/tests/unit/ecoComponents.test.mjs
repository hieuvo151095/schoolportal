/**
 * Unit Test Suite: ECO Design System Atoms & Tokens
 * Standards: ECO FINVIET Design System Specification v1.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  ECO_COLORS,
  ECO_SPACING,
  ECO_RADII,
  ECO_SHADOWS,
} from '../../src/constants/ecoTokens.ts';

describe('ECO Design System — Tokens Verification', () => {
  test('TC-ECO-01: Brand core colors match ECO Design System exact hex values', () => {
    assert.equal(ECO_COLORS.blue, '#006FDA');
    assert.equal(ECO_COLORS.blueHover, '#1A94FF');
    assert.equal(ECO_COLORS.yellow, '#FFCA00');
    assert.equal(ECO_COLORS.yellowHover, '#FECD4D');
    assert.equal(ECO_COLORS.articBlue, '#4AC3FF');
    assert.equal(ECO_COLORS.deepAqua, '#00C1C1');
    assert.equal(ECO_COLORS.orangeCitrus, '#F78700');
  });

  test('TC-ECO-02: Semantic alert colors match design guidelines', () => {
    assert.equal(ECO_COLORS.danger, '#C0263A');
    assert.equal(ECO_COLORS.dangerBright, '#E5252B');
    assert.equal(ECO_COLORS.warningText, '#E8590C');
  });

  test('TC-ECO-03: Surface and canvas backgrounds adhere to ECO specs', () => {
    assert.equal(ECO_COLORS.bgCanvas, '#F5F5F5');
    assert.equal(ECO_COLORS.bgSunken, '#FAFAFA');
    assert.equal(ECO_COLORS.bgSurface, '#FFFFFF');
    assert.equal(ECO_COLORS.bgSolid, '#1F1F1F');
  });

  test('TC-ECO-04: Baseline 4px grid spacing tokens are correctly structured', () => {
    assert.equal(ECO_SPACING.space4, '4px');
    assert.equal(ECO_SPACING.space8, '8px');
    assert.equal(ECO_SPACING.space12, '12px');
    assert.equal(ECO_SPACING.space16, '16px');
    assert.equal(ECO_SPACING.space24, '24px');
    assert.equal(ECO_SPACING.space32, '32px');
    assert.equal(ECO_SPACING.space48, '48px');
  });

  test('TC-ECO-05: Corner radii match standard and pill shapes', () => {
    assert.equal(ECO_RADII.sm, '6px');
    assert.equal(ECO_RADII.md, '10px');
    assert.equal(ECO_RADII.lg, '16px');
    assert.equal(ECO_RADII.full, '9999px');
  });

  test('TC-ECO-06: Elevation shadow tokens exist across all 5 tiers', () => {
    assert.ok(ECO_SHADOWS.xs);
    assert.ok(ECO_SHADOWS.sm);
    assert.ok(ECO_SHADOWS.md);
    assert.ok(ECO_SHADOWS.lg);
    assert.ok(ECO_SHADOWS.xl);
  });
});

describe('ECO Design System — Component Library Contract Verification', () => {
  const ecoComponentsDir = path.resolve('src/components/eco');

  test('TC-ECO-07: All canonical atom files exist in src/components/eco', () => {
    const requiredFiles = [
      'EcoButton.tsx',
      'EcoIconButton.tsx',
      'EcoInput.tsx',
      'EcoBadge.tsx',
      'EcoAvatar.tsx',
      'EcoCheckbox.tsx',
      'EcoRadio.tsx',
      'EcoSwitch.tsx',
      'EcoDialog.tsx',
      'EcoToast.tsx',
      'EcoDivider.tsx',
      'index.ts',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(ecoComponentsDir, file);
      assert.ok(fs.existsSync(filePath), `Component file ${file} must exist`);
    }
  });

  test('TC-ECO-08: eco/index.ts exports all components and interfaces properly', () => {
    const indexContent = fs.readFileSync(path.join(ecoComponentsDir, 'index.ts'), 'utf-8');

    const expectedExports = [
      'EcoButton',
      'EcoIconButton',
      'EcoInput',
      'EcoBadge',
      'EcoAvatar',
      'EcoCheckbox',
      'EcoRadio',
      'EcoSwitch',
      'EcoDialog',
      'EcoToast',
      'EcoDivider',
    ];

    for (const exp of expectedExports) {
      assert.ok(indexContent.includes(exp), `index.ts must export ${exp}`);
    }
  });

  test('TC-ECO-09: ecoTokens.css has required CSS custom properties and keyframe animations', () => {
    const cssPath = path.resolve('src/styles/ecoTokens.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    assert.ok(cssContent.includes('--eco-blue: #006fda;'));
    assert.ok(cssContent.includes('--eco-yellow: #ffca00;'));
    assert.ok(cssContent.includes('--bg-canvas: #f5f5f5;'));
    assert.ok(cssContent.includes('--radius-md: 10px;'));
    assert.ok(cssContent.includes('@keyframes eco-spin'));
    assert.ok(cssContent.includes('@keyframes eco-fade-in'));
  });

  test('TC-ECO-10: globals.css imports ecoTokens.css', () => {
    const globalsPath = path.resolve('src/styles/globals.css');
    const globalsContent = fs.readFileSync(globalsPath, 'utf-8');

    assert.ok(
      globalsContent.includes("@import './ecoTokens.css';") ||
      globalsContent.includes('@import "./ecoTokens.css";'),
      'globals.css must import ecoTokens.css'
    );
  });
});
