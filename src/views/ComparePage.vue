<template>
  <div class="compare-page">
    <div class="page-hero page-hero-light">
      <span class="section-tag">品类对比</span>
      <h1>中国茶叶全维度对比</h1>
      <div class="section-divider"></div>
      <p>从外形、口感、成分、工序到功效，深入解析五大茶类</p>
    </div>

    <!-- ====== INTERACTIVE SELECTOR ====== -->
    <section class="section">
      <div class="section-header reveal">
        <h2>交互式对比</h2>
        <p>选择两种茶叶，查看它们的详细属性差异</p>
      </div>
      <div class="selector-row reveal">
        <div class="selector-group">
          <label>茶叶 A</label>
          <el-select v-model="teaA" size="large" style="width: 200px">
            <el-option v-for="t in teaNames" :key="t" :label="t" :value="t" />
          </el-select>
        </div>
        <div class="vs-badge">VS</div>
        <div class="selector-group">
          <label>茶叶 B</label>
          <el-select v-model="teaB" size="large" style="width: 200px">
            <el-option v-for="t in teaNames" :key="t" :label="t" :value="t" />
          </el-select>
        </div>
      </div>
      <div class="grid-2 reveal" v-if="teaDataA && teaDataB">
        <div class="compare-info-card">
          <h3>{{ teaA }}</h3>
          <div class="info-row" v-for="k in infoKeys" :key="k"><span class="info-key">{{ k }}</span><span class="info-val">{{ teaDataA[k] || '-' }}</span></div>
        </div>
        <div class="compare-info-card">
          <h3>{{ teaB }}</h3>
          <div class="info-row" v-for="k in infoKeys" :key="k"><span class="info-key">{{ k }}</span><span class="info-val">{{ teaDataB[k] || '-' }}</span></div>
        </div>
      </div>
    </section>

    <!-- ====== RADAR COMPARISON ====== -->
    <div class="section-full-alt">
      <div class="section-inner">
        <div class="section-header reveal">
          <span class="section-tag">多维雷达</span>
          <h2>属性雷达叠加对比</h2>
          <div class="section-divider"></div>
          <p>选中的两种茶叶在水温、产地广度、采摘跨度、风味浓度上的差异</p>
        </div>
        <div class="grid-2">
          <div class="chart-card reveal reveal-delay-1">
            <div ref="radarRef" class="chart-box"></div>
          </div>
          <div class="chart-dark-card reveal reveal-delay-2">
            <div ref="efficacyRef" class="chart-box"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== PROCESSING FLOW ====== -->
    <div class="section-full-alt">
      <div class="section-inner">
        <div class="section-header reveal">
          <span class="section-tag">制茶工艺</span>
          <h2>五大茶类制作工序流程</h2>
          <div class="section-divider"></div>
          <p>从鲜叶到成品——不同茶类的加工路径对比</p>
        </div>
        <div class="process-grid reveal">
          <div class="process-lane" v-for="tea in processData" :key="tea.name">
            <div class="lane-label">{{ tea.name }}</div>
            <div class="lane-steps">
              <div class="step-node" v-for="(step, idx) in tea.steps" :key="idx">
                <div class="step-dot" :style="{ background: tea.color }"></div>
                <span>{{ step }}</span>
                <div class="step-arrow" v-if="idx < tea.steps.length - 1">→</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== FULL TABLE ====== -->
    <section class="section">
      <div class="section-header reveal">
        <span class="section-tag">完整数据</span>
        <h2>茶叶对比全量表</h2>
        <div class="section-divider"></div>
      </div>
      <div class="tea-table-wrap chart-card reveal">
        <el-table :data="teaRows" stripe>
          <el-table-column prop="茶类" label="茶类" width="100" fixed />
          <el-table-column prop="代表品种" label="代表品种" min-width="200" />
          <el-table-column prop="外形" label="外形" min-width="170" />
          <el-table-column prop="口感" label="口感" min-width="170" />
          <el-table-column prop="建议泡法" label="泡法" min-width="160" />
          <el-table-column prop="建议水温_C" label="温度℃" width="80" align="center" />
          <el-table-column prop="主要产地" label="主要产地" min-width="140" />
          <el-table-column prop="最佳采摘月份" label="采摘月份" width="120" />
          <el-table-column prop="适宜土壤" label="适宜土壤" min-width="160" />
        </el-table>
      </div>
    </section>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { teaCompareRows, teaEfficacyRows } from "../data/embedded";

const teaRows = ref([]);
const efficacyRows = ref([]);
const teaA = ref("绿茶");
const teaB = ref("红茶");

const teaNames = computed(() => teaRows.value.map((r) => r.茶类));
const teaDataA = computed(() => teaRows.value.find((r) => r.茶类 === teaA.value));
const teaDataB = computed(() => teaRows.value.find((r) => r.茶类 === teaB.value));
const infoKeys = ["代表品种", "外形", "口感", "建议泡法", "建议水温_C", "主要产地", "最佳采摘月份", "适宜土壤"];

const PALETTE = ["#3d5a3e", "#6c4f3d", "#88a67e", "#c4a265", "#5a7d5b", "#b08968"];
const DARK_PALETTE = ["#88a67e", "#c4a265", "#5a7d5b", "#b08968", "#d4c8b8", "#e8dcc8"];

