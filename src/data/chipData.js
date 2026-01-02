/**
 * AI Chip Data
 *
 * To update this data:
 * - Add new chips by copying an existing object and modifying values
 * - All numeric fields (tpp, dieArea, pd, etc.) can be null if unknown
 * - controlStatus options: "Controlled", "Controlled (Oct 2023)", "Unknown", "Entity List (Company)"
 * - sources is an array of objects with { name, url } citing where data came from
 */

export const chipData = [
  {
    name: "NVIDIA H100 NVL",
    manufacturer: "NVIDIA",
    architecture: "Hopper",
    releaseDate: "2022",
    tpp: 15831,
    dieArea: 814,
    pd: 19.4,
    fp8Dense: 1979,
    fp16Dense: 989,
    int8Dense: 1979,
    hbmCapacity: "80 GB",
    memoryBandwidth: "3.35 TB/s",
    tdp: "700W",
    controlStatus: "Controlled",
    eccn: "3A090",
    notes: "Primary target of Oct 2022 controls. TPP calculated from FP8 dense (1979 TFLOPS × 8).",
    sources: [
      { name: "NVIDIA", url: "#" },
      { name: "BIS Final Rule Oct 2023", url: "#" }
    ]
  },
  {
    name: "NVIDIA H100 SXM",
    manufacturer: "NVIDIA",
    architecture: "Hopper",
    releaseDate: "2022",
    tpp: 12665,
    dieArea: 814,
    pd: 15.6,
    fp8Dense: 1513,
    fp16Dense: 756,
    int8Dense: 1513,
    hbmCapacity: "80 GB",
    memoryBandwidth: "2 TB/s",
    tdp: "350W",
    controlStatus: "Controlled",
    eccn: "3A090",
    notes: "Lower clocks than SXM variant. Same die, lower power.",
    sources: [
      { name: "NVIDIA", url: "#" },
      { name: "BIS Final Rule Oct 2023", url: "#" }
    ]
  },
  {
    name: "NVIDIA H800",
    manufacturer: "NVIDIA",
    architecture: "Hopper",
    releaseDate: "2023",
    tpp: 15831,
    dieArea: 814,
    pd: 19.4,
    fp8Dense: 1979,
    fp16Dense: 989,
    int8Dense: 1979,
    hbmCapacity: "80 GB",
    memoryBandwidth: "3.35 TB/s",
    tdp: "700W",
    controlStatus: "Controlled (Oct 2023)",
    eccn: "3A090",
    notes: "China compliance variant with reduced NVLink bandwidth. Controlled under Oct 2023 rule closing loophole.",
    sources: [
      { name: "NVIDIA", url: "#" },
      { name: "BIS Final Rule Oct 2023", url: "#" }
    ]
  },
  {
    name: "NVIDIA A100 SXM",
    manufacturer: "NVIDIA",
    architecture: "Ampere",
    releaseDate: "2020",
    tpp: 4992,
    dieArea: 826,
    pd: 6.0,
    fp8Dense: null,
    fp16Dense: 312,
    int8Dense: 624,
    hbmCapacity: "80 GB",
    memoryBandwidth: "2 TB/s",
    tdp: "400W",
    controlStatus: "Controlled",
    eccn: "3A090",
    notes: "No FP8 support. TPP from INT8 dense (624 TOPS × 8). Original Oct 2022 control target.",
    sources: [
      { name: "NVIDIA Ampere Architecture Whitepaper", url: "#" }
    ]
  },
  {
    name: "NVIDIA A800",
    manufacturer: "NVIDIA",
    architecture: "Ampere",
    releaseDate: "2022",
    tpp: 4992,
    dieArea: 826,
    pd: 6.0,
    fp8Dense: null,
    fp16Dense: 312,
    int8Dense: 624,
    hbmCapacity: "80 GB",
    memoryBandwidth: "1.55 TB/s",
    tdp: "400W",
    controlStatus: "Controlled (Oct 2023)",
    eccn: "3A090",
    notes: "China compliance variant with reduced interconnect. Controlled under Oct 2023 rule.",
    sources: [
      { name: "NVIDIA", url: "#" },
      { name: "BIS Final Rule Oct 2023", url: "#" }
    ]
  },
  {
    name: "NVIDIA B200",
    manufacturer: "NVIDIA",
    architecture: "Blackwell",
    releaseDate: "2024",
    tpp: 36000,
    dieArea: 1614,
    pd: 22.3,
    fp8Dense: 4500,
    fp16Dense: 2250,
    int8Dense: 4500,
    hbmCapacity: "192 GB",
    memoryBandwidth: "8 TB/s",
    tdp: "1000W",
    controlStatus: "Controlled",
    eccn: "3A090",
    notes: "Dual-die design (2×807mm²). TPP estimate from FP8 dense. Values preliminary.",
    sources: [
      { name: "NVIDIA GTC 2024", url: "#" },
      { name: "SemiAnalysis estimates", url: "#" }
    ]
  },
  {
    name: "AMD MI300X",
    manufacturer: "AMD",
    architecture: "CDNA 3",
    releaseDate: "2023",
    tpp: 10419,
    dieArea: 1536,
    pd: 6.8,
    fp8Dense: 1302,
    fp16Dense: 1302,
    int8Dense: 2607,
    hbmCapacity: "192 GB",
    memoryBandwidth: "5.3 TB/s",
    tdp: "750W",
    controlStatus: "Controlled",
    eccn: "3A090",
    notes: "Chiplet design: 8 XCDs (~1536mm² total logic). TPP from FP8 dense. Die area excludes I/O dies.",
    sources: [
      { name: "AMD CDNA 3 Whitepaper", url: "#" },
      { name: "AMD Tech Day 2023", url: "#" }
    ]
  },
  {
    name: "Google TPU v5e",
    manufacturer: "Google",
    architecture: "TPU",
    releaseDate: "2023",
    tpp: 1584,
    dieArea: null,
    pd: null,
    fp8Dense: null,
    fp16Dense: null,
    int8Dense: 198,
    hbmCapacity: "16 GB",
    memoryBandwidth: "820 GB/s",
    tdp: "~200W",
    controlStatus: "Unknown",
    eccn: "Unknown",
    notes: "Limited public specs. TPU v5e optimized for inference. Die size not publicly disclosed.",
    sources: [
      { name: "Google Cloud documentation", url: "#" },
      { name: "Estimates", url: null }
    ]
  },
  {
    name: "Huawei Ascend 910B",
    manufacturer: "Huawei",
    architecture: "Da Vinci",
    releaseDate: "2023",
    tpp: null,
    dieArea: null,
    pd: null,
    fp8Dense: null,
    fp16Dense: 256,
    int8Dense: 512,
    hbmCapacity: "64 GB",
    memoryBandwidth: "1.8 TB/s",
    tdp: "400W",
    controlStatus: "Entity List (Huawei)",
    eccn: "N/A",
    notes: "Specs unconfirmed. Huawei on Entity List since 2019. Manufactured by SMIC at 7nm.",
    sources: [
      { name: "Industry estimates", url: null },
      { name: "TechInsights teardown reports", url: "#" }
    ]
  }
];
