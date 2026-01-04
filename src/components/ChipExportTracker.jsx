import React, { useState, useMemo } from 'react';
import { chipData } from '../data/chipData';
import { thresholdHistory } from '../data/thresholdData';

// Clean, editorial theme configurations
const themes = {
  light: {
    bg: '#FAFAF8',
    bgAlt: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgHover: '#F5F5F3',
    border: 'rgba(0, 0, 0, 0.08)',
    borderStrong: 'rgba(0, 0, 0, 0.12)',
    text: '#1a1a1a',
    textSecondary: '#4a4a4a',
    textMuted: '#717171',
    accent: '#0d7377',
    accentHover: '#0a5c5f',
    accentBg: 'rgba(13, 115, 119, 0.06)',
    statusExceeds: '#dc2626',
    statusExceedsBg: 'rgba(220, 38, 38, 0.08)',
    statusBelow: '#16a34a',
    statusBelowBg: 'rgba(22, 163, 74, 0.08)',
  },
  dark: {
    bg: '#111111',
    bgAlt: '#1a1a1a',
    bgCard: '#1a1a1a',
    bgHover: '#222222',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.12)',
    text: '#f5f5f5',
    textSecondary: '#a3a3a3',
    textMuted: '#737373',
    accent: '#2dd4bf',
    accentHover: '#5eead4',
    accentBg: 'rgba(45, 212, 191, 0.1)',
    statusExceeds: '#f87171',
    statusExceedsBg: 'rgba(248, 113, 113, 0.12)',
    statusBelow: '#4ade80',
    statusBelowBg: 'rgba(74, 222, 128, 0.12)',
  }
};

const fonts = {
  serif: "'Source Serif 4', Georgia, serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace"
};

