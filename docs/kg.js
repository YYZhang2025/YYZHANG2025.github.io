const data = {
  nodes: [
    {
      id: "SFT",
      type: "stage",
      desc: "Supervised Fine-Tuning\n人工标注高质量指令数据",
    },
    {
      id: "RLHF",
      type: "stage",
      desc: "Reinforcement Learning from Human Feedback",
    },
    {
      id: "RLVR",
      type: "stage",
      desc: "Reinforcement Learning from Verifiable Rewards",
    },
    {
      id: "PPO",
      type: "algo",
      desc: "Policy Gradient with Clipping",
    },
    {
      id: "GRPO",
      type: "algo",
      desc: "Group Relative Policy Optimization",
    },
    {
      id: "ChatGPT",
      type: "model",
      desc: "OpenAI 对话模型（PPO）",
    },
    {
      id: "DeepSeek-R1",
      type: "model",
      desc: "Reasoning Model（GRPO + Verifiable Reward）",
    }
  ],
  links: [
    { source: "SFT", target: "RLHF", label: "prepares" },
    { source: "RLHF", target: "PPO", label: "uses" },
    { source: "RLHF", target: "GRPO", label: "alternative" },
    { source: "GRPO", target: "RLVR", label: "enables" },
    { source: "PPO", target: "ChatGPT", label: "trains" },
    { source: "GRPO", target: "DeepSeek-R1", label: "trains" }
  ]
};

const panelTitle = document.getElementById("panel-title");
const panelContent = document.getElementById("panel-content");

const Graph = ForceGraph()(document.getElementById("graph"))
  .graphData(data)
  .nodeLabel(n => n.id)
  .nodeAutoColorBy("type")
  .nodeRelSize(6)
  .linkDirectionalArrowLength(6)
  .linkDirectionalArrowRelPos(1)
  .linkLabel(l => l.label)
  .onNodeClick(node => {
    panelTitle.innerText = node.id;
    panelContent.innerHTML = `
      <p><strong>类型：</strong>${node.type}</p>
      <p>${node.desc.replace(/\n/g, "<br>")}</p>
    `;
  });

// ========== hover 高亮邻居 ==========
let highlightNodes = new Set();
let highlightLinks = new Set();

Graph
  .onNodeHover(node => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (node) {
      highlightNodes.add(node);
      data.links.forEach(l => {
        if (l.source.id === node.id || l.target.id === node.id) {
          highlightLinks.add(l);
          highlightNodes.add(l.source);
          highlightNodes.add(l.target);
        }
      });
    }
  })
  .nodeColor(n =>
    highlightNodes.size === 0 || highlightNodes.has(n)
      ? undefined
      : "rgba(180,180,180,0.25)"
  )
  .linkColor(l =>
    highlightLinks.has(l) ? "#f97316" : "rgba(180,180,180,0.2)"
  )
  .linkWidth(l => (highlightLinks.has(l) ? 3 : 1));