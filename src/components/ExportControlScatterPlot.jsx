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

// Threshold constants from export control rules
const THRESHOLDS = {
  TPP: { low: 1600, mid: 2400, high: 4800 },
  PD: { low: 1.6, mid: 3.2, high: 5.92 }
};

// Zoom limits
const ZOOM_LIMITS = {
  PD: { min: 8, max: 70 },
  TPP: { min: 5000, max: 110000 }
};

// View presets
const VIEW_PRESETS = {
  threshold: { maxPD: 10, maxTPP: 6000 },
  all: { maxPD: 70, maxTPP: 110000 }
};

export default function ExportControlScatterPlot({
  chipData,
  theme,
  fonts,
  onChipSelect,
  selectedChip
}) {
  // Zoom state - controlled by sliders
  const [maxPD, setMaxPD] = useState(VIEW_PRESETS.all.maxPD);
  const [maxTPP, setMaxTPP] = useState(VIEW_PRESETS.all.maxTPP);

  // Filter chips with valid TPP and PD values
  const validChips = useMemo(() =>
    chipData.filter(chip => chip.tpp != null && chip.pd != null),
    [chipData]
  );

  // Group chips by TPP/PD to detect stacked points
  // Round to 2 decimal places to group chips that are very close together
  const chipGroups = useMemo(() => {
    const groups = {};
    validChips.forEach(chip => {
      // Round TPP to nearest integer and PD to 2 decimal places for grouping
      const roundedTPP = Math.round(chip.tpp);
      const roundedPD = Math.round(chip.pd * 100) / 100;
      const key = `${roundedTPP}-${roundedPD}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(chip);
    });
    return groups;
  }, [validChips]);

  // Helper to get group key for a chip
  const getGroupKey = (chip) => {
    const roundedTPP = Math.round(chip.tpp);
    const roundedPD = Math.round(chip.pd * 100) / 100;
    return `${roundedTPP}-${roundedPD}`;
  };

  // Create display data with stack info
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

  // Get unique positions (for rendering - avoid duplicate dots)
  const uniquePositions = useMemo(() => {
    const seen = new Set();
    return displayChips.filter(chip => {
      const key = getGroupKey(chip);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [displayChips]);

  // Count visible chips
  const visibleChipCount = useMemo(() =>
    validChips.filter(chip => chip.pd <= maxPD && chip.tpp <= maxTPP).length,
    [validChips, maxPD, maxTPP]
  );

  // Status colors matching the main component
  const statusColors = {
    controlled: theme.statusExceeds,      // red
    nacEligible: '#ca8a04',               // amber
    notControlled: theme.statusBelow,     // green
  };

  // Determine chip control status for coloring
  const getChipColor = (chip) => {
    const status = chip.controlStatus?.toLowerCase() || '';

    // Check for exportable/potentially exportable first (green)
    if (status.includes('exportable') || status.includes('not controlled')) {
      return statusColors.notControlled;
    }

    // Check for NAC/ACA eligible (amber)
    if (status.includes('nac') || status.includes('aca')) {
      return statusColors.nacEligible;
    }

    // Check for controlled (red)
    if (status.includes('controlled')) {
      return statusColors.controlled;
    }

    // Default based on TPP/PD thresholds
    if (chip.tpp >= THRESHOLDS.TPP.high ||
        (chip.tpp >= THRESHOLDS.TPP.low && chip.pd >= THRESHOLDS.PD.high)) {
      return statusColors.controlled;
    }
    return statusColors.notControlled;
  };

  // Apply preset
  const applyPreset = (preset) => {
    setMaxPD(VIEW_PRESETS[preset].maxPD);
    setMaxTPP(VIEW_PRESETS[preset].maxTPP);
  };

  // Check if current view matches a preset
  const currentPreset = useMemo(() => {
    if (maxPD === VIEW_PRESETS.threshold.maxPD && maxTPP === VIEW_PRESETS.threshold.maxTPP) {
      return 'threshold';
    }
    if (maxPD === VIEW_PRESETS.all.maxPD && maxTPP === VIEW_PRESETS.all.maxTPP) {
      return 'all';
    }
    return null;
  }, [maxPD, maxTPP]);

  // Custom tooltip component - shows all stacked chips
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
              <span style={{ color: theme.textMuted }}>PD: </span>
              <span style={{ color: theme.text }}>{chip.pd.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Button style
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

  // Slider container style
  const sliderContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: '200px',
  };

  // Slider style
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

  // Legend item style
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

  // Format TPP for display
  const formatTPP = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

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
          Export Control Threshold Map
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
            onClick={() => applyPreset('threshold')}
            style={getButtonStyle(currentPreset === 'threshold')}
          >
            Threshold Focus
          </button>
          <button
            onClick={() => applyPreset('all')}
            style={getButtonStyle(currentPreset === 'all')}
          >
            All Chips
          </button>
        </div>

        {/* PD Slider (X-axis) */}
        <div style={sliderContainerStyle}>
          <span style={{
            fontSize: '12px',
            color: theme.textMuted,
            fontFamily: fonts.mono,
            minWidth: '70px',
          }}>
            Max PD:
          </span>
          <input
            type="range"
            min={ZOOM_LIMITS.PD.min}
            max={ZOOM_LIMITS.PD.max}
            value={maxPD}
            onChange={(e) => setMaxPD(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={{
            fontSize: '13px',
            color: theme.text,
            fontFamily: fonts.mono,
            minWidth: '40px',
            textAlign: 'right',
          }}>
            {maxPD}
          </span>
        </div>

        {/* TPP Slider (Y-axis) */}
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
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={450}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 70 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.border}
            strokeOpacity={0.5}
          />

          {/* Background regions for control zones */}
          {/* Not Controlled region (green) - bottom area */}
          <ReferenceArea
            x1={0}
            x2={THRESHOLDS.PD.mid}
            y1={0}
            y2={THRESHOLDS.TPP.low}
            fill={statusColors.notControlled}
            fillOpacity={0.08}
          />
          <ReferenceArea
            x1={THRESHOLDS.PD.mid}
            x2={THRESHOLDS.PD.high}
            y1={0}
            y2={THRESHOLDS.TPP.low}
            fill={statusColors.notControlled}
            fillOpacity={0.08}
          />
          <ReferenceArea
            x1={THRESHOLDS.PD.high}
            x2={maxPD}
            y1={0}
            y2={THRESHOLDS.TPP.low}
            fill={statusColors.notControlled}
            fillOpacity={0.08}
          />
          {/* Not controlled - left side below NAC zone */}
          <ReferenceArea
            x1={0}
            x2={THRESHOLDS.PD.low}
            y1={THRESHOLDS.TPP.low}
            y2={THRESHOLDS.TPP.high}
            fill={statusColors.notControlled}
            fillOpacity={0.08}
          />

          {/* NAC/ACA Eligible region (amber) */}
          {/* .b.1: 2400 <= TPP < 4800 AND 1.6 <= PD < 5.92 */}
          <ReferenceArea
            x1={THRESHOLDS.PD.low}
            x2={THRESHOLDS.PD.high}
            y1={THRESHOLDS.TPP.mid}
            y2={THRESHOLDS.TPP.high}
            fill={statusColors.nacEligible}
            fillOpacity={0.15}
          />
          {/* .b.2: TPP >= 1600 AND 3.2 <= PD < 5.92 */}
          <ReferenceArea
            x1={THRESHOLDS.PD.mid}
            x2={THRESHOLDS.PD.high}
            y1={THRESHOLDS.TPP.low}
            y2={THRESHOLDS.TPP.mid}
            fill={statusColors.nacEligible}
            fillOpacity={0.15}
          />

          {/* License Required region (red) */}
          {/* .a.1: TPP >= 4800 */}
          <ReferenceArea
            x1={0}
            x2={maxPD}
            y1={THRESHOLDS.TPP.high}
            y2={maxTPP}
            fill={statusColors.controlled}
            fillOpacity={0.12}
          />
          {/* .a.2: TPP >= 1600 AND PD >= 5.92 */}
          <ReferenceArea
            x1={THRESHOLDS.PD.high}
            x2={maxPD}
            y1={THRESHOLDS.TPP.low}
            y2={THRESHOLDS.TPP.high}
            fill={statusColors.controlled}
            fillOpacity={0.12}
          />

          {/* Threshold reference lines - horizontal (TPP) */}
          <ReferenceLine
            y={THRESHOLDS.TPP.high}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: 'TPP 4,800',
              position: 'left',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />
          <ReferenceLine
            y={THRESHOLDS.TPP.mid}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: 'TPP 2,400',
              position: 'left',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />
          <ReferenceLine
            y={THRESHOLDS.TPP.low}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: 'TPP 1,600',
              position: 'left',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />

          {/* Threshold reference lines - vertical (PD) */}
          <ReferenceLine
            x={THRESHOLDS.PD.high}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: 'PD 5.92',
              position: 'top',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />
          <ReferenceLine
            x={THRESHOLDS.PD.mid}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: 'PD 3.2',
              position: 'top',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />
          <ReferenceLine
            x={THRESHOLDS.PD.low}
            stroke={theme.textMuted}
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{
              value: 'PD 1.6',
              position: 'top',
              fill: theme.textMuted,
              fontSize: 11,
              fontFamily: fonts.mono,
            }}
          />

          <XAxis
            dataKey="pd"
            type="number"
            domain={[0, maxPD]}
            allowDataOverflow={true}
            name="PD"
            tick={{ fill: theme.textMuted, fontSize: 12, fontFamily: fonts.mono }}
            tickLine={{ stroke: theme.border }}
            axisLine={{ stroke: theme.border }}
            label={{
              value: 'Performance Density (PD)',
              position: 'bottom',
              offset: 35,
              fill: theme.textSecondary,
              fontSize: 13,
              fontFamily: fonts.sans,
            }}
          />
          <YAxis
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
              angle: -90,
              position: 'insideLeft',
              offset: 10,
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
              // For stacked chips, use a gradient effect or ring
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
            <div style={legendBoxStyle(statusColors.controlled, 0.3)}></div>
            <span>License Required (3A090.a)</span>
          </div>
          <div style={legendItemStyle}>
            <div style={legendBoxStyle(statusColors.nacEligible, 0.4)}></div>
            <span>NAC/ACA Eligible (3A090.b)</span>
          </div>
          <div style={legendItemStyle}>
            <div style={legendBoxStyle(statusColors.notControlled, 0.3)}></div>
            <span>Not Controlled</span>
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
