import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Cell,
} from 'recharts';

// H200 exception thresholds
const THRESHOLDS = {
  TPP: 21000,
  MEM_BW: 6.5, // TB/s
};

// 25% tariff zones
const TARIFF_ZONES = [
  { x1: 14000, x2: 17500, y1: 4.5, y2: 5 },
  { x1: 20800, x2: 21100, y1: 5.8, y2: 6.2 },
];

// Zoom limits
const ZOOM_LIMITS = {
  TPP: { min: 5000, max: 110000 },
  MEM_BW: { min: 5, max: 25 },
};

// View presets
const VIEW_PRESETS = {
  exception: { maxTPP: 30000, maxMemBW: 10 },
  all: { maxTPP: 110000, maxMemBW: 25 },
};

// Parse memory bandwidth string like "7.7 TB/s" to numeric 7.7
const parseMemBW = (str) => {
  if (!str) return null;
  const match = str.match(/^([\d.]+)\s*TB\/s/i);
  return match ? parseFloat(match[1]) : null;
};

export default function H200ExceptionScatterPlot({
  chipData,
  theme,
  fonts,
  onChipSelect,
  selectedChip
}) {
  const [maxTPP, setMaxTPP] = useState(VIEW_PRESETS.all.maxTPP);
  const [maxMemBW, setMaxMemBW] = useState(VIEW_PRESETS.all.maxMemBW);

  // Filter chips with valid TPP and parseable memoryBandwidth
  const validChips = useMemo(() =>
    chipData
      .map(chip => ({ ...chip, memBW: parseMemBW(chip.memoryBandwidth) }))
      .filter(chip => chip.tpp != null && chip.memBW != null),
    [chipData]
  );

  // Group chips by TPP/memBW to detect stacked points
  const chipGroups = useMemo(() => {
    const groups = {};
    validChips.forEach(chip => {
      const roundedTPP = Math.round(chip.tpp);
      const roundedMemBW = Math.round(chip.memBW * 10) / 10;
      const key = `${roundedTPP}-${roundedMemBW}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(chip);
    });
    return groups;
  }, [validChips]);

  const getGroupKey = (chip) => {
    const roundedTPP = Math.round(chip.tpp);
    const roundedMemBW = Math.round(chip.memBW * 10) / 10;
    return `${roundedTPP}-${roundedMemBW}`;
  };

  const displayChips = useMemo(() => {
    return validChips.map(chip => {
      const key = getGroupKey(chip);
      const group = chipGroups[key];
      return {
        ...chip,
        stackCount: group.length,
        stackedChips: group,
        isStacked: group.length > 1
      };
    });
  }, [validChips, chipGroups]);

  const uniquePositions = useMemo(() => {
    const seen = new Set();
    return displayChips.filter(chip => {
      const key = getGroupKey(chip);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [displayChips]);

  const visibleChipCount = useMemo(() =>
    validChips.filter(chip => chip.tpp <= maxTPP && chip.memBW <= maxMemBW).length,
    [validChips, maxTPP, maxMemBW]
  );

  const statusColors = {
    controlled: theme.statusExceeds,
    nacEligible: '#ca8a04',
    caseByCase: '#a855f7',
    tariff: '#3b82f6',
    notControlled: theme.statusBelow,
  };

  const getChipColor = (chip) => {
    const status = chip.controlStatus?.toLowerCase() || '';
    if (status.includes('tariff')) {
      return statusColors.tariff;
    }
    if (status.includes('case-by-case')) {
      return statusColors.caseByCase;
    }
    if (status.includes('exportable') || status.includes('not controlled')) {
      return statusColors.notControlled;
    }
    if (status.includes('nac') || status.includes('aca')) {
      return statusColors.nacEligible;
    }
    if (status.includes('controlled')) {
      return statusColors.controlled;
    }
    return statusColors.notControlled;
  };

  const applyPreset = (preset) => {
    setMaxTPP(VIEW_PRESETS[preset].maxTPP);
    setMaxMemBW(VIEW_PRESETS[preset].maxMemBW);
  };

  const currentPreset = useMemo(() => {
    if (maxTPP === VIEW_PRESETS.exception.maxTPP && maxMemBW === VIEW_PRESETS.exception.maxMemBW) {
      return 'exception';
    }
    if (maxTPP === VIEW_PRESETS.all.maxTPP && maxMemBW === VIEW_PRESETS.all.maxMemBW) {
      return 'all';
    }
    return null;
  }, [maxTPP, maxMemBW]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const chip = payload[0].payload;
      const stackedChips = chip.stackedChips || [chip];
      const isStacked = stackedChips.length > 1;

      return (
        <div style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '320px',
        }}>
          {isStacked && (
            <div style={{
              fontSize: '11px',
              color: theme.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              paddingBottom: '8px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              {stackedChips.length} chips at this position
            </div>
          )}

          {stackedChips.map((c, idx) => {
            const chipColor = getChipColor(c);
            return (
              <div key={c.name} style={{
                marginBottom: idx < stackedChips.length - 1 ? '12px' : 0,
                paddingBottom: idx < stackedChips.length - 1 ? '12px' : 0,
                borderBottom: idx < stackedChips.length - 1 ? `1px solid ${theme.border}` : 'none',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: chipColor,
                    flexShrink: 0,
                  }} />
                  <div style={{
                    fontWeight: '600',
                    fontFamily: fonts.serif,
                    fontSize: '14px',
                    color: theme.text,
                  }}>
                    {c.name}
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: theme.textMuted,
                  marginBottom: '6px',
                  marginLeft: '16px',
                }}>
                  {c.manufacturer} · {c.architecture}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: chipColor,
                  fontWeight: '500',
                  marginLeft: '16px',
                }}>
                  {c.controlStatus}
                </div>
              </div>
            );
          })}

          <div style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: `1px solid ${theme.border}`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontFamily: fonts.mono,
            fontSize: '13px',
          }}>
            <div>
              <span style={{ color: theme.textMuted }}>TPP: </span>
              <span style={{ color: theme.text }}>{chip.tpp.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ color: theme.textMuted }}>Mem BW: </span>
              <span style={{ color: theme.text }}>{chip.memBW} TB/s</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getButtonStyle = (isActive) => ({
    padding: '6px 14px',
    fontSize: '12px',
    fontFamily: fonts.sans,
    fontWeight: '500',
    border: `1px solid ${isActive ? theme.accent : theme.border}`,
    borderRadius: '5px',
    background: isActive ? theme.accentBg : 'transparent',
    color: isActive ? theme.accent : theme.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  });

  const sliderContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: '200px',
  };

  const sliderStyle = {
    flex: 1,
    height: '4px',
    WebkitAppearance: 'none',
    appearance: 'none',
    background: theme.border,
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer',
  };

  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: theme.textSecondary,
  };

  const legendDotStyle = (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
  });

  const legendBoxStyle = (color, opacity = 0.2) => ({
    width: '16px',
    height: '12px',
    borderRadius: '2px',
    background: color,
    opacity: opacity,
    border: `1px solid ${color}`,
  });

  const formatTPP = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  // Use a distinct color for the H200 exception zone
  const exceptionColor = '#a855f7'; // purple (case-by-case eligible)
  const tariffColor = '#3b82f6'; // blue (25% tariff dots)
  const tariffZoneColor = '#a3e635'; // lime green (25% tariff zone shading)

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      padding: '24px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: fonts.serif,
          color: theme.text,
        }}>
          January 2026 H200 Exception Rules
        </h3>

        <div style={{
          fontSize: '13px',
          color: theme.textMuted,
          fontFamily: fonts.mono,
        }}>
          Showing {visibleChipCount} of {validChips.length} chips
        </div>
      </div>

      {/* Zoom Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px',
        padding: '16px',
        background: theme.bgAlt,
        borderRadius: '6px',
        border: `1px solid ${theme.border}`,
      }}>
        {/* Preset buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px',
        }}>
          <span style={{
            fontSize: '11px',
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500',
            marginRight: '4px',
          }}>
            Presets:
          </span>
          <button
            onClick={() => applyPreset('exception')}
            style={getButtonStyle(currentPreset === 'exception')}
          >
            Exception Focus
          </button>
          <button
            onClick={() => applyPreset('all')}
            style={getButtonStyle(currentPreset === 'all')}
          >
            All Chips
          </button>
        </div>

        {/* TPP Slider (X-axis) */}
        <div style={sliderContainerStyle}>
          <span style={{
            fontSize: '12px',
            color: theme.textMuted,
            fontFamily: fonts.mono,
            minWidth: '70px',
          }}>
            Max TPP:
          </span>
          <input
            type="range"
            min={ZOOM_LIMITS.TPP.min}
            max={ZOOM_LIMITS.TPP.max}
            step={1000}
            value={maxTPP}
            onChange={(e) => setMaxTPP(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={{
            fontSize: '13px',
            color: theme.text,
            fontFamily: fonts.mono,
            minWidth: '40px',
            textAlign: 'right',
          }}>
            {formatTPP(maxTPP)}
          </span>
        </div>

        {/* Memory BW Slider (Y-axis) */}
        <div style={sliderContainerStyle}>
          <span style={{
            fontSize: '12px',
            color: theme.textMuted,
            fontFamily: fonts.mono,
            minWidth: '70px',
          }}>
            Max BW:
          </span>
          <input
            type="range"
            min={ZOOM_LIMITS.MEM_BW.min}
            max={ZOOM_LIMITS.MEM_BW.max}
            step={0.5}
            value={maxMemBW}
            onChange={(e) => setMaxMemBW(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={{
            fontSize: '13px',
            color: theme.text,
            fontFamily: fonts.mono,
            minWidth: '55px',
            textAlign: 'right',
          }}>
            {maxMemBW} TB/s
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={450}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 90 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.border}
            strokeOpacity={0.5}
          />

          {/* Shaded region: case-by-case licensing permitted (bottom-left) */}
          <ReferenceArea
            x1={0}
            x2={THRESHOLDS.TPP}
            y1={0}
            y2={THRESHOLDS.MEM_BW}
            fill={exceptionColor}
            fillOpacity={0.10}
          />

          {/* Shaded regions: 25% tariff zones */}
          {TARIFF_ZONES.map((zone, i) => (
            <ReferenceArea
              key={`tariff-zone-${i}`}
              x1={zone.x1}
              x2={zone.x2}
              y1={zone.y1}
              y2={zone.y2}
              fill={tariffZoneColor}
              fillOpacity={0.25}
            />
          ))}

          {/* Threshold reference lines */}
          <ReferenceLine
            y={THRESHOLDS.MEM_BW}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: '6.5 TB/s',
              position: 'left',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />
          <ReferenceLine
            x={THRESHOLDS.TPP}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: 'TPP 21,000',
              position: 'top',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />

          <XAxis
            dataKey="tpp"
            type="number"
            domain={[0, maxTPP]}
            allowDataOverflow={true}
            name="TPP"
            tick={{ fill: theme.textMuted, fontSize: 12, fontFamily: fonts.mono }}
            tickLine={{ stroke: theme.border }}
            axisLine={{ stroke: theme.border }}
            tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
            label={{
              value: 'Total Processing Performance (TPP)',
              position: 'bottom',
              offset: 35,
              fill: theme.textSecondary,
              fontSize: 13,
              fontFamily: fonts.sans,
            }}
          />
          <YAxis
            dataKey="memBW"
            type="number"
            domain={[0, maxMemBW]}
            allowDataOverflow={true}
            name="Memory BW"
            tick={{ fill: theme.textMuted, fontSize: 12, fontFamily: fonts.mono }}
            tickLine={{ stroke: theme.border }}
            axisLine={{ stroke: theme.border }}
            label={{
              value: 'Memory Bandwidth (TB/s)',
              angle: -90,
              position: 'outsideLeft',
              offset: 20,
              dx: -20,
              fill: theme.textSecondary,
              fontSize: 13,
              fontFamily: fonts.sans,
              style: { textAnchor: 'middle' }
            }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: '3 3', stroke: theme.textMuted }}
          />

          <Scatter
            data={uniquePositions}
            onClick={(data) => onChipSelect && onChipSelect(data.name)}
            style={{ cursor: 'pointer' }}
          >
            {uniquePositions.map((chip, index) => {
              const isSelected = chip.stackedChips?.some(c => c.name === selectedChip);
              const isStacked = chip.isStacked;
              const baseRadius = isStacked ? 8 : 6;
              const radius = isSelected ? baseRadius + 2 : baseRadius;

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={getChipColor(chip)}
                  stroke={isSelected ? theme.text : (isStacked ? theme.textMuted : 'transparent')}
                  strokeWidth={isSelected ? 2 : (isStacked ? 2 : 0)}
                  r={radius}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: `1px solid ${theme.border}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '11px',
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500',
          }}>
            Regions:
          </span>
          <div style={legendItemStyle}>
            <div style={legendBoxStyle(exceptionColor, 0.3)}></div>
            <span>Case-by-case licensing permitted</span>
          </div>
          <div style={legendItemStyle}>
            <div style={legendBoxStyle(tariffZoneColor, 0.5)}></div>
            <span>25% Tariff zones</span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '11px',
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500',
          }}>
            Chips:
          </span>
          <div style={legendItemStyle}>
            <div style={legendDotStyle(statusColors.controlled)}></div>
            <span>Controlled</span>
          </div>
          <div style={legendItemStyle}>
            <div style={legendDotStyle(statusColors.caseByCase)}></div>
            <span>Case-by-case eligible</span>
          </div>
          <div style={legendItemStyle}>
            <div style={legendDotStyle(statusColors.tariff)}></div>
            <span>25% Tariff</span>
          </div>
          <div style={legendItemStyle}>
            <div style={legendDotStyle(statusColors.nacEligible)}></div>
            <span>NAC/ACA Eligible</span>
          </div>
          <div style={legendItemStyle}>
            <div style={legendDotStyle(statusColors.notControlled)}></div>
            <span>Not Controlled / Exportable</span>
          </div>
          <div style={legendItemStyle}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'transparent',
              border: `2px solid ${theme.textMuted}`,
            }}></div>
            <span>Multiple chips (hover to see all)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
