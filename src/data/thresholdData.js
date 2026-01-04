/**
 * Export Control Threshold History
 *
 * To update this data:
 * - Add new rules to the array (most recent should be first)
 * - The first entry in the array is used as the "current" threshold
 * - Only include thresholds that exist for each rule (tppThreshold, pdThreshold, interconnectThreshold)
 * - notes field supports HTML for rich formatting
 * - url is the link to the official rule document
 */

export const thresholdHistory = [
    {
    date: "December 2, 2024",
    rule: "Foreign-Produced Direct Product Rule Additions, and Refinements to Controls for Advanced Computing and Semiconductor Manufacturing Items, 89 Fed. Reg. 96790 (Dec. 5, 2024)",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: ` 
      <p>HBM controls</p>
      <ul>
        <li>
        </li>
        <li>
        </li>
        <li>
        </li>
      </ul>
      <p></p>        
      <p></p>        
    `,
    url: "https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing"
  },  
    {
    date: "October 17, 2023",
    rule: "Implementation of Additional Export Controls: Certain Advanced Computing Items; Supercomputer and Semiconductor End Use; Updates and Corrections, 88 Fed. Reg. 73458 (Oct. 25, 2023)",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: ` 
      <p>Largely in response to the H800 and A800, the BIS established three new criteria for chip controls (see Methodology tab for more details):</p>
      <ul>
        <li>
          Total Processing Performance (“TPP”): Officially defined as “2 × MacTOP/s × bit length of the operation, aggregated over all processing units on the integrated circuit.” This essentially boils down to processing performance multiplied by bit length, i.e., the same as the prior performance threshold, and was set at the same level (4800).
        </li>
        <li>
          Performance Density (“PD”): Officially defined as “TPP divided by applicable die area,” which “is measured in millimeters squared and includes all die area of logic dies manufactured with a process node that uses a non-planar transistor architecture.” This metric was <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">designed</a> to prevent chipmakers from circumventing controls by including multiple chips on one integrated circuit, where each chip individually falls below the TPP threshold but when combined and interconnected at high bandwidth would exceed the threshold.
        </li>
        <li>
          Datacenter purpose: To avoid controlling the export of chips not meant for training AI models (e.g., gaming GPUs), the BIS included a criterion that controlled chips be “designed or marketed for use in datacenters.” Non-datacenter chips with a TPP ≥ 4800 would be subject to less strict controls.
        </li>
      </ul>
      <p>[add stuff about different licenses?]</p>        
      <p>H20 development, inference scaling, proposals to add memory-based thresholds</p>        
    `,
    url: "https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items-supercomputer-and"
  },
  {
    date: "October 7, 2022",
    rule: "Implementation of Additional Export Controls: Certain Advanced Computing and Semiconductor Manufacturing Items; Supercomputer and Semiconductor End Use; Entity List Modification, 87 Fed. Reg. 62186 (Oct. 13, 2022)",
    performanceThreshold: 4800,
    interconnectThreshold: "600 GB/s",
    notes: ` 
      <p>Initial semiconductor export controls targeting AI chips issued by the Bureau of Industry and Security (BIS). Used two criteria, both of which a chip had to meet to be subject to export controls:</p>
      <ul>
        <li>
          “Bit length per operation multiplied by processing performance measured in TOPS, aggregated over all processor units, of 4800 or more” (essentially TPP, although it was not called that at this time);
        </li>
        <li>
          “Aggregate bidirectional transfer rate over all inputs and outputs of 600 Gbyte/s or more to or from integrated circuits other than volatile memories” (i.e., interconnect bandwidth of 600 GB/s).
        </li>
      </ul>
      <p>Essentially <a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Overall%2C%20the%20rules%20appear%20to%20have%20been%20set%20precisely%20to%20make%20the%20A100%20into%20an%20effective%20threshold">used the NVIDIA A100 as the control threshold</a>: the TPP limit of 4800 was right below A100 TPP of 4992, and the interconnect limit of 600 GB/s was right at A100 mark. In other words, the 2022 framework establish that any chip less powerful than the A100 could be exported, and any chip as powerful or more powerful than the A100 was subject to controls.</p>
      <p>This regime proved flawed, specifically due to the use of interconnect as a threshold. NVIDIA <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">designed China-specific chips</a> with identical specs as controlled chips but with an interconnect bandwidth just below the control threshold, making them freely exportable (A100→A800, H100→H800). Even with reduced interconnect, the China-specific chips showed <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">“near identical performance in actual AI applications”</a> (<a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Thus%2C%20the,capabilities">at least</a> for frontier model training and long-context inference)</p>        
    `,
    url: "https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor"
  },
];
