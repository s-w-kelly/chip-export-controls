import React, { useState, useMemo } from 'react';
import { chipData } from '../data/chipData';
import { thresholdHistory } from '../data/thresholdData';
import { notesContent } from '../data/notesData';

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
    dieArea: '',
    isDatacenter: true
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

  const currentThresholds = thresholdHistory[0];

  // Status colors
  const statusColors = {
    controlled: theme.statusExceeds,          // red
    nacEligible: '#ca8a04',                   // yellow/amber
    notControlled: theme.statusBelow,         // green
    unknown: theme.textMuted
  };

  const getControlStatus = (tpp, pd, isDatacenter = true) => {
    if (!tpp) return { status: 'Enter values', color: statusColors.unknown, eccn: null };

    if (isDatacenter) {
      // Datacenter chips - full two-tiered system

      // Tier 1: License Required (ECCN 3A090.a)
      // .a.1: TPP >= 4800
      if (tpp >= 4800) {
        return { status: 'Controlled', color: statusColors.controlled, eccn: '3A090.a.1' };
      }
      // .a.2: TPP >= 1600 AND PD >= 5.92
      if (tpp >= 1600 && pd && pd >= 5.92) {
        return { status: 'Controlled', color: statusColors.controlled, eccn: '3A090.a.2' };
      }

      // Tier 2: NAC/ACA Eligible (ECCN 3A090.b)
      // .b.1: 2400 <= TPP < 4800 AND 1.6 <= PD < 5.92
      if (tpp >= 2400 && tpp < 4800 && pd && pd >= 1.6 && pd < 5.92) {
        return { status: 'Controlled but NAC/ACA eligible', color: statusColors.nacEligible, eccn: '3A090.b.1' };
      }
      // .b.2: TPP >= 1600 AND 3.2 <= PD < 5.92
      if (tpp >= 1600 && pd && pd >= 3.2 && pd < 5.92) {
        return { status: 'Controlled but NAC/ACA eligible', color: statusColors.nacEligible, eccn: '3A090.b.2' };
      }

      // Does not meet any controlled criteria
      return { status: 'Not controlled', color: statusColors.notControlled, eccn: null };
    } else {
      // Non-datacenter chips - simpler rules
      // TPP >= 4800: NAC/ACA eligible
      if (tpp >= 4800) {
        return { status: 'Controlled but NAC/ACA eligible', color: statusColors.nacEligible, eccn: null };
      }
      // TPP < 4800: Not controlled
      return { status: 'Not controlled', color: statusColors.notControlled, eccn: null };
    }
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
              Tools for tracking and undestanding AI chip export controls
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
          {['dashboard', 'calculator', 'methodology', 'history', 'notes'].map(tab => (
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
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 32px' }}>

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
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '36px',
            }}>
              {/* Datacenter Chips Card */}
              <div style={{ ...cardStyle, padding: '24px' }}>
                <div style={{
                  ...labelStyle,
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: theme.accent,
                }}>
                  Datacenter Chips
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: theme.statusExceeds,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}>
                    License Required (3A090.a)
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontFamily: fonts.mono,
                    color: theme.text,
                    lineHeight: '1.6',
                  }}>
                    <div>.a.1: TPP ≥ 4,800</div>
                    <div>.a.2: TPP ≥ 1,600 AND PD ≥ 5.92</div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#ca8a04',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}>
                    NAC/ACA Eligible (3A090.b)
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontFamily: fonts.mono,
                    color: theme.text,
                    lineHeight: '1.6',
                  }}>
                    <div>.b.1: 2,400 ≤ TPP &lt; 4,800 AND 1.6 ≤ PD &lt; 5.92</div>
                    <div>.b.2: TPP ≥ 1,600 AND 3.2 ≤ PD &lt; 5.92</div>
                  </div>
                </div>
              </div>

              {/* Non-Datacenter Chips Card */}
              <div style={{ ...cardStyle, padding: '24px' }}>
                <div style={{
                  ...labelStyle,
                  marginBottom: '6px',
                  fontSize: '12px',
                  color: theme.accent,
                }}>
                  Non-Datacenter Chips
                </div>
                <div style={{
                    fontSize: '12px',
                    fontFamily: fonts.sans,
                    color: theme.textMuted,
                    lineHeight: '1.6',
                    marginBottom: '14px',
                  }}>
                    <div>Note 2 to 3A090.a and 3A090.b</div>
                  </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#ca8a04',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}>
                    NAC/ACA Eligible
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontFamily: fonts.mono,
                    color: theme.text,
                    lineHeight: '1.6',
                  }}>
                    <div>TPP ≥ 4,800</div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: theme.statusBelow,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}>
                    Not Controlled
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontFamily: fonts.mono,
                    color: theme.text,
                    lineHeight: '1.6',
                  }}>
                    <div>TPP &lt; 4,800</div>
                  </div>
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
                            Interconnect bandwidth (the rate at which chips can transfer data between each other) was used as an export control threshold in the 2022 controls but was removed in 2023 and replaced with PD after Nvidia manipulated interconnect on China-specific chips to circumvent controls. See History tab for more.
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
                          color: chip.tpp >= 4800 ? theme.statusExceeds :
                                 chip.tpp >= 1600 ? statusColors.nacEligible :
                                 theme.statusBelow,
                        }}>
                          {chip.tpp ? chip.tpp.toLocaleString() : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontFamily: fonts.mono,
                          fontSize: '13px',
                          fontWeight: '500',
                          color: chip.pd >= 5.92 ? theme.statusExceeds :
                                 chip.pd >= 1.6 ? statusColors.nacEligible :
                                 theme.statusBelow,
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
                                      chip.controlStatus.toLowerCase().includes('nac') ? 'rgba(202, 138, 4, 0.12)' :
                                      chip.controlStatus === 'Unknown' ? theme.bgHover : theme.statusBelowBg,
                          color: chip.controlStatus.includes('Controlled') ? theme.statusExceeds :
                                 chip.controlStatus.toLowerCase().includes('nac') ? statusColors.nacEligible :
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
                          { label: 'FP4 Dense', value: chip.fp4 ? `${chip.fp4} TFLOP/s` : '—' },
                          { label: 'FP8 Dense', value: chip.fp8 ? `${chip.fp8} TFLOP/s` : '—' },
                          { label: 'FP16 Dense', value: chip.fp16 ? `${chip.fp16} TFLOP/s` : '—' },
                          { label: 'BF16 Dense', value: chip.bf16 ? `${chip.bf16} TFLOP/s` : '—' },
                          { label: 'TF32 Dense', value: chip.tf32 ? `${chip.tf32} TFLOP/s` : '—' },
                          { label: 'INT8 Dense', value: chip.int8 ? `${chip.int8} TOP/s` : '—' },
                          { label: 'Die Area', value: chip.dieArea || '—' },
                          { label: 'Process Node', value: chip.processNode || '—' },
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
                TPP and PD Calculator
              </h2>
              <p style={{ fontSize: '15px', color: theme.textMuted, margin: 0 }}>
                Estimate export control metrics for any chip
              </p>
            </div>

            <div style={{ ...cardStyle, padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>
                    Peak Performance (TFLOP/s or TOP/s)
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
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

              <div style={{
                marginBottom: '32px',
                padding: '16px',
                background: theme.bg,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: theme.text,
                }}>
                  <input
                    type="checkbox"
                    checked={calcInputs.isDatacenter}
                    onChange={e => setCalcInputs(prev => ({ ...prev, isDatacenter: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>
                    <strong>Datacenter marketing</strong>
                    <span style={{ color: theme.textMuted, marginLeft: '8px' }}>
                      (chip is designed or marketed for use in datacenters)
                    </span>
                  </span>
                </label>
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
                      color: calculatedTPP ? theme.text : theme.textMuted,
                      letterSpacing: '-1px',
                    }}>
                      {calculatedTPP ? calculatedTPP.toLocaleString() : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...labelStyle, marginBottom: '8px' }}>Calculated PD</div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      fontFamily: fonts.mono,
                      color: calculatedPD ? theme.text : theme.textMuted,
                      letterSpacing: '-1px',
                    }}>
                      {calculatedPD ? calculatedPD.toFixed(2) : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...labelStyle, marginBottom: '8px' }}>Assessment</div>
                    {(() => {
                      const result = getControlStatus(calculatedTPP, calculatedPD, calcInputs.isDatacenter);
                      return (
                        <>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: result.color,
                          }}>
                            {result.status}
                          </div>
                          {result.eccn && (
                            <div style={{
                              fontSize: '13px',
                              color: theme.textMuted,
                              marginTop: '4px',
                              fontFamily: fonts.mono,
                            }}>
                              ECCN {result.eccn}
                            </div>
                          )}
                        </>
                      );
                    })()}
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
                <strong>Formula:</strong> TPP = {calcInputs.isSparse ? '(TFLOP/s ÷ 2)' : 'TFLOP/s'} × {calcInputs.bitLength}
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
              <p style={{ fontSize: '15px', color: theme.textMuted, margin: 0 }}>
                See {' '}
                <a
                  href="https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-774/appendix-Supplement%20No.%201%20to%20Part%20774#:~:text=Technical%20Note%202%20to%203A090%2Ea%20and%203A090%2Eb"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  15 C.F.R. pt. 774, supp. 1 (Technical Note 2 to 3A090.a and 3A090.b)
                </a>                                         
              </p>
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
                    <code style={{
                      background: theme.bgHover,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontFamily: fonts.mono,
                      fontSize: '13px',
                    }}>TPP = 2 × MacTOP/s × bit_length</code>, aggregated over all processing units.
                  </p>
                  <p style={{ margin: '0 0 14px' }}>
                    The factor of 2 reflects industry convention of counting one multiply-accumulate computation as two operations. Since datasheets typically report FLOP/s and TOP/s already using this convention, the practical formula simplifies to:
                  </p>
                  <p style={{ margin: '0 0 16px' }}>
                    <code style={{
                      background: theme.bgHover,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontFamily: fonts.mono,
                      fontSize: '13px',
                    }}>TPP = TFLOP/s (dense) × bit_length</code>
                  </p>
                  <div style={{
                    margin: '0 0 16px',
                    padding: '14px 16px',
                    background: theme.statusExceedsBg,
                    borderRadius: '6px',
                    borderLeft: `3px solid ${theme.statusExceeds}`,
                    color: theme.statusExceeds,
                    fontSize: '14px',
                  }}>
                    <strong>Note:</strong> Use dense matrix performance. If only sparse performance is provided (common for NVIDIA datasheets), dense performance is generally half that of sparse. However, this is not always true (see, e.g., NVIDIA B300 FP4); check official documentation to ensure accuracy.
                  </div>
                  <p style={{ margin: 0 }}>
                    A chip’s TPP for purposes of assessing export control status is determined using the bit length that yields the highest value. E.g., the BIS notes that the 4800 TPP threshold can be met with 600 TOP/s at 8 bits or 300 TFLOP/s at 16 bits. 
                  </p>
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
                    “Applicable die area” includes all logic dies (including caches) manufactured with a process node that uses a non-planar transistor architecture (typically ≤16nm).
                  </p>
                  <p style={{ margin: '0 0 14px'  }}>
                    The applicable area does not include separate memory stacks (e.g., HBM).
                  </p>
                  <p style={{ margin: 0 }}>
                    PD should be calculated at the highest level of integration: for chiplet designs, sum all applicable logic die areas.
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
                Export Control History
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {thresholdHistory.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    ...cardStyle,
                    padding: '28px',
                    position: 'relative',
                  }}
                >
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
                    {rule.tppThreshold != null && (
                      <div>
                        <span style={{ fontSize: '12px', color: theme.textMuted }}>TPP Threshold: </span>
                        <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: fonts.mono, color: theme.text }}>
                          {rule.tppThreshold.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {rule.pdThreshold != null && (
                      <div>
                        <span style={{ fontSize: '12px', color: theme.textMuted }}>PD Threshold: </span>
                        <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: fonts.mono, color: theme.text }}>
                          {rule.pdThreshold}
                        </span>
                      </div>
                    )}
                    {rule.performanceThreshold != null && (
                      <div>
                        <span style={{ fontSize: '12px', color: theme.textMuted }}>Performance Threshold: </span>
                        <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: fonts.mono, color: theme.text }}>
                          {rule.performanceThreshold}
                        </span>
                      </div>
                    )}
                    {rule.interconnectThreshold != null && (
                      <div>
                        <span style={{ fontSize: '12px', color: theme.textMuted }}>Interconnect BW Threshold: </span>
                        <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: fonts.mono, color: theme.text }}>
                          {rule.interconnectThreshold}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{ margin: 0, fontSize: '14px', color: theme.textSecondary, lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: rule.notes }}
                    className="notes-content"
                  />
                </div>
              ))}
            </div>
            <style>{`
              .notes-content p { margin: 0 0 12px 0; }
              .notes-content p:last-child { margin-bottom: 0; }
              .notes-content ul { margin: 12px 0; padding-left: 24px; }
              .notes-content li { margin-bottom: 8px; }
              .notes-content a { color: inherit; text-decoration: underline; }
            `}</style>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div style={{ maxWidth: '720px' }}>
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                fontFamily: fonts.serif,
                margin: '0 0 8px',
              }}>
                Notes and Sources
              </h2>
            </div>

            <div style={{ ...cardStyle, padding: '36px' }}>
              <div
                className="notes-content"
                style={{ fontSize: '15px', color: theme.textSecondary, lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: notesContent }}
              />
            </div>
            <style>{`
              .notes-content h3 {
                font-size: 18px;
                font-weight: 600;
                font-family: ${fonts.serif};
                margin-bottom: 16px;
                color: ${theme.text};
              }
              .notes-content .disclaimer {
                margin-top: 20px;
                font-style: italic;
                color: ${theme.textMuted};
              }
            `}</style>
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
            Last updated: 1/5/2026 · Unofficial reference tool · Not legal advice
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