export default function ChipExportTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sortConfig, setSortConfig] = useState({ key: 'tpp', direction: 'desc' });
  const [selectedChip, setSelectedChip] = useState(null);
  const [showInterconnectTooltip, setShowInterconnectTooltip] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? themes.dark : themes.light;

  const [calcInputs, setCalcInputs] = useState({
    flops: '',
    bitLength: '8',
    isSparse: false,
    dieArea: ''
  });

  const sortedChips = useMemo(() => {
    return [...chipData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (sortConfig.key === 'name' || sortConfig.key === 'controlStatus') {
        const aStr = aVal ?? '';
        const bStr = bVal ?? '';
        return sortConfig.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }
      const aNum = aVal ?? -Infinity;
      const bNum = bVal ?? -Infinity;
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    });
  }, [sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const calculatedTPP = useMemo(() => {
    if (!calcInputs.flops) return null;
    let flops = parseFloat(calcInputs.flops);
    if (calcInputs.isSparse) flops = flops / 2;
    return flops * parseInt(calcInputs.bitLength);
  }, [calcInputs]);

  const calculatedPD = useMemo(() => {
    if (!calculatedTPP || !calcInputs.dieArea) return null;
    return calculatedTPP / parseFloat(calcInputs.dieArea);
  }, [calculatedTPP, calcInputs.dieArea]);

  const currentThresholds = thresholdHistory[thresholdHistory.length - 1];

  const getControlStatus = (tpp, pd) => {
    if (!tpp && !pd) return { status: 'unknown', color: theme.textMuted };
    const exceedsTPP = tpp && tpp > currentThresholds.tppThreshold;
    const exceedsPD = pd && pd > currentThresholds.pdThreshold;
    if (exceedsTPP || exceedsPD) {
      return { status: 'Likely Controlled', color: theme.statusExceeds };
    }
    return { status: 'Below Thresholds', color: theme.statusBelow };
  };

  // Shared styles
  const cardStyle = {
    background: theme.bgCard,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '500',
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: fonts.sans,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      color: theme.text,
      fontFamily: fonts.sans,
      transition: 'background 0.2s ease, color 0.2s ease',
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${theme.border}`,
        background: theme.bgAlt,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              fontFamily: fonts.mono,
              margin: 0,
              letterSpacing: '-0.3px',
            }}>
              Export Control Toolkit
            </h1>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '4px 0 0',
            }}>
              Tools for tracking AI chip export controls
            </p>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.textSecondary,
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: fonts.sans,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = theme.bgHover}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            {isDarkMode ? '☀' : '☾'}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          gap: '4px',
        }}>
          {['dashboard', 'calculator', 'methodology', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px',
                background: activeTab === tab ? theme.accentBg : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${theme.accent}` : '2px solid transparent',
                color: activeTab === tab ? theme.accent : theme.textSecondary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: fonts.sans,
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
                marginBottom: '-1px',
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 32px' }}>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Section Header */}
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                fontFamily: fonts.serif,
                margin: '0 0 8px',
              }}>
                Export Control Dashboard
              </h2>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: theme.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0,
              }}>
                Current Thresholds
              </h2>
            </div>

            {/* Threshold Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '48px',
            }}>
              <div style={{ ...cardStyle, padding: '24px' }}>
                <div style={{ ...labelStyle, marginBottom: '8px' }}>TPP Threshold</div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '600',
                  fontFamily: fonts.mono,
                  color: theme.text,
                  letterSpacing: '-1px',
                }}>
                  {currentThresholds.tppThreshold.toLocaleString()}
                </div>
              </div>
              <div style={{ ...cardStyle, padding: '24px' }}>
                <div style={{ ...labelStyle, marginBottom: '8px' }}>PD Threshold</div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '600',
                  fontFamily: fonts.mono,
                  color: theme.text,
                  letterSpacing: '-1px',
                }}>
                  {currentThresholds.pdThreshold}
                </div>
              </div>
              <div style={{ ...cardStyle, padding: '24px' }}>
                <div style={{ ...labelStyle, marginBottom: '8px' }}>Current Rule</div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: theme.text,
                  marginBottom: '4px',
                }}>
                  {currentThresholds.rule}
                </div>
                <div style={{ fontSize: '13px', color: theme.textMuted }}>
                  {currentThresholds.date}
                </div>
              </div>
            </div>

            {/* Key Chips Section */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: theme.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0,
              }}>
                Key Chips
              </h2>
            </div>

            {/* Chip Table */}
            <div style={{ ...cardStyle, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {[
                      { key: 'name', label: 'Chip', width: '24%' },
                      { key: 'tpp', label: 'TPP', width: '14%' },
                      { key: 'pd', label: 'PD', width: '12%' },
                      { key: 'interconnect', label: 'Interconnect', width: '26%', hasTooltip: true },
                      { key: 'controlStatus', label: 'Status', width: '24%' }
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        style={{
                          width: col.width,
                          padding: '14px 20px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: theme.textMuted,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          cursor: 'pointer',
                          userSelect: 'none',
                          background: theme.bgAlt,
                          position: col.hasTooltip ? 'relative' : 'static',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {col.label}
                          {col.hasTooltip && (
                            <span
                              onMouseEnter={() => setShowInterconnectTooltip(true)}
                              onMouseLeave={() => setShowInterconnectTooltip(false)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                border: `1px solid ${theme.textMuted}`,
                                fontSize: '9px',
                                color: theme.textMuted,
                                textTransform: 'lowercase',
                                cursor: 'help',
                              }}
                            >
                              i
                            </span>
                          )}
                          {sortConfig.key === col.key && (
                            <span style={{ opacity: 0.5 }}>
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </span>
                        {col.hasTooltip && showInterconnectTooltip && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: '0',
                              marginTop: '8px',
                              width: '340px',
                              padding: '16px',
                              background: theme.bgCard,
                              border: `1px solid ${theme.border}`,
                              borderRadius: '8px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                              zIndex: 1000,
                              textTransform: 'none',
                              letterSpacing: 'normal',
                              fontWeight: '400',
                              fontSize: '13px',
                              lineHeight: '1.6',
                              color: theme.textSecondary,
                            }}
                          >
                            Interconnect bandwidth was used as an export control threshold in the 2022 controls but was removed in 2023 and replaced with PD after Nvidia manipulated interconnect on China-specific chips to circumvent controls.
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedChips.map((chip, idx) => (
                    <tr
                      key={chip.name}
                      onClick={() => setSelectedChip(selectedChip === chip.name ? null : chip.name)}
                      style={{
                        borderBottom: idx < sortedChips.length - 1 ? `1px solid ${theme.border}` : 'none',
                        background: selectedChip === chip.name ? theme.accentBg : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChip !== chip.name) e.currentTarget.style.background = theme.bgHover;
                      }}
                      onMouseLeave={(e) => {
                        if (selectedChip !== chip.name) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontWeight: '500', fontFamily: fonts.mono, fontSize: '13px' }}>
                          {chip.name}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontFamily: fonts.mono,
                          fontSize: '13px',
                          fontWeight: '500',
                          color: chip.tpp && chip.tpp > currentThresholds.tppThreshold ? theme.statusExceeds : theme.statusBelow,
                        }}>
                          {chip.tpp ? chip.tpp.toLocaleString() : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontFamily: fonts.mono,
                          fontSize: '13px',
                          fontWeight: '500',
                          color: chip.pd && chip.pd > currentThresholds.pdThreshold ? theme.statusExceeds : theme.statusBelow,
                        }}>
                          {chip.pd ? chip.pd.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontFamily: fonts.mono,
                        fontSize: '13px',
                        color: theme.textMuted,
                      }}>
                        {chip.interconnect ? chip.interconnect.toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          background: chip.controlStatus.includes('Controlled') ? theme.statusExceedsBg :
                                      chip.controlStatus === 'Unknown' ? theme.bgHover : theme.statusBelowBg,
                          color: chip.controlStatus.includes('Controlled') ? theme.statusExceeds :
                                 chip.controlStatus === 'Unknown' ? theme.textMuted : theme.statusBelow,
                        }}>
                          {chip.controlStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Detail Panel */}
            {selectedChip && (
              <div style={{ ...cardStyle, marginTop: '24px', padding: '28px' }}>
                {(() => {
                  const chip = chipData.find(c => c.name === selectedChip);
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                        <div>
                          <h3 style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: '600',
                            fontFamily: fonts.serif,
                          }}>
                            {chip.name}
                          </h3>
                          <p style={{ margin: '6px 0 0', fontSize: '14px', color: theme.textMuted }}>
                            {chip.manufacturer} · {chip.architecture} · Released {chip.releaseDate}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedChip(null)}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${theme.border}`,
                            color: theme.textMuted,
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontFamily: fonts.sans,
                          }}
                        >
                          Close
                        </button>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '20px',
                        paddingTop: '20px',
                        borderTop: `1px solid ${theme.border}`,
                      }}>
                        {[
                          { label: 'FP4 Dense', value: chip.fp4 ? `${chip.fp4} TFLOPS` : '—' },
                          { label: 'FP8 Dense', value: chip.fp8 ? `${chip.fp8} TFLOPS` : '—' },
                          { label: 'FP16 Dense', value: chip.fp16 ? `${chip.fp16} TFLOPS` : '—' },
                          { label: 'BF16 Dense', value: chip.bf16 ? `${chip.bf16} TFLOPS` : '—' },
                          { label: 'TF32 Dense', value: chip.tf32 ? `${chip.tf32} TFLOPS` : '—' },
                          { label: 'INT8 Dense', value: chip.int8 ? `${chip.int8} TOPS` : '—' },
                          { label: 'Die Area', value: chip.dieArea ? `${chip.dieArea} mm²` : '—' },
                          { label: 'HBM', value: chip.hbmCapacity || '—' },
                          { label: 'Memory BW', value: chip.memoryBandwidth || '—' },
                          { label: 'TDP', value: chip.tdp || '—' },
                          { label: 'ECCN', value: chip.eccn || '—' },
                        ].map(item => (
                          <div key={item.label}>
                            <div style={{ ...labelStyle, marginBottom: '4px' }}>{item.label}</div>
                            <div style={{ fontSize: '14px', fontFamily: fonts.mono, color: theme.text }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {chip.notes && (
                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${theme.border}` }}>
                          <div style={{ ...labelStyle, marginBottom: '8px' }}>Notes</div>
                          <p style={{ margin: 0, fontSize: '14px', color: theme.textSecondary, lineHeight: '1.6' }}>
                            {chip.notes}
                          </p>
                        </div>
                      )}

                      <div style={{ marginTop: '20px' }}>
                        <div style={{ ...labelStyle, marginBottom: '10px' }}>Sources</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {chip.sources.map((src, i) => (
                            src.url ? (
                              <a
                                key={i}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '12px',
                                  color: theme.accent,
                                  background: theme.accentBg,
                                  padding: '5px 10px',
                                  borderRadius: '4px',
                                  textDecoration: 'none',
                                }}
                              >
                                {src.name}
                              </a>
                            ) : (
                              <span key={i} style={{
                                fontSize: '12px',
                                color: theme.textMuted,
                                background: theme.bgHover,
                                padding: '5px 10px',
                                borderRadius: '4px',
                              }}>
                                {src.name}
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div style={{ maxWidth: '720px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                fontFamily: fonts.serif,
                margin: '0 0 8px',
              }}>
                TPP & PD Calculator
              </h2>
              <p style={{ fontSize: '15px', color: theme.textMuted, margin: 0 }}>
                Estimate export control metrics for any chip
              </p>
            </div>

            <div style={{ ...cardStyle, padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>
                    Peak Performance (TFLOPS/TOPS)
                  </label>
                  <input
                    type="number"
                    value={calcInputs.flops}
                    onChange={e => setCalcInputs(prev => ({ ...prev, flops: e.target.value }))}
                    placeholder="e.g., 1979"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.text,
                      fontSize: '15px',
                      fontFamily: fonts.mono,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>
                    Bit Length
                  </label>
                  <select
                    value={calcInputs.bitLength}
                    onChange={e => setCalcInputs(prev => ({ ...prev, bitLength: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.text,
                      fontSize: '15px',
                      fontFamily: fonts.mono,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="4">4-bit (FP4, INT4)</option>
                    <option value="8">8-bit (FP8, INT8)</option>
                    <option value="16">16-bit (FP16, BF16)</option>
                    <option value="32">32-bit (FP32, TF32)</option>
                    <option value="64">64-bit (FP64)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>
                    Die Area (mm²)
                  </label>
                  <input
                    type="number"
                    value={calcInputs.dieArea}
                    onChange={e => setCalcInputs(prev => ({ ...prev, dieArea: e.target.value }))}
                    placeholder="e.g., 814"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.text,
                      fontSize: '15px',
                      fontFamily: fonts.mono,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '26px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: theme.textSecondary,
                  }}>
                    <input
                      type="checkbox"
                      checked={calcInputs.isSparse}
                      onChange={e => setCalcInputs(prev => ({ ...prev, isSparse: e.target.checked }))}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    Sparse performance (will halve)
                  </label>
                </div>
              </div>

              {/* Results */}
              <div style={{
                background: theme.bg,
                borderRadius: '8px',
                padding: '24px',
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  <div>
                    <div style={{ ...labelStyle, marginBottom: '8px' }}>Calculated TPP</div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      fontFamily: fonts.mono,
                      color: calculatedTPP && calculatedTPP > currentThresholds.tppThreshold ? theme.statusExceeds : theme.statusBelow,
                      letterSpacing: '-1px',
                    }}>
                      {calculatedTPP ? calculatedTPP.toLocaleString() : '—'}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', fontFamily: fonts.mono }}>
                      Threshold: {currentThresholds.tppThreshold.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...labelStyle, marginBottom: '8px' }}>Calculated PD</div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      fontFamily: fonts.mono,
                      color: calculatedPD && calculatedPD > currentThresholds.pdThreshold ? theme.statusExceeds : calculatedPD ? theme.statusBelow : theme.textMuted,
                      letterSpacing: '-1px',
                    }}>
                      {calculatedPD ? calculatedPD.toFixed(2) : '—'}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', fontFamily: fonts.mono }}>
                      Threshold: {currentThresholds.pdThreshold}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...labelStyle, marginBottom: '8px' }}>Assessment</div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: getControlStatus(calculatedTPP, calculatedPD).color,
                    }}>
                      {!calculatedTPP ? 'Enter values' : getControlStatus(calculatedTPP, calculatedPD).status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div style={{
                marginTop: '20px',
                padding: '14px 16px',
                background: theme.accentBg,
                borderRadius: '6px',
                fontSize: '13px',
                color: theme.accent,
                fontFamily: fonts.mono,
              }}>
                <strong>Formula:</strong> TPP = {calcInputs.isSparse ? '(TFLOPS ÷ 2)' : 'TFLOPS'} × {calcInputs.bitLength}
                {calcInputs.dieArea && <span> · PD = TPP ÷ {calcInputs.dieArea}mm²</span>}
              </div>
            </div>

            {/* Guidance */}
            <div style={{ ...cardStyle, marginTop: '24px', padding: '28px' }}>
              <h3 style={{
                margin: '0 0 16px',
                fontSize: '16px',
                fontWeight: '600',
                fontFamily: fonts.serif,
              }}>
                Input Guidance
              </h3>
              <div style={{ fontSize: '14px', color: theme.textSecondary, lineHeight: '1.7' }}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong style={{ color: theme.text }}>Performance:</strong> Use dense matrix performance. If only sparse performance is provided (common for NVIDIA datasheets), halve the value or use the checkbox above.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong style={{ color: theme.text }}>Bit Length:</strong> Use the bit length that yields the highest TPP (most likely 8- or 4-bit).
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: theme.text }}>Die Area:</strong> All logic dies manufactured with a non-planar transistor architecture (typically ≤16nm), including caches but excluding separate memory stacks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Methodology Tab */}
        {activeTab === 'methodology' && (
          <div style={{ maxWidth: '720px' }}>
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                fontFamily: fonts.serif,
                margin: '0 0 8px',
              }}>
                Calculation Methodology
              </h2>
            </div>

            <div style={{ ...cardStyle, padding: '36px' }}>
              <section style={{ marginBottom: '36px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  fontFamily: fonts.serif,
                  marginBottom: '16px',
                  color: theme.text,
                }}>
                  Total Processing Performance (TPP)
                </h3>
                <div style={{ fontSize: '15px', color: theme.textSecondary, lineHeight: '1.8' }}>
                  <p style={{ margin: '0 0 14px' }}>
                    Per EAR: <code style={{
                      background: theme.bgHover,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontFamily: fonts.mono,
                      fontSize: '13px',
                    }}>TPP = 2 × MacTOPS × bit_length</code>, aggregated over all processing units.
                  </p>
                  <p style={{ margin: '0 0 14px' }}>
                    The factor of 2 reflects industry convention of counting multiply-accumulate as two operations. Since datasheets typically report FLOPS/TOPS already using this convention, the practical formula simplifies to:
                  </p>
                  <p style={{ margin: '0 0 16px' }}>
                    <code style={{
                      background: theme.bgHover,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontFamily: fonts.mono,
                      fontSize: '13px',
                    }}>TPP = TFLOPS (dense) × bit_length</code>
                  </p>
                  <div style={{
                    padding: '14px 16px',
                    background: theme.statusExceedsBg,
                    borderRadius: '6px',
                    borderLeft: `3px solid ${theme.statusExceeds}`,
                    color: theme.statusExceeds,
                    fontSize: '14px',
                  }}>
                    <strong>Critical:</strong> Use dense matrix performance. NVIDIA datasheets often show sparse performance (2× dense) with a footnote. Sparse figures must be halved.
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '36px', paddingTop: '24px', borderTop: `1px solid ${theme.border}` }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  fontFamily: fonts.serif,
                  marginBottom: '16px',
                  color: theme.text,
                }}>
                  Performance Density (PD)
                </h3>
                <div style={{ fontSize: '15px', color: theme.textSecondary, lineHeight: '1.8' }}>
                  <p style={{ margin: '0 0 14px' }}>
                    <code style={{
                      background: theme.bgHover,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontFamily: fonts.mono,
                      fontSize: '13px',
                    }}>PD = TPP ÷ applicable_die_area</code>
                  </p>
                  <p style={{ margin: '0 0 14px' }}>
                    "Applicable die area" includes all logic dies (including caches) manufactured with a process node that uses a non-planar transistor architecture (typically ≤16nm).
                  </p>
                  <p style={{ margin: 0 }}>
                    Exclude separate memory stacks (e.g., HBM). Calculate at the highest level of integration: for chiplet designs, sum all applicable logic die areas.
                  </p>
                </div>
              </section>

              <section style={{ paddingTop: '24px', borderTop: `1px solid ${theme.border}` }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  fontFamily: fonts.serif,
                  marginBottom: '16px',
                  color: theme.text,
                }}>
                  Data Sources
                </h3>
                <div style={{ fontSize: '15px', color: theme.textSecondary, lineHeight: '1.8' }}>
                  <p style={{ margin: '0 0 14px' }}>
                    This tracker compiles data from manufacturer whitepapers, official datasheets, BIS final rules, and industry analysis (SemiAnalysis, CSET). Where official figures are unavailable, estimates are noted.
                  </p>
                  <p style={{ margin: 0, fontStyle: 'italic', color: theme.textMuted }}>
                    This tool is for informational purposes only. It does not constitute legal advice. Consult qualified export control counsel for compliance determinations.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                fontFamily: fonts.serif,
                margin: 0,
              }}>
                Threshold History
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {thresholdHistory.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    ...cardStyle,
                    padding: '28px',
                    borderLeft: idx === thresholdHistory.length - 1 ? `3px solid ${theme.accent}` : `1px solid ${theme.border}`,
                    position: 'relative',
                  }}
                >
                  {idx === thresholdHistory.length - 1 && (
                    <span style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: theme.accent,
                      background: theme.accentBg,
                      padding: '4px 10px',
                      borderRadius: '4px',
                    }}>
                      Current
                    </span>
                  )}
                  <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '6px' }}>
                    {rule.date}
                  </div>
                  <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontFamily: fonts.serif }}>
                    <a
                      href={rule.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: theme.text,
                        textDecoration: 'none',
                      }}
                    >
                      {rule.rule}
                    </a>
                  </h3>
                  <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: theme.textMuted }}>TPP Threshold: </span>
                      <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: fonts.mono, color: theme.text }}>
                        {rule.tppThreshold.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: theme.textMuted }}>PD Threshold: </span>
                      <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: fonts.mono, color: theme.text }}>
                        {rule.pdThreshold}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: theme.textSecondary, lineHeight: '1.6' }}>
                    {rule.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${theme.border}`,
        marginTop: '80px',
        background: theme.bgAlt,
      }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            fontSize: '13px',
            color: theme.textMuted,
          }}
        >
          {/* Left side */}
          <div>
            Last updated: 1/4/2026 · Unofficial reference tool · Not legal advice
          </div>

          {/* Right side */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
              maxWidth: '520px',
            }}
          >
            <div>
              Created and maintained by{' '}
              <a
                href="https://www.skellystuff.net/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                Spencer Kelly
              </a>
            </div>

            <div style={{ marginTop: '4px' }}>
              This website was built using Claude Code but all research/analysis/content is by me.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
