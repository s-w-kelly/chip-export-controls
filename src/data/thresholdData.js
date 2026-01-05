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
    date: "2026",
    rule: "Current status",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: ` 
      <p>The 2023 TPP/PD framework remains in place (with the same thresholds), and was essentially <a href="https://newsletter.semianalysis.com/p/wafer-wars-deciphering-latest-restrictions#:~:text=The%20short%20answer%20is%2C%20no%2E%20Nvidia%20has%20no%20way%20to%20really%20game%20these%20rules%20even%20with%20a%20brand%2Dnew%20clean%20sheet%20design%2E">successful at closing the loopholes</a> the BIS was targeting. 
      However, the rise of reasoning models and test-time compute scaling in 2024 changed the landscape of what specifications were desireable for chips. For instance, the H20, a significantly downgraded China-specific Hopper chip NVIDIA designed in response to the 2023 controls, suddenly became powerful: the H20 is <a href="https://newsletter.semianalysis.com/p/nvidias-new-china-ai-chips-circumvent">~20% faster</a> for inference than the H100 due to its higher memory capacity (96 GB vs 80 GB) and memory bandwidth (4 vs 3.4 TB/s), even with significantly lower arithmetic performance.</p>        
      <p>In response to the “H20 problem” (i.e, the growing importance of inference and the implications for what chips are desireable), <a href="https://ifp.org/the-h20-problem/#3-bis-should-issue-a-new-rule-strengthening-export-controls-on-inference-chips">some policy analysts</a> and even the <a href="https://chinaselectcommittee.house.gov/sites/evo-subsites/selectcommitteeontheccp.house.gov/files/evo-media-document/DeepSeek Final.pdf#page=10">House Select Committee on the CCP</a> have argued for adding criteria to target inference chips, such as by using memory bandwidth as a threshold metric or by restricting the export of AI chips co-packaged with HBM.</p>    
      <p>However, with the Trump Administration emphasizing "exporting the AI stack," it is unclear if they will expand controls further.</p>      
    `,
  },
  {
    date: "2025",
    rule: "AI Diffusion Rule and Recission",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: ` 
      <p>Biden Admin Diffusion Rule, Trump Recission, individual deals with Saudi Arabia and stuff, and deals with NVIDIA and AMD (H20 and MI308X, H200s, etc.)</p>        
    `,
  },
  {
    date: "2024",
    rule: "Foreign-Produced Direct Product Rule Additions, and Refinements to Controls for Advanced Computing and Semiconductor Manufacturing Items, 89 Fed. Reg. 96790 (Dec. 5, 2024)",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: ` 
      <p></p>        
      <p>The HBM controls <a href="https://ifp.org/the-h20-problem/#3-bis-should-issue-a-new-rule-strengthening-export-controls-on-inference-chips">do not cover</a> chips co-packaged with HBM, just the HBM chips themselves</p>        
    `,
    url: "https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing"
  },    
    {
    date: "2023",
    rule: "Implementation of Additional Export Controls: Certain Advanced Computing Items; Supercomputer and Semiconductor End Use; Updates and Corrections, 88 Fed. Reg. 73458 (Oct. 25, 2023)",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: ` 
      <p>Largely <a href="https://cset.georgetown.edu/article/bis-2023-update-explainer/#:~:text=BIS%20believes%20that%20such%20chips%20could%20%E2%80%9Cprovide%20nearly%20comparable%20AI%20model%20training%20capability%2C%E2%80%9D%20so%20the%20agency%20revamped%20the%20criteria%20used%20to%20determine%20which%20chips%20are%20restricted%2E">in response</a> to the success of export control-avoiding chips like the H800 and A800, in 2023 the BIS established three new criteria for chip controls:</p>
      <ul>
        <li>
          Total Processing Performance (“TPP”): Officially defined as “2 × MacTOPS × bit length of the operation, aggregated over all processing units on the integrated circuit.” This essentially boils down to processing performance multiplied by bit length, i.e., the same as the prior performance threshold, and was set at the same level (4800).
        </li>
        <li>
          Performance Density (“PD”): Officially defined as “TPP divided by applicable die area,” which “is measured in millimeters squared and includes all die area of logic dies manufactured with a process node that uses a non-planar transistor architecture.” 
          This metric was <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">designed</a> to prevent chipmakers from circumventing controls by including multiple chips on one integrated circuit, where each chip individually falls below the TPP threshold but would exceed the threshold when combined and interconnected at high bandwidth.
        </li>
        <li>
          Datacenter purpose: To avoid controlling the export of chips not meant for training AI models (e.g., gaming GPUs), the BIS included a criterion that controlled chips be “designed or marketed for use in datacenters.” Non-datacenter chips with a TPP ≥ 4800 would be subject to less strict controls.
        </li>
      </ul>
      <p>[add stuff about different licenses?]</p>        
      `,
    url: "https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items-supercomputer-and"
  },
  {
    date: "2022",
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
      <p>Essentially <a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Overall%2C%20the%20rules%20appear%20to%20have%20been%20set%20precisely%20to%20make%20the%20A100%20into%20an%20effective%20threshold">used the NVIDIA A100 as the control threshold</a>: the TPP limit of 4800 was right below A100 TPP of 4992, and the interconnect limit of 600 GB/s was right at A100 mark. 
      In other words, the 2022 framework establish that any chip less powerful than the A100 could be exported, and any chip as powerful or more powerful than the A100 was subject to controls.</p>
      <p>This regime proved flawed, specifically due to the use of interconnect as a threshold. NVIDIA <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">designed China-specific chips</a> with identical specs as controlled chips but with an interconnect bandwidth just below the control threshold, making them freely exportable (A100→A800, H100→H800). 
      Even with reduced interconnect, the China-specific chips showed <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">“near identical performance in actual AI applications”</a>, at least <a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Thus%2C%20the,capabilities">for frontier model training and long-context inference</a>. 
      This was later illustrated by Chinese AI lab DeepSeek, which developed its <a href="https://thezvi.substack.com/p/deepseek-lemon-its-wednesday">viral</a> V3 and R1 models <a href="https://www.csis.org/analysis/deepseek-huawei-export-controls-and-future-us-china-ai-race#:~:text=Industry%20analyst%20Ben%20Thompson%20has%20pointed%20to%20strong%20evidence%20that%20DeepSeek%20did%20in%20fact%20use%20H800s%20as%20it%20claimed">at least in large part</a> using H800s.</p>        
    `,
    url: "https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor"
  },
];
