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
    name: "NVIDIA B200",
    manufacturer: "NVIDIA",
    architecture: "Blackwell",
    releaseDate: "2024",
    tpp: 36000,
    dieArea: 1614,
    pd: 22.3,
    fp4: 1,
    fp8: 4500,
    fp16: 2250,
    bf16: 1,
    tf32: 1,
    int8: 4500,
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
    name: "NVIDIA H100 NVL",
    manufacturer: "NVIDIA",
    architecture: "Hopper",
    releaseDate: "2022",
    tpp: 13364,
    dieArea: 814,
    pd: 16.42,
    fp4: null,
    fp8: "3341 (sparse)",
    fp16: "1671 (sparse)",
    bf16: "1671 (sparse)",
    tf32: "835 (sparse)",
    int8: "3341 (sparse)",
    hbmCapacity: "80 GB",
    memoryBandwidth: "3.9 TB/s",
    tdp: "700W",
    controlStatus: "Controlled",
    eccn: "3A090",
    notes: "Primary target of Oct 2022 controls. TPP calculated from FP8 dense (1979 TFLOPS × 8).",
    sources: [
      { name: "H100 datasheet", url: "https://resources.nvidia.com/en-us-gpu/h100-datasheet-24306" }
    ]
  },
  {
    name: "NVIDIA H100 SXM",
    manufacturer: "NVIDIA",
    architecture: "Hopper",
    releaseDate: "2022",
    tpp: 15832,
    dieArea: 814,
    pd: 19.45,
    fp4: 1,
    fp8: 4500,
    fp16: 2250,
    bf16: 1,
    tf32: 1,
    int8: 4500,
    hbmCapacity: "80 GB",
    memoryBandwidth: "3.35 TB/s",
    tdp: "350W",
    controlStatus: "Controlled",
    eccn: "3A090",
    notes: "Lower clocks than SXM variant. Same die, lower power.",
    sources: [
    { name: "H100 datasheet", url: "https://resources.nvidia.com/en-us-gpu/h100-datasheet-24306" }
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
    fp4: 1,
    fp8: 4500,
    fp16: 2250,
    bf16: 1,
    tf32: 1,
    int8: 4500,
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
    fp4: 1,
    fp8: 4500,
    fp16: 2250,
    bf16: 1,
    tf32: 1,
    int8: 4500,
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
    fp4: 1,
    fp8: 4500,
    fp16: 2250,
    bf16: 1,
    tf32: 1,
    int8: 4500,
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
    name: "AMD MI300X",
    manufacturer: "AMD",
    architecture: "CDNA 3",
    releaseDate: "2023",
    tpp: 10419,
    dieArea: 1536,
    pd: 6.8,
    fp4: 1,
    fp8: 4500,
    fp16: 2250,
    bf16: 1,
    tf32: 1,
    int8: 4500,
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
    name: "Huawei Ascend 910B",
    manufacturer: "Huawei",
    architecture: "Da Vinci",
    releaseDate: "2023",
    tpp: null,
    dieArea: null,
    pd: null,
    fp4: 1,
    fp8: 4500,
    fp16: 2250,
    bf16: 1,
    tf32: 1,
    int8: 4500,
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
