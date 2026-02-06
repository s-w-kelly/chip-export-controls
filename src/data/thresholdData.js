/**
 * Export Control Threshold History
 *
 * To update this data:
 * - Add new rules to the array (most recent should be first)
 * - The first entry in the array is used as the "current" threshold
 * - Only include thresholds that exist for each rule (tppThreshold, pdThreshold, interconnectThreshold)
 * - summary: Brief title shown in collapsed header (e.g., "Initial AI chip controls")
 * - rule: Full official rule name, shown hyperlinked in expanded view
 * - notes field supports HTML for rich formatting
 * - url is the link to the official rule document
 */

export const thresholdHistory = [
  {
    date: "2026",
    summary: "Current status and trends",
    rule: "Revision to License Review Policy for Advanced Computing Commodities, 91 Fed. Reg. 1684 (Jan. 15, 2026)",
    notes: ` 
      <p><strong>H200 Exports</strong></p>  
      <p>While the Trump Administration <a href="https://www.semafor.com/article/12/09/2025/trump-says-nvidia-can-sell-h200-ai-chips-to-china">agreed</a> at the end of 2025 to allow NVIDIA to export H200s to China, in January Chinese authorities <a href="https://chipbriefing.substack.com/p/daily-china-to-limit-h200-chips-basically">told</a> its customs agents not to allow H200s into the country. 
      Government officals further <a href="https://www.reuters.com/world/china/chinas-customs-agents-told-nvidias-h200-chips-are-not-permitted-sources-say-2026-01-14/">instructed</a> companies not to purchase the chips “unless necessary,”
      and “[t]he wording from the officials is so severe that it is basically a ban for now, though this might change in the future should things evolve.”</p>
      <p>On January 28, Reuters and the Wall Street Journal <a href="https://chipbriefing.substack.com/p/daily-china-approves-h200-chips">independently reported</a> that Beijing had conditionally approved H200 sales to ByteDance, Alibaba, and Tencent, but Nvidia CEO Jensen Huang <a href="https://chipbriefing.substack.com/p/daily-nvidia-says-china-has-not-yet">said</a> his company has received no orders yet.
      <p>In the meantime, to implement the H200 export agreement, on January 13 BIS <a href="https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china">announced</a> a rule allowing case-by-case exports of otherwise controlled chips to China and Macau, under which the H200 and AMD MI325X fall. 
      The next day, the White House <a href="https://www.whitehouse.gov/presidential-actions/2026/01/adjusting-imports-of-semiconductors-semiconductor-manufacturing-equipment-and-their-derivative-products-into-the-united-states/">issued</a> a proclamation establishing a 25% tariff on chips within two narrow bands, which target the H200 and MI325X.</p>
      <p>First, the new <a href="https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities">BIS rule</a> (codified at <a href="https://www.ecfr.gov/current/title-15/part-742/section-742.6#p-742.6(b)(10)(iii)(A)(1)">15 C.F.R. § 742.6(b)(10)(iii)(A)(1)</a>)
      announces that controlled chips (i.e., chips that fall within the preexisting TPP/PD control thresholds)
      are eligible for case-by-case review of export license applications to China or Macau (rather than the previous presumption of denial treatment) if they fall within a zone defined by TPP and memory bandwidth. Specifically, chips with</p>
      <ul>
        <li>
          TPP < 21,000 AND
        </li>
        <li>
          “Total DRAM Bandwidth” < 6,500 GB/s 
        </li>
      </ul>
      <p>may be eligible for case-by-case license review. Controlled chips with metrics beyond this new range (e.g., NVIDIA Blackwell and Rubin chips) are still controlled, and their license applications are reviewed with a presumption of denial.</p>
      <p>Note that TPP/PD still determine whether a chip is controlled in the first place. And only when a chip is deemed controlled do the new TPP/memory bandwidth thresholds and case-by-case exception even apply (uncontrolled chips would not need the exception because they are already exportable).</p>
      <p>Second, the <a href="https://www.whitehouse.gov/presidential-actions/2026/01/adjusting-imports-of-semiconductors-semiconductor-manufacturing-equipment-and-their-derivative-products-into-the-united-states/">Presidential Proclamation</a> sets two “bands” (again defined by TPP and memory bandwidth) within which chips will be subject to a 25% tariff.</p>
      <p>As defined in the <a href="https://www.whitehouse.gov/wp-content/uploads/2026/01/2026SemiConductor.prc_.rel-ANNEX.pdf#page=2">Annex</a> to the Proclamation, the two tariff bands are:</p> 
      <ul>
        <li>
          (1) TPP 14,000-17,500 AND memory bandwidth 4,500-5,000 GB/s OR
        </li>
        <li>
          (2) TPP 20,800-21,100 AND memory bandwidth 5,800-6,200 GB/s 
        </li>
      </ul> 
      <p>These are clearly designed to target:</p>
      <ul>
        <li>
          (1) the H200 (SXM: TPP = 15,832	and memory bw = 4,800 GB/s) and
        </li>
        <li>
          (2) the MI325X (TPP = 20,919 and memory bw = 6,000 GB/s) 
        </li>
      </ul>
      <p>Overall, while the new TPP and memory bandwidth-based exception zone encompasses several currently controlled chips that are technically case-by-case eligible, chips outside the tariff bands are unlikely to receive approval without the tariff revenue mechanism. 
      The narrow tariff bands suggest that, at least for now, the H200 and MI325X are specifically the targets of this rule and are only ones likely to be approved in this manner.</p>
      <p><strong>Congressional Activity</strong></p>  
      <p>In light of ongoing chip smuggling and diversion by Chinese companies to access NVIDIA H100s and other powerful chips, <a href="https://www.transformernews.ai/p/ai-chip-location-verification-nvidia-china-csa">many experts</a> are pushing for implementing on-chip location verification mechanisms, and a bill has been introduced in Congress to this end.
      The <a href="https://www.congress.gov/bill/119th-congress/house-bill/3447/text">Chip Security Act</a> would “require any covered integrated circuit product to be outfitted with chip security mechanisms that implement location verification, using techniques that are feasible and appropriate.”
      Chipmakers have <a href="https://www.transformernews.ai/i/173170396/not-so-fast">criticized</a> the proposal as “burdensome,” but <a href="https://www.iaps.ai/research/location-verification-for-ai-chips#:~:text=Firmware%20update">analysts estimate</a> that location verification functionality could be achieved with a firmware update to existing chips costing less than $1 million, and NVIDIA has <a href="https://www.reuters.com/business/nvidia-builds-location-verification-tech-that-could-help-fight-chip-smuggling-2025-12-10/">already developed</a> the necessary technology.</p>
      <p>In late January, the House of Representatives Foreign Affairs Committee <a href="https://www.reuters.com/legal/litigation/us-house-panel-vote-bill-give-congress-authority-over-ai-chip-exports-2026-01-21/">advanced</a> the AI Overwatch Act, which would give Congress power over AI chip exports.
      Specifically, the bill would give the House Foreign Affairs Committee and the Senate Banking Committee 30 days to review and potentially block licenses issued to export AI chips to China and other countries.
      The legislation was <a href="https://www.congress.gov/bill/119th-congress/house-bill/6875/text">introduced</a> in late 2025 response to the Trump Administration’s approval of H200 exports to China, and the law would also ban exports of Blackwell generation chips, which the Trump Administration has <href="https://ifp.org/the-b30a-decision/">reportedly</a> been considering.
      `,
    url: "https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities",
  },
  {
    date: "2025",
    summary: "AI Diffusion Rule and rescission",
    rule: "",
    notes: ` 
      <p>In the final days of his term, President Biden released a sweeping <a href="https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion">“Framework for Artificial Intelligence Diffusion</a>.” In brief, the rule <a href="https://www.rand.org/pubs/perspectives/PEA3776-1.html">would have created</a> a three-tiered system controlling which countries can import advanced AI chips (with per-country caps on H100-equivalent GPUs) as well as certain model weights.</p>  
      <p>However, the Trump Administration <a href="https://cset.georgetown.edu/newsletter/may-15-2025/">rescinded</a> the Diffusion Rule days before it was set to take effect and instead <a href="https://carnegieendowment.org/emissary/2025/05/ai-chip-trump-gulf-uae-saudi-security-risk-good-deal?lang=en">opted to sign</a> individual deals with countries, starting with Saudi Arabia and the United Arab Emirates.</p>
      <p>Rather than restrict AI diffusion as the Biden Administration attempted, the Saudia Arabia/UAE deals and other Trump Administration actions led by advisor David Sacks reflect <a href="https://thezvi.substack.com/i/164743152/when-david-sacks-says-win-the-ai-race-he-literally-means-market-share">a different emphasis</a> on aggressively exporting “the American tech stack.” Sacks has interpreted “winning the AI race” as “achiev[ing] a decisive advantage that can be measured in market share.”</p>
      <p>The Trump Administration has not formally rolled back export controls beyond rescinding the Diffusion Rule, and in its <a href="https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf">“AI Action Plan”</a> called for <a href="https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf#page=24">“Strengthen[ing] AI Compute Export Control Enforcement”</a> and <a href="https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf#page=24">“Plug[ging] Loopholes in Existing Semiconductor Manufacturing Export Controls”</a>.
      However, the Administration has seemed to prioritize its other goals of <a href="https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf#page=24">“Export[ing] American AI to Allies and Partners”</a>, as it <a href="https://www.npr.org/2025/08/11/nx-s1-5498689/trump-nvidia-h20-chip-sales-china">walked back</a> plans to ban exports of the NVIDIA H20 and AMD MI308 (inference-optimized chips with downgraded arithmetic performance to circumvent export controls) and, at the end of 2025, <a href="https://www.semafor.com/article/12/09/2025/trump-says-nvidia-can-sell-h200-ai-chips-to-china">allowed</a> the export of H200 chips (identical to controlled H100 chips but with <i>higher</i> memory capacity and bandwidth).</p>
    `,
  },
  {
    date: "2024",
    summary: "HBM controls and Entity List additions",
    rule: "Foreign-Produced Direct Product Rule Additions, and Refinements to Controls for Advanced Computing and Semiconductor Manufacturing Items, 89 Fed. Reg. 96790 (Dec. 5, 2024)",
    notes: ` 
      <p>In 2024, BIS maintained the TPP/PD framework for GPUs but introduced controls for <a href="https://newsletter.semianalysis.com/p/scaling-the-memory-wall-the-rise-and-roadmap-of-hbm#throughput-optimized-io-is-the-lifeblood-of-the-ai-accelerator">High-Bandwidth Memory (“HBM”)</a>, a type of dynamic random access memory (“DRAM”) often co-packaged with GPU logic chips to allow for high performance data transfers.</p>
      <p>HBM was targeted as a chokepoint for export controls for three primary reasons:</p>
      <ul>
        <li>
          HBM is extremely important for AI compute performance: it <a href="https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls#:~:text=HBM%2C%20and%20the%20rapid%20data%20access%20it%20enables%2C%20has%20been%20an%20integral%20part%20of%20the%20AI%20story">has</a> “been an integral part of the AI story” and is used in essentially all AI accelerators (as reflected in the Key Chips dashboard on this site). 
          HBM became <a href="https://ifp.org/the-h20-problem/#background">even more important</a> in the latter half of 2024 with the emergence of reasoning models that made inference-optimized compute (which requires high memory bandwidth) critical.
        </li>
        <li>
          HBM is extremely expensive: it <a href="https://www.chinatalk.media/p/export-controls-and-hbm#:~:text=accounts%20for%2050%25%20or%20more%20of%20the%20total%20cost%20of%20an%20AI%20chip">accounts</a> for ~50% of the cost of an AI chip.</p>        
        </li>
        <li>
          HBM is extremely difficult to produce and production is essentially run by four companies: SK Hynix and Samsung in Korea <a href="https://www.chinatalk.media/i/152840795/asian-chipmakers-run-the-game">control ~95%</a> of the global HBM market, with the remaining 5% held by US company Micron; 
          further, copackaging HBM with GPU logic dies <a href="https://www.chinatalk.media/p/export-controls-and-hbm#:~:text=TSMC%20also%20controls%20approximately%2090%25">requires</a> a special packaging technology (Chip-on-Wafer-on-Substrate, or CoWoS) for which Taiwanese foundry TSMC controls 90% of the global capacity.</p>     
        </li>
      </ul>
      <p>The BIS <a href="https://www.federalregister.gov/d/2024-28270/p-105">established</a> that HBM with a “memory bandwidth density” of 2GB/s/mm² would be controlled under ECCN 3A090.c. As the BIS noted, “[a]ll HBM stacks currently in production exceed this threshold.”
      Notably, however, the rule <a href="https://www.federalregister.gov/d/2024-28270/p-106">excluded</a> co-packaged HBM. In other words, ECCN 3A090.c only applied to separate HBM chips, and AI chips already produced with HBM on board (which would inevitably exceed the bandwidth density threshold) would not be subject to export controls based on the included HBM; their export control status would continue to be governed by the TPP/PD/datacenter marketing criteria.</p>
      <p>Targeting the HBM chokepoint left Chinese chipmakers like Huawei reliant on domestic producers, which <a href="https://www.chinatalk.media/i/161434996/chinese-memory-advancements">are</a> ~3 generations (or ~6–8 years) behind SK Hynix/Samsung/Micron. 
      However, the 2024 HBM controls <a href="https://ifp.org/the-h20-problem/#background">were leaked</a> six months prior to their release in December, which allowed leading Chinese chipmaker Huawei to stockpile a year’s worth of HBM before controls were in effect.
      Further, Huawei <a href="https://www.chinatalk.media/i/152840795/asian-chipmakers-run-the-game">reportedly</a> continues to access HBM by importing it packaged with a cheap logic die, circumventing the controls since they do not apply to co-packaged HBM, and the co-packaged logic die does not exceed the TPP/PD thresholds.</p>        
      <p>Concurrently with the HBM rules, the BIS <a href="https://www.federalregister.gov/documents/2024/12/05/2024-28267/additions-and-modifications-to-the-entity-list-removals-from-the-validated-end-user-veu-program">dramatically expanded</a> its <a href="https://www.ecfr.gov/current/title-15/section-744.16">“Entity List”</a>, a selection of specific entities (placed on the list because they present a risk of diversion of controlled items or engage in activities contrary to US interests) that are subject to specific individual license requirements for the export, reexport, and transfer (in-country) of specified items (e.g., licenses are generally reviewed with a presumption of denial).
      In 2024, the BIS added 140 Chinese, Japanese, South Korean, and Singaporean conpanies to address diversion concerns.</p>
      `,
    url: "https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing"
  },    
    {
    date: "2023",
    summary: "TPP/PD framework introduced",
    rule: "Implementation of Additional Export Controls: Certain Advanced Computing Items; Supercomputer and Semiconductor End Use; Updates and Corrections, 88 Fed. Reg. 73458 (Oct. 25, 2023)",
    tppThreshold: 4800,
    pdThreshold: 5.92,
    notes: ` 
      <p>Largely <a href="https://cset.georgetown.edu/article/bis-2023-update-explainer/#:~:text=BIS%20believes%20that%20such%20chips%20could%20%E2%80%9Cprovide%20nearly%20comparable%20AI%20model%20training%20capability%2C%E2%80%9D%20so%20the%20agency%20revamped%20the%20criteria%20used%20to%20determine%20which%20chips%20are%20restricted%2E">in response</a> to the success of export control-avoiding chips like the H800 and A800, in 2023 the BIS established three new criteria for chip controls:</p>
      <ul>
        <li>
          Total Processing Performance (“TPP”): <a href="https://www.federalregister.gov/d/2023-23055/p-938">Officially defined</a> as “2 × MacTOPS × bit length of the operation, aggregated over all processing units on the integrated circuit.” This essentially boils down to processing performance multiplied by bit length, i.e., the same as the prior performance threshold.
        </li>
        <li>
          Performance Density (“PD”): <a href="https://www.federalregister.gov/d/2023-23055/p-945">Officially defined</a> as “TPP divided by applicable die area,” which “is measured in millimeters squared and includes all die area of logic dies manufactured with a process node that uses a non-planar transistor architecture.” 
          This metric was <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">designed</a> to prevent chipmakers from circumventing controls by including multiple chips on one integrated circuit, where each chip individually falls below the TPP threshold but would exceed the threshold when combined and interconnected at high bandwidth.
        </li>
        <li>
          Datacenter purpose: To avoid controlling the export of chips not meant for training AI models (e.g., gaming GPUs), the BIS included a <a href="https://www.federalregister.gov/d/2023-23055/p-935">criterion</a> that controlled chips be “designed or marketed for use in datacenters.” 
          Non-datacenter chips with a TPP ≥ 4800 would be controlled but with license exceptions available (see below).
        </li>
      </ul>
      <p>Using these metrics, the BIS established a <a href="https://www.federalregister.gov/d/2023-23055/p-190">two-tiered system</a> for license requirements:</p>
      <ul>
        <li>
          Tier 1 = Datacenter chips with 4,800 TPP or 1,600 TPP + 5.92 PD → Controlled, export license required; license applications reviewed with presumption of denial for country group D:5 and Macau, reviewed with presumption of approval for D:1 and D:4 countries.
        </li>
        <li>
          Tier 2 = Datacenter chips with 2,400–4,800 TPP + 1.6–5.92 PD or 1600 TPP + 3.2–5.92 PD → Controlled, export license required, but eligible for Notified Advanced Computing (“NAC”) or Advanced Computing Authorized (“ACA”) license exceptions.
        </li>
        </ul>  
      <p><a href="https://www.federalregister.gov/d/2023-23055/p-204">Non-datacenter chips</a> with a TPP of 4,800 → NAC/ACA eligible; TPP below 4,800 → not controlled.</p>
      <p>Note that the original 2023 final rule only referenced the NAC program, but an <a href="https://www.federalregister.gov/d/2024-07004/p-19">April 2024 update</a> separated the original proposal into two separate license exceptions:</p>
      <ul>
        <li>
          NAC, for exports/reexports to D:5 countries (see below) and Macau, or companies with an ultimate parent headquartered in a D:5 country or Macau. Such exports require a notification to BIS.
        </li>
        <li>
          ACA, for exports, reexports, and transfers (in-country) to D:1 or D:4 countries (except Macau and destinations also in D:5). Such exports do NOT require a notification to BIS.        
        </li>
      </ul>      
      <p>
        While the 2022 rule only imposed controls on chips exports directly to China and Macau, the 2023 rules dramatically expanded the geographic scope of controls.
        The controls now covered over 40 countries from <a href="https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/appendix-Supplement%20No.%201%20to%20Part%20740">EAR Country Group</a> D:5 (U.S. Arms Embargoed Countries such as China, Iran, and Russia) and Macau, and Groups D:1 (countries controlled for national security reasons, such as Georgia, Turkmenistan, Vietnam) and D:4 (countries controlled for missile technology concerns, such as Pakistan, Saudi Arabia, and the UAE).
      </p>
      <p>
        Further, to address the risk of Chinese companies obtaining chips shipped/diverted through other countries or foreign subsidiaries the BIS introduced <a href="https://www.federalregister.gov/d/2023-23055/p-306">“end-use” rules</a>.
        In relevant part, controlled (ECCN 3A090) chips would require a license if exported to any desination outside of the D:1, :4, and :5 countries with knowledge that the chip “is destined for any entity that is headquartered in, or whose ultimate parent company is headquartered in” a D:5 country or Macau and will be used in a “supercomputer.”
      </p>
      <p>Overall, the 2023 framework <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">was</a> “incredibly strict” and “block[ed] a variety of GPUs . . . the market and firms like Nvidia did not expect.” 
      After the reversal of attempted expansions to export controls at the end of the Biden Administration (see above), the 2023 rules essentially remain in place for GPUs.</p>
      `,
    url: "https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items-supercomputer-and"
  },
  {
    date: "2022",
    summary: "Initial AI chip controls",
    rule: "Implementation of Additional Export Controls: Certain Advanced Computing and Semiconductor Manufacturing Items; Supercomputer and Semiconductor End Use; Entity List Modification, 87 Fed. Reg. 62186 (Oct. 13, 2022)",
    performanceThreshold: 4800,
    interconnectThreshold: "600 GB/s",
    notes: ` 
      <p>The US government’s use of export controls to inhibit Chinese technological progress <a href="">began under the first Trump Administration</a>, but the initial AI-focused chip controls were released under President Biden.</p>
      <p>The 2022 rule issued by the Bureau of Industry and Security (“BIS”) used two criteria, both of which a chip had to meet to be subject to export controls:</p>
      <ul>
        <li>
          “Bit length per operation multiplied by processing performance measured in TOPS, aggregated over all processor units, of 4800 or more”;
        </li>
        <li>
          “Aggregate bidirectional transfer rate over all inputs and outputs [i.e., interconnect bandwidth] of 600 Gbyte/s or more to or from integrated circuits other than volatile memories.”
        </li>
      </ul>
      <p>This framework essentially <a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Overall%2C%20the%20rules%20appear%20to%20have%20been%20set%20precisely%20to%20make%20the%20A100%20into%20an%20effective%20threshold">used the NVIDIA A100 as the control threshold</a>: the TPP limit of 4800 was right below A100 TPP of 4992, and the interconnect limit of 600 GB/s was right at A100 mark. 
      In other words, the 2022 framework established that any chip less powerful than the A100 could be exported, and any chip as powerful or more powerful than the A100 was subject to controls.</p>
      <p>This regime proved flawed, specifically due to the use of interconnect as a threshold. NVIDIA <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">designed China-specific chip variants</a> (A100→A800, H100→H800) with identical specs as controlled chips but with an interconnect bandwidth just below the control threshold, making them exportable. 
      Even with reduced interconnect, the China-specific chips showed <a href="https://newsletter.semianalysis.com/i/175661061/ai-semiconductor-controls">“near identical performance in actual AI applications”</a>, at least <a href="https://epoch.ai/gradient-updates/us-export-controls-china-ai#:~:text=Thus%2C%20the,capabilities">for model training and long-context inference</a>. 
      This was later illustrated by Chinese AI lab DeepSeek, which developed its <a href="https://thezvi.substack.com/p/deepseek-lemon-its-wednesday">viral</a> V3 and R1 models <a href="https://www.csis.org/analysis/deepseek-huawei-export-controls-and-future-us-china-ai-race#:~:text=Industry%20analyst%20Ben%20Thompson%20has%20pointed%20to%20strong%20evidence%20that%20DeepSeek%20did%20in%20fact%20use%20H800s%20as%20it%20claimed">at least in large part</a> using H800s.</p>        
    `,
    url: "https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor"
  },
];
