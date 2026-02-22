<template>
  <div class="origins-page">
    <div class="page-hero page-hero-light">
      <span class="section-tag">产地故事</span>
      <h1>中国茶叶产地全景</h1>
      <div class="section-divider"></div>
      <p>省份结构分析、全球格局、代表产地深度叙事</p>
    </div>

    <!-- ====== PROVINCE BUBBLE ====== -->
    <section class="section">
      <div class="section-header reveal">
        <span class="section-tag">省份结构</span>
        <h2>主产省份产量与效率分布</h2>
        <div class="section-divider"></div>
        <p>气泡散点图：横轴产量，纵轴单产，气泡大小映射茶园面积</p>
      </div>
      <div class="chart-card reveal">
        <div ref="provinceRef" class="chart-box chart-box-lg"></div>
      </div>
    </section>

    <!-- ====== GLOBAL + PROVINCE BAR ====== -->
    <div class="section-full-alt">
      <div class="section-inner">
        <div class="section-header reveal">
          <span class="section-tag">全球格局</span>
          <h2>世界茶叶生产版图</h2>
          <div class="section-divider"></div>
          <p>主要产茶国产量玫瑰图 + 中国各省产量排名</p>
        </div>
        <div class="grid-2">
          <div class="chart-card reveal reveal-delay-1">
            <div ref="globalRef" class="chart-box"></div>
          </div>
          <div class="chart-dark-card reveal reveal-delay-2">
            <div ref="provinceBarRef" class="chart-box"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== ORIGIN STORIES ====== -->
    <section class="section">
      <div class="section-header reveal">
        <span class="section-tag">代表产地</span>
        <h2>近年热门产地故事</h2>
        <div class="section-divider"></div>
        <p>从贵州铜仁抹茶到云南普洱茶，探索中国茶叶地理版图的多样与精彩</p>
      </div>
      <div class="grid-2">
        <div v-for="(item, idx) in originRows" :key="item.产地" class="origin-card reveal" :class="'reveal-delay-' + (idx + 1)">
          <span class="card-tag">{{ item.代表茶 }}</span>
          <h3>{{ item.产地 }}</h3>
          <p class="card-desc">{{ item.地理特点 }}</p>
          <div class="card-meta">
            <span v-for="tag in String(item.核心数据维度).split('、')" :key="tag" class="meta-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { originCasesRows, provinceOutputRows, globalProductionRows } from "../data/embedded";

const originRows = ref([]);
const provinceRows = ref([]);
const globalRows = ref([]);

const provinceRef = ref(null);
const globalRef = ref(null);
const provinceBarRef = ref(null);
let charts = {};

const PALETTE = ["#3d5a3e", "#6c4f3d", "#88a67e", "#c4a265", "#5a7d5b", "#b08968"];
const DARK_PALETTE = ["#88a67e", "#c4a265", "#5a7d5b", "#b08968", "#d4c8b8", "#e8dcc8"];

function initChart(key, elRef) { if (!elRef.value) return null; if (charts[key]) charts[key].dispose(); charts[key] = echarts.init(elRef.value); return charts[key]; }
function lightTooltip() { return { backgroundColor: "rgba(255,255,255,0.96)", borderColor: "#e8e0d5", textStyle: { color: "#3d352d", fontSize: 13 } }; }
function darkTooltip() { return { backgroundColor: "rgba(26,23,20,0.92)", borderColor: "rgba(196,162,101,0.2)", textStyle: { color: "#e8e0d5", fontSize: 13 } }; }
function lightAxis() { return { axisLine: { lineStyle: { color: "#d4c8b8" } }, axisTick: { lineStyle: { color: "#d4c8b8" } }, axisLabel: { color: "#7a6e62", fontSize: 12 }, splitLine: { lineStyle: { color: "#ece5db" } }, nameTextStyle: { color: "#7a6e62", fontSize: 12 } }; }
function darkAxis() { return { axisLine: { lineStyle: { color: "rgba(200,190,175,0.2)" } }, axisTick: { lineStyle: { color: "rgba(200,190,175,0.15)" } }, axisLabel: { color: "rgba(200,190,175,0.7)", fontSize: 12 }, splitLine: { lineStyle: { color: "rgba(200,190,175,0.07)" } }, nameTextStyle: { color: "rgba(200,190,175,0.6)", fontSize: 12 } }; }

