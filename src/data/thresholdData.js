/**
 * Export Control Threshold History
 *
 * To update this data:
 * - Add new rules to the array (most recent should be last)
 * - The last entry in the array is used as the "current" threshold
 * - tppThreshold and pdThreshold are the control thresholds
 * - url is the link to the official rule document
 */

export const thresholdHistory = [
  {
    date: "October 7, 2022",
    rule: "Initial AI Chip Controls",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: "First semiconductor export controls targeting AI chips. Established TPP and PD framework.",
    url: "#"
  },
  {
    date: "October 17, 2023",
    rule: "Updated Controls",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: "Closed loopholes. Added H800/A800 variants. Expanded geographic scope beyond China.",
    url: "#"
  },
  {
    date: "January 15, 2025",
    rule: "AI Diffusion Rule",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: "Three-tier country framework. Additional controls on model weights and data centers.",
    url: "#"
  }
];
