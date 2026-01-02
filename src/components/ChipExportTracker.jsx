import React, { useState, useMemo } from 'react';
import { chipData } from '../data/chipData';
import { thresholdHistory } from '../data/thresholdData';

export default function ChipExportTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sortConfig, setSortConfig] = useState({ key: 'tpp', direction: 'desc' });
  const [selectedChip, setSelectedChip] = useState(null);
  const [showInterconnectTooltip, setShowInterconnectTooltip] = useState(false);

  // Calculator state
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

      // Handle string sorting for name and controlStatus columns
      if (sortConfig.key === 'name' || sortConfig.key === 'controlStatus') {
        const aStr = aVal ?? '';
        const bStr = bVal ?? '';
        return sortConfig.direction === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      }

      // Numeric sorting for other columns
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
    if (!tpp && !pd) return { status: 'unknown', color: '#6b7280' };
    const exceedsTPP = tpp && tpp > currentThresholds.tppThreshold;
    const exceedsPD = pd && pd > currentThresholds.pdThreshold;
    if (exceedsTPP || exceedsPD) {
      return { status: 'Likely Controlled', color: '#dc2626' };
    }
    return { status: 'Below Thresholds', color: '#16a34a' };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #0c0c0c 100%)',
      color: '#e5e5e5',
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace",
      padding: '0',
      margin: '0'
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #2a2a3e',
        padding: '24px 48px',
        background: 'rgba(10, 10, 20, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#ef4444',
              borderRadius: '2px',
              boxShadow: '0 0 20px #ef444480'
            }} />
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              letterSpacing: '-0.5px',
              margin: 0,
              color: '#ffffff'
            }}>
              Export Control Toolkit
            </h1>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            margin: '8px 0 0 28px',
            letterSpacing: '0.3px'
          }}>
            Tools for tracking and understanding export controls on AI chips
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        padding: '0 48px',
        background: 'rgba(20, 20, 35, 0.5)',
        borderBottom: '1px solid #2a2a3e'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {['dashboard', 'calculator', 'thresholds', 'methodology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 24px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #ef4444' : '2px solid transparent',
                color: activeTab === tab ? '#ffffff' : '#6b7280',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 48px' }}>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Current Thresholds Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e1e30 0%, #2a2a40 100%)',
                border: '1px solid #3a3a50',
                borderRadius: '8px',
                padding: '20px 24px'
              }}>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  TPP Threshold
                </div>
                <div style={{ fontSize: '28px', fontWeight: '600', color: '#ef4444' }}>
                  {currentThresholds.tppThreshold.toLocaleString()}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1e1e30 0%, #2a2a40 100%)',
                border: '1px solid #3a3a50',
                borderRadius: '8px',
                padding: '20px 24px'
              }}>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  PD Threshold
                </div>
                <div style={{ fontSize: '28px', fontWeight: '600', color: '#ef4444' }}>
                  {currentThresholds.pdThreshold}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1e1e30 0%, #2a2a40 100%)',
                border: '1px solid #3a3a50',
                borderRadius: '8px',
                padding: '20px 24px'
              }}>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Current Rule
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>
                  {currentThresholds.rule}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {currentThresholds.date}
                </div>
              </div>
            </div>

            {/* Chip Table */}
            <div style={{
              background: 'rgba(20, 20, 35, 0.5)',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(30, 30, 50, 0.8)' }}>
                    {[
                      { key: 'name', label: 'Chip' },
                      { key: 'tpp', label: 'TPP' },
                      { key: 'pd', label: 'PD' },
                      { key: 'interconnect', label: 'Interconnect', hasTooltip: true },
                      { key: 'controlStatus', label: 'Status' }
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        style={{
                          padding: '14px 20px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#9ca3af',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #2a2a3e',
                          userSelect: 'none',
                          position: col.hasTooltip ? 'relative' : 'static'
                        }}
                      >
                        {col.label}
                        {col.hasTooltip && (
                          <span
                            onMouseEnter={() => setShowInterconnectTooltip(true)}
                            onMouseLeave={() => setShowInterconnectTooltip(false)}
                            style={{
                              marginLeft: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              border: '1px solid #6b7280',
                              fontSize: '9px',
                              color: '#6b7280',
                              cursor: 'help',
                              fontWeight: '600',
                              verticalAlign: 'middle'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            i
                          </span>
                        )}
                        {col.hasTooltip && showInterconnectTooltip && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: '0',
                              marginTop: '8px',
                              width: '380px',
                              padding: '16px',
                              background: 'linear-gradient(135deg, #1e1e30 0%, #252540 100%)',
                              border: '1px solid #3a3a50',
                              borderRadius: '8px',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                              zIndex: 1000,
                              textTransform: 'none',
                              letterSpacing: 'normal',
                              fontWeight: '400',
                              fontSize: '13px',
                              lineHeight: '1.6',
                              color: '#9ca3af',
                              cursor: 'default'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Interconnect bandwidth was used as an export control threshold in the 2022 controls but was removed in 2023 and replaced with PD. However, interconnect remains an important metric, and Nvidia has manipulated interconnect on China-specific chips to circumvent export controls. Interconnect is arguably increasingly important given the risk of test-time compute scaling.{' '}
                            <a
                              href="#"
                              style={{
                                color: '#ef4444',
                                textDecoration: 'underline',
                                textUnderlineOffset: '2px'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Some analysts have argued
                            </a>{' '}
                            for the re-implementation of interconnect as a control threshold.
                          </div>
                        )}
                        {sortConfig.key === col.key && (
                          <span style={{ marginLeft: '6px', opacity: 0.6 }}>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
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
                        background: selectedChip === chip.name ? 'rgba(239, 68, 68, 0.1)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a2e' }}>
                        <div style={{ fontWeight: '500', color: '#ffffff' }}>{chip.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {chip.manufacturer} · {chip.architecture}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a2e' }}>
                        <span style={{
                          color: chip.tpp && chip.tpp > currentThresholds.tppThreshold ? '#ef4444' : '#10b981',
                          fontWeight: '600'
                        }}>
                          {chip.tpp ? chip.tpp.toLocaleString() : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a2e' }}>
                        <span style={{
                          color: chip.pd && chip.pd > currentThresholds.pdThreshold ? '#ef4444' : '#10b981',
                          fontWeight: '600'
                        }}>
                          {chip.pd ? chip.pd.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a2e', color: '#9ca3af' }}>
                        {chip.interconnect ? chip.interconnect.toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a2e' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background: chip.controlStatus.includes('Controlled') ? 'rgba(239, 68, 68, 0.2)' :
                                      chip.controlStatus === 'Unknown' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: chip.controlStatus.includes('Controlled') ? '#fca5a5' :
                                 chip.controlStatus === 'Unknown' ? '#9ca3af' : '#6ee7b7'
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
              <div style={{
                marginTop: '24px',
                background: 'linear-gradient(135deg, #1e1e30 0%, #252540 100%)',
                border: '1px solid #3a3a50',
                borderRadius: '8px',
                padding: '24px'
              }}>
                {(() => {
                  const chip = chipData.find(c => c.name === selectedChip);
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>{chip.name}</h3>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                            {chip.manufacturer} · {chip.architecture} · Released {chip.releaseDate}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedChip(null)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #3a3a50',
                            color: '#6b7280',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontFamily: 'inherit'
                          }}
                        >
                          Close
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>FP4</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.fp4 ? `${chip.fp4} TFLOPS` : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>FP8</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.fp8 ? `${chip.fp8} TFLOPS` : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>FP16</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.fp16 ? `${chip.fp16} TFLOPS` : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>BF16</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.bf16 ? `${chip.bf16} TFLOPS` : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>TF32</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.tf32 ? `${chip.tf32} TFLOPS` : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>INT8</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.int8 ? `${chip.int8} TOPS` : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>HBM</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.hbmCapacity || '—'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Memory BW</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.memoryBandwidth || '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>TDP</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.tdp || '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>ECCN</div>
                          <div style={{ fontSize: '16px', color: '#ffffff' }}>{chip.eccn || '—'}</div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '6px' }}>Notes</div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>{chip.notes}</p>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '6px' }}>Sources</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {chip.sources.map((src, i) => (
                            src.url ? (
                              <a
                                key={i}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '11px',
                                  color: '#9ca3af',
                                  background: 'rgba(255,255,255,0.05)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                  e.target.style.color = '#fca5a5';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'rgba(255,255,255,0.05)';
                                  e.target.style.color = '#9ca3af';
                                }}
                              >
                                {src.name}
                              </a>
                            ) : (
                              <span key={i} style={{
                                fontSize: '11px',
                                color: '#6b7280',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '4px 8px',
                                borderRadius: '4px'
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
          <div style={{ maxWidth: '800px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e1e30 0%, #252540 100%)',
              border: '1px solid #3a3a50',
              borderRadius: '8px',
              padding: '32px'
            }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#ffffff' }}>TPP & Performance Density Calculator</h2>
              <p style={{ margin: '0 0 28px', fontSize: '13px', color: '#6b7280' }}>
                Estimate export control metrics for any chip
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Peak Performance (TFLOPS/TOPS)
                  </label>
                  <input
                    type="number"
                    value={calcInputs.flops}
                    onChange={e => setCalcInputs(prev => ({ ...prev, flops: e.target.value }))}
                    placeholder="e.g., 1979"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid #3a3a50',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Bit Length
                  </label>
                  <select
                    value={calcInputs.bitLength}
                    onChange={e => setCalcInputs(prev => ({ ...prev, bitLength: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid #3a3a50',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="4">4-bit (FP4)</option>
                    <option value="8">8-bit (FP8, INT8)</option>
                    <option value="16">16-bit (FP16, BF16)</option>
                    <option value="32">32-bit (FP32, TF32)</option>
                    <option value="64">64-bit (FP64)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Die Area (mm²)
                  </label>
                  <input
                    type="number"
                    value={calcInputs.dieArea}
                    onChange={e => setCalcInputs(prev => ({ ...prev, dieArea: e.target.value }))}
                    placeholder="e.g., 814"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid #3a3a50',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#9ca3af'
                  }}>
                    <input
                      type="checkbox"
                      checked={calcInputs.isSparse}
                      onChange={e => setCalcInputs(prev => ({ ...prev, isSparse: e.target.checked }))}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    Performance figure includes sparsity (will halve)
                  </label>
                </div>
              </div>

              {/* Results */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '24px',
                marginTop: '32px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      Calculated TPP
                    </div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '600',
                      color: calculatedTPP && calculatedTPP > currentThresholds.tppThreshold ? '#ef4444' : '#10b981'
                    }}>
                      {calculatedTPP ? calculatedTPP.toLocaleString() : '—'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Threshold: {currentThresholds.tppThreshold.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      Calculated PD
                    </div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '600',
                      color: calculatedPD && calculatedPD > currentThresholds.pdThreshold ? '#ef4444' : calculatedPD ? '#10b981' : '#6b7280'
                    }}>
                      {calculatedPD ? calculatedPD.toFixed(2) : '—'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Threshold: {currentThresholds.pdThreshold}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      Control Assessment
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: (() => {
                        const status = getControlStatus(calculatedTPP, calculatedPD);
                        return status.color;
                      })()
                    }}>
                      {(() => {
                        if (!calculatedTPP) return 'Enter values';
                        const status = getControlStatus(calculatedTPP, calculatedPD);
                        return status.status;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula Display */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#fca5a5',
                fontFamily: 'inherit'
              }}>
                <strong>Formula:</strong> TPP = {calcInputs.isSparse ? '(TFLOPS ÷ 2)' : 'TFLOPS'} × {calcInputs.bitLength}
                {calcInputs.dieArea && <span> &nbsp;|&nbsp; PD = TPP ÷ {calcInputs.dieArea}mm²</span>}
              </div>
            </div>

            {/* Guidance Box */}
            <div style={{
              marginTop: '24px',
              background: 'rgba(20, 20, 35, 0.5)',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Input Guidance
              </h3>
              <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.7' }}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong style={{ color: '#ffffff' }}>Performance:</strong> Use dense matrix performance, not sparse. If your datasheet shows sparse figures (common for NVIDIA), check for footnotes and halve the value, or use the checkbox above.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong style={{ color: '#ffffff' }}>Bit Length:</strong> Use the bit length that yields the highest TPP. For most modern AI chips, this is 8-bit (FP8 or INT8).
                </p>
                <p style={{ margin: '0' }}>
                  <strong style={{ color: '#ffffff' }}>Die Area:</strong> Include all logic dies with non-planar transistors (typically ≤16nm). Exclude HBM stacks and I/O dies on separate process nodes. For chiplet designs, sum relevant compute dies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px', color: '#ffffff' }}>Export Control Threshold History</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {thresholdHistory.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    background: idx === thresholdHistory.length - 1
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(30, 30, 50, 0.8) 100%)'
                      : 'linear-gradient(135deg, #1e1e30 0%, #252540 100%)',
                    border: idx === thresholdHistory.length - 1 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #3a3a50',
                    borderRadius: '8px',
                    padding: '24px',
                    position: 'relative'
                  }}
                >
                  {idx === thresholdHistory.length - 1 && (
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: '#ef4444',
                      fontWeight: '600'
                    }}>
                      Current
                    </span>
                  )}
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{rule.date}</div>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>
                    <a
                      href={rule.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#ffffff',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.target.style.color = '#ffffff'}
                    >
                      {rule.rule}
                    </a>
                  </h3>
                  <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>TPP Threshold: </span>
                      <span style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>{rule.tppThreshold.toLocaleString()}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>PD Threshold: </span>
                      <span style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>{rule.pdThreshold}</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>{rule.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methodology Tab */}
        {activeTab === 'methodology' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e1e30 0%, #252540 100%)',
              border: '1px solid #3a3a50',
              borderRadius: '8px',
              padding: '32px'
            }}>
              <h2 style={{ margin: '0 0 24px', fontSize: '18px', color: '#ffffff' }}>Calculation Methodology</h2>

              <section style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Total Processing Performance (TPP)
                </h3>
                <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.8' }}>
                  <p style={{ margin: '0 0 12px' }}>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#ef4444',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px'
                      }}
                    >
                      Per EAR
                    </a>: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>TPP = 2 × MacTOPS × bit_length</code>, aggregated over all processing units.
                  </p>
                  <p style={{ margin: '0 0 12px' }}>
                    The factor of 2 reflects industry convention of counting multiply-accumulate (D = A × B + C) as two operations. Since datasheets typically report FLOPS/TOPS already using this convention, the practical formula simplifies to:
                  </p>
                  <p style={{ margin: '0 0 12px' }}>
                    <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>TPP = TFLOPS (dense) × bit_length</code>
                  </p>
                  <p style={{ margin: 0, padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                    <strong>Critical:</strong> Use dense matrix performance. NVIDIA datasheets often show sparse performance (2× dense) with a footnote. Sparse figures must be halved.
                  </p>
                </div>
              </section>

              <section style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Performance Density (PD)
                </h3>
                <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.8' }}>
                  <p style={{ margin: '0 0 12px' }}>
                    <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>PD = TPP ÷ applicable_die_area</code>
                  </p>
                  <p style={{ margin: '0 0 12px' }}>
                    "Applicable die area" includes all logic dies manufactured with non-planar transistor architecture (typically ≤16nm processes including FinFET and GAA).
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Include:</strong> All compute die area including caches.<br />
                    <strong>Exclude:</strong> Separate HBM stacks, I/O dies on older process nodes.
                  </p>
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: '14px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Data Sources
                </h3>
                <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.8' }}>
                  <p style={{ margin: '0 0 12px' }}>
                    This tracker compiles data from manufacturer whitepapers, official datasheets, BIS final rules, and industry analysis (SemiAnalysis, CSET). Where official figures are unavailable, estimates are noted.
                  </p>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>
                    This tool is for informational purposes only. It does not constitute legal advice. Consult qualified export control counsel for compliance determinations.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #2a2a3e',
        padding: '24px 48px',
        marginTop: '48px',
        background: 'rgba(10, 10, 20, 0.5)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Unofficial reference tool. Not legal advice. Data may be incomplete or outdated.
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Last updated: January 2025
          </div>
        </div>
      </footer>
    </div>
  );
}