function renderProvince() {
  const chart = initChart("province", provinceRef);
  if (!chart || !provinceRows.value.length) return;
  chart.setOption({
    tooltip: { ...lightTooltip(), trigger: "item", formatter: (p) => `<strong>${p.data.name}</strong><br/>产量: ${p.data.value[0]} 万吨<br/>单产: ${p.data.value[1]} 公斤/亩<br/>面积: ${p.data.area} 万亩` },
    grid: { left: 60, right: 30, top: 36, bottom: 40 },
    xAxis: { type: "value", name: "产量(万吨)", ...lightAxis() },
    yAxis: { type: "value", name: "单产(公斤/亩)", ...lightAxis() },
    series: [{
      type: "scatter", symbolSize: (v, p) => Math.max(16, p.data.area / 12),
      data: provinceRows.value.map((r) => ({ name: r.省份, value: [Number(r.茶叶产量_万吨), Number(r.单产_公斤每亩)], area: Number(r.茶园面积_万亩) })),
      label: { show: true, formatter: "{b}", position: "top", color: "#3d352d", fontSize: 12 },
      itemStyle: { color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [{ offset: 0, color: "rgba(61,90,62,0.7)" }, { offset: 1, color: "rgba(61,90,62,0.15)" }]), borderColor: "#3d5a3e", borderWidth: 1.5 },
      emphasis: { itemStyle: { shadowBlur: 16, shadowColor: "rgba(61,90,62,0.3)" } },
    }],
  });
}

function renderGlobal() {
  const chart = initChart("global", globalRef);
  if (!chart || !globalRows.value.length) return;
  chart.setOption({
    tooltip: { ...lightTooltip(), trigger: "item" },
    legend: { bottom: 8, textStyle: { color: "#7a6e62", fontSize: 12 }, itemGap: 12 },
    series: [{
      type: "pie", roseType: "radius", radius: ["22%", "65%"], center: ["50%", "46%"],
      data: globalRows.value.map((r) => ({ name: r.国家, value: Number(r.茶叶产量_万吨) })),
      label: { color: "#3d352d", fontSize: 12 },
      itemStyle: { borderColor: "#fff", borderWidth: 2, borderRadius: 4 },
      emphasis: { itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.12)" } },
    }],
    color: PALETTE,
  });
}

function renderProvinceBar() {
  const chart = initChart("provinceBar", provinceBarRef);
  if (!chart || !provinceRows.value.length) return;
  const sorted = [...provinceRows.value].sort((a, b) => Number(b.茶叶产量_万吨) - Number(a.茶叶产量_万吨));
  chart.setOption({
    tooltip: { ...darkTooltip(), trigger: "axis" },
    grid: { left: 80, right: 30, top: 20, bottom: 30 },
    xAxis: { type: "value", ...darkAxis() },
    yAxis: { type: "category", data: sorted.map((r) => r.省份), inverse: true, ...darkAxis() },
    series: [{
      type: "bar", data: sorted.map((r) => Number(r.茶叶产量_万吨)),
      itemStyle: { borderRadius: [0, 4, 4, 0], color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "rgba(196,162,101,0.3)" }, { offset: 1, color: "#c4a265" }]) },
      label: { show: true, position: "right", color: "#c4a265", fontSize: 12 },
    }],
  });
}

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
  originRows.value = originCasesRows;
  provinceRows.value = provinceOutputRows;
  globalRows.value = globalProductionRows;
  await nextTick();
  renderProvince(); renderGlobal(); renderProvinceBar();
  window.addEventListener("resize", onResize);
  setupReveal();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  observer?.disconnect();
  Object.values(charts).forEach((c) => c?.dispose());
});
</script>