const processData = [
  { name: "绿茶", color: "#3d5a3e", steps: ["鲜叶采摘", "杀青", "揉捻", "干燥", "成品"] },
  { name: "红茶", color: "#6c4f3d", steps: ["鲜叶采摘", "萎凋", "揉捻", "发酵", "干燥", "成品"] },
  { name: "白茶", color: "#88a67e", steps: ["鲜叶采摘", "日光萎凋", "低温烘干", "拣剔分级", "成品"] },
  { name: "乌龙茶", color: "#c4a265", steps: ["鲜叶采摘", "晒青萎凋", "做青摇青", "杀青炒青", "揉捻包揉", "烘焙", "成品"] },
  { name: "茉莉花茶", color: "#5a7d5b", steps: ["茶坯制备", "茉莉鲜花", "窨制", "烘干提花", "拣剔", "成品"] },
];

const radarRef = ref(null);
const efficacyRef = ref(null);
let charts = {};

function initChart(key, elRef) {
  if (!elRef.value) return null;
  if (charts[key]) charts[key].dispose();
  charts[key] = echarts.init(elRef.value);
  return charts[key];
}
function lightTooltip() { return { backgroundColor: "rgba(255,255,255,0.96)", borderColor: "#e8e0d5", textStyle: { color: "#3d352d", fontSize: 13 } }; }
function darkTooltip() { return { backgroundColor: "rgba(26,23,20,0.92)", borderColor: "rgba(196,162,101,0.2)", textStyle: { color: "#e8e0d5", fontSize: 13 } }; }

function renderRadar() {
  const chart = initChart("radar", radarRef);
  if (!chart || !teaRows.value.length) return;
  const flavorScore = (n) => ({ "绿茶": 6, "红茶": 8, "白茶": 7, "乌龙茶": 9, "茉莉花茶": 7 }[n] || 7);
  const makeData = (name) => {
    const r = teaRows.value.find((t) => t.茶类 === name);
    if (!r) return null;
    return { name, value: [Number(r.建议水温_C || 0), String(r.主要产地 || "").split("、").length, String(r.最佳采摘月份 || "").length > 5 ? 6 : 3, flavorScore(name)] };
  };
  const data = [makeData(teaA.value), makeData(teaB.value)].filter(Boolean);
  chart.setOption({
    tooltip: { ...lightTooltip(), trigger: "item" },
    legend: { bottom: 8, textStyle: { color: "#7a6e62", fontSize: 12 } },
    radar: {
      indicator: [{ name: "水温", max: 100 }, { name: "产地广度", max: 4 }, { name: "采摘跨度", max: 8 }, { name: "风味浓度", max: 10 }],
      shape: "circle",
      axisName: { color: "#7a6e62", fontSize: 12 },
      splitArea: { areaStyle: { color: ["rgba(61,90,62,0.02)", "rgba(61,90,62,0.04)"] } },
      splitLine: { lineStyle: { color: "#e8e0d5" } },
      axisLine: { lineStyle: { color: "#d4c8b8" } },
    },
    series: [{ type: "radar", symbol: "circle", symbolSize: 6, lineStyle: { width: 2.5 }, areaStyle: { opacity: 0.12 }, data }],
    color: ["#3d5a3e", "#c4a265"],
  });
}

function renderEfficacy() {
  const chart = initChart("efficacy", efficacyRef);
  if (!chart || !efficacyRows.value.length) return;
  const dims = ["抗氧化", "提神醒脑", "降脂减肥", "护齿防龋", "助消化", "美容养颜", "清热解毒", "暖胃养胃"];
  const makeData = (name) => {
    const r = efficacyRows.value.find((t) => t.茶类 === name);
    if (!r) return null;
    return { name, value: dims.map((d) => Number(r[d] || 0)) };
  };
  const data = [makeData(teaA.value), makeData(teaB.value)].filter(Boolean);
  chart.setOption({
    tooltip: { ...darkTooltip(), trigger: "item" },
    legend: { bottom: 8, textStyle: { color: "rgba(200,190,175,0.7)", fontSize: 12 } },
    radar: {
      indicator: dims.map((d) => ({ name: d, max: 100 })),
      shape: "circle",
      axisName: { color: "rgba(200,190,175,0.6)", fontSize: 11 },
      splitArea: { areaStyle: { color: ["rgba(196,162,101,0.02)", "rgba(196,162,101,0.04)"] } },
      splitLine: { lineStyle: { color: "rgba(200,190,175,0.1)" } },
      axisLine: { lineStyle: { color: "rgba(200,190,175,0.15)" } },
    },
    series: [{ type: "radar", symbol: "circle", symbolSize: 5, lineStyle: { width: 2 }, areaStyle: { opacity: 0.1 }, data }],
    color: ["#88a67e", "#c4a265"],
  });
}

function renderAll() { renderRadar(); renderEfficacy(); }
function onResize() { Object.values(charts).forEach((c) => c?.resize()); }

let observer = null;
function setupReveal() {
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

onMounted(async () => {
  teaRows.value = teaCompareRows;
  efficacyRows.value = teaEfficacyRows;
  await nextTick();
  renderAll();
  window.addEventListener("resize", onResize);
  setupReveal();
});

watch([teaA, teaB], () => nextTick(() => { renderRadar(); renderEfficacy(); }));

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  observer?.disconnect();
  Object.values(charts).forEach((c) => c?.dispose());
});
</script>


