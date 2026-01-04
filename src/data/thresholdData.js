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
    date: "October 17, 2023",
    rule: "Updated Controls",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: "Established TPP and PD framework to address Nvidia loopholes. Added H800/A800 variants. Expanded geographic scope beyond China.",
    url: "#"
  },
  {
    date: "October 7, 2022",
    rule: "Implementation of Additional Export Controls: Certain Advanced Computing and Semiconductor Manufacturing Items; Supercomputer and Semiconductor End Use; Entity List Modification, 87 Fed. Reg. 62186 (Oct. 13, 2022)",
    tppThreshold: 4800,
    interconnectThreshold: "600 GB/s",
    notes: ` 
      <p>Initial semiconductor export controls targeting AI chips. Used two criteria, both of which a chip had to meet to be subject to export controls:</p>
      <ul>
        <li>
          Bit length per operation multiplied by processing performance measured in TOPS, aggregated over all processor units, of 4800 or more (essentially TPP, although it was not called that at this time)
        </li>
        <li>
          Aggregate bidirectional transfer rate over all inputs and outputs of 600 Gbyte/s or more to or from integrated circuits other than volatile memories (i.e., interconnect bandwidth of 600 GB/s)
        </li>
      </ul>
      <p>Essentially <a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Overall%2C%20the%20rules%20appear%20to%20have%20been%20set%20precisely%20to%20make%20the%20A100%20into%20an%20effective%20threshold">used the NVIDIA A100 as the control threshold</a>: the TPP limit of 4800 was right below A100 TPP, and the interconnect limit of 600 GB/s was right at A100 mark. I.e., any chip less powerful than the A100 could be exported, any chip as powerful or more powerful than the A100 was subject to controls.</p>
      <p>This regime proved flawed, specifically the use of interconnect as a threshold. NVIDIA <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">designed China-specific chips</a> with identical specs as controlled chips but with an interconnect bandwidth just below the control threshold, making them freely exportable. Even with reduced interconnect, the China-specific chips showed <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">“near identical performance in actual AI applications”</a> (<a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Thus%2C%20the,capabilities">at least</a> for frontier model training and long-context inference)</p>        
    `,
    url: "https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor"
  },
];
