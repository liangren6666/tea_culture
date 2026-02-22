<template>
  <div class="home-page">
    <!-- ====== HERO ====== -->
    <section class="hero">
      <p class="hero-kicker">Tea Data Visualization</p>
      <h1>《茶韵山河》<br />中国茶叶可视化探索</h1>
      <div class="hero-line"></div>
      <p class="subtitle">以数据为经、以文化为纬<br />探索中国茶叶的品类、产地、趋势与创新</p>
      <div class="hero-scroll-hint">
        <span>向下探索</span>
        <span class="arrow"></span>
      </div>
    </section>

    <!-- ====== CAROUSEL ====== -->
    <section class="section">
      <div class="section-header reveal">
        <span class="section-tag">风光掠影</span>
        <h2>中国茶乡胜景</h2>
        <div class="section-divider"></div>
        <p>云雾缭绕的茶山、层叠的梯田、勤劳的采茶人——走进中国茶叶核心产区</p>
      </div>
      <div class="carousel-wrap reveal">
        <el-carousel :interval="4500" height="480px" arrow="hover" indicator-position="outside" :pause-on-hover="true">
          <el-carousel-item v-for="slide in carouselSlides" :key="slide.img">
            <div class="carousel-slide">
              <img :src="slide.img" :alt="slide.title" />
              <div class="carousel-overlay">
                <h3>{{ slide.title }}</h3>
                <p>{{ slide.desc }}</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- ====== STATS ====== -->
    <div class="stat-bar reveal">
      <div class="stat-item" v-for="s in stats" :key="s.label">
        <span class="stat-number" ref="counterEls">{{ s.display }}</span>
        <span class="stat-suffix" v-if="s.suffix">{{ s.suffix }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- ====== TEA INTRO ====== -->
    <div class="section-full-alt">
      <div class="section-inner">
        <div class="section-header reveal">
          <span class="section-tag">品类鉴赏</span>
          <h2>五大茶类概览</h2>
          <div class="section-divider"></div>
          <p>一叶一世界——绿茶的鲜爽、红茶的醇厚、白茶的清雅、乌龙的韵味、茉莉的芬芳</p>
        </div>
        <div class="tea-intro-grid reveal">
          <div v-for="tea in teaIntros" :key="tea.name" class="tea-intro-card">
            <div class="tea-intro-img">
              <img :src="tea.img" :alt="tea.name" />
              <div class="tea-intro-badge">{{ tea.badge }}</div>
            </div>
            <div class="tea-intro-body">
              <h3>{{ tea.name }}</h3>
              <p class="tea-intro-en">{{ tea.en }}</p>
              <p class="tea-intro-desc">{{ tea.desc }}</p>
              <div class="tea-intro-tags">
                <span v-for="tag in tea.tags" :key="tag" class="tea-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== FEATURE CARDS ====== -->
    <section class="section">
      <div class="section-header reveal">
        <span class="section-tag">开始探索</span>
        <h2>三大核心板块</h2>
        <div class="section-divider"></div>
        <p>从品类对比到产地溯源，再到创新茶饮，全面展示中国茶产业全景</p>
      </div>
      <div class="grid-3">
        <router-link to="/compare" class="feature-card reveal reveal-delay-1">
          <div class="feature-icon">🍃</div>
          <h3>茶叶全维度对比</h3>
          <p>五大茶类的外形、口感、成分、工序、功效深度对比分析</p>
          <span class="feature-arrow">→</span>
        </router-link>
        <router-link to="/origins" class="feature-card reveal reveal-delay-2">
          <div class="feature-icon">🏔️</div>
          <h3>产地故事与趋势</h3>
          <p>省份产区结构、全球格局、代表产地的数据叙事</p>
          <span class="feature-arrow">→</span>
        </router-link>
        <router-link to="/innovation" class="feature-card reveal reveal-delay-3">
          <div class="feature-icon">✨</div>
          <h3>创新茶饮类型</h3>
          <p>茶+茶、茶+非茶、茶+跨界三大创新方向全景浏览</p>
          <span class="feature-arrow">→</span>
        </router-link>
      </div>
    </section>

    <!-- ====== TIMELINE ====== -->
    <section class="section">
      <div class="section-header reveal">
        <span class="section-tag">文化纵深</span>
        <h2>中国茶文化里程碑</h2>
        <div class="section-divider"></div>
        <p>从上古传说到世界非遗，跨越五千年的茶之旅</p>
      </div>
      <div class="timeline reveal">
        <div class="timeline-track">
          <div class="timeline-item" v-for="(ev, idx) in timeline" :key="idx">
            <div class="timeline-dot"></div>
            <div class="timeline-year">{{ ev.year }}</div>
            <div class="timeline-card">
              <span class="timeline-era">{{ ev.era }}</span>
              <p>{{ ev.event }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== CTA ====== -->
    <section class="section" style="text-align: center;">
      <div class="reveal">
        <h2 class="cta-title">准备好深入了解了吗？</h2>
        <p class="cta-desc">点击下方开始探索五大茶类的全维度对比分析</p>
        <router-link to="/compare" class="cta-btn">开始探索 →</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive } from "vue";

/* ====== CAROUSEL DATA ====== */
const carouselSlides = [
  // 注意：这里使用相对路径 \"images/...\"，保证：
  // 1) 开发环境：http://localhost:5173/images/... 正常
  // 2) 打包后 dist/index.html 相对 dist/images/... 正常
  // 3) Electron 加载 file:///.../dist/index.html 时也能找到图片
  { img: "images/carousel1.jpg", title: "雾锁茶山", desc: "层峦叠嶂的茶园梯田，在晨雾中若隐若现" },
  { img: "images/carousel2.jpg", title: "日出茶乡", desc: "阳光洒满万亩茶园，蜿蜒山路串联起千年茶韵" },
  { img: "images/carousel3.jpg", title: "心形茶田", desc: "大自然的浪漫馈赠——俯瞰林间心形茶园" },
  { img: "images/carousel4.jpg", title: "抹茶采摘", desc: "贵州铜仁的抹茶茶园，机械化采摘正当时" },
  { img: "images/carousel5.jpg", title: "茶山人家", desc: "茶园环绕的山间村落，人与茶和谐共生" },
];

/* ====== TEA INTRO DATA ====== */
const teaIntros = [
  {
    name: "绿茶", en: "Green Tea", badge: "不发酵",
    img: "images/tea_green.jpg",
    desc: "绿茶是中国产量最大的茶类，以杀青工艺锁住鲜叶的翠绿与清香。茶多酚含量丰富，口感鲜爽回甘，素有「国饮」之称。",
    tags: ["龙井", "碧螺春", "毛峰", "清热解毒"],
  },
  {
    name: "红茶", en: "Black Tea", badge: "全发酵",
    img: "images/tea_black.jpg",
    desc: "红茶经过完全发酵，茶汤红亮、滋味醇厚甘甜。既适合清饮，也是奶茶的经典基底，是世界上消费量最大的茶类。",
    tags: ["正山小种", "祁红", "滇红", "暖胃养生"],
  },
  {
    name: "白茶", en: "White Tea", badge: "微发酵",
    img: "images/tea_white.jpg",
    desc: "白茶以最简约的工艺著称——不炒不揉，日晒萎凋。银针白毫满披，汤色浅淡，滋味清雅甘甜，「越陈越香」是其独特魅力。",
    tags: ["白毫银针", "白牡丹", "寿眉", "美容养颜"],
  },
  {
    name: "乌龙茶", en: "Oolong Tea", badge: "半发酵",
    img: "images/tea_oolong.png",
    desc: "乌龙茶兼具绿茶的清香与红茶的醇厚，以精湛的「做青」工艺闻名。铁观音的兰花香、大红袍的岩骨花香，变幻无穷。",
    tags: ["铁观音", "大红袍", "凤凰单丛", "降脂减肥"],
  },
  {
    name: "茉莉花茶", en: "Jasmine Tea", badge: "再加工",
    img: "images/tea_jasmine.jpg",
    desc: "以绿茶为茶坯、鲜茉莉花窨制而成，花香与茶韵交融。老北京人的「茶中之友」，一壶茉莉花茶是最温暖的日常仪式。",
    tags: ["茉莉银针", "碧潭飘雪", "窨制工艺", "提神醒脑"],
  },
];

/* ====== STATIC DATA ====== */
const timeline = [
  { year: "前2737", era: "上古", event: "传说神农尝百草，发现茶叶解毒之效" },
  { year: "前59", era: "汉代", event: "王褒《僮约》首次以文字记载饮茶习俗" },
  { year: "760", era: "唐代", event: "陆羽著《茶经》——世界第一部茶学专著" },
  { year: "1391", era: "明代", event: "明太祖废团茶兴散茶，改变饮茶方式" },
  { year: "1610", era: "明代", event: "中国茶叶经荷兰商船首次出口欧洲" },
  { year: "1773", era: "清代", event: "波士顿倾茶事件，茶叶改变世界历史" },
  { year: "1915", era: "民国", event: "中国茶叶在巴拿马万国博览会获金奖" },
  { year: "2019", era: "现代", event: "联合国确立每年5月21日为国际茶日" },
  { year: "2022", era: "现代", event: "中国传统制茶技艺入选人类非物质文化遗产" },
];

/* ====== REACTIVE DATA ====== */
const stats = reactive([
  { label: "大类茶叶", target: 5, display: 0, suffix: "种" },
  { label: "覆盖省份", target: 18, display: 0, suffix: "个" },
  { label: "创新茶饮", target: 24, display: 0, suffix: "款" },
  { label: "数据维度", target: 12, display: 0, suffix: "项" },
]);

/* ====== ANIMATED COUNTER ====== */
function animateCounters() {
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    stats.forEach((s) => { s.display = Math.round(s.target * ease); });
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}


/* ====== SCROLL REVEAL ====== */
let observer = null;
function setupReveal() {
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ====== LIFECYCLE ====== */
onMounted(async () => {
  animateCounters();
  await nextTick();
  setupReveal();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
/* ====== CAROUSEL ====== */
.carousel-wrap {
  max-width: 1100px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(61, 90, 62, 0.12);
}

.carousel-wrap :deep(.el-carousel__indicators--outside) {
  margin-top: 14px;
}

.carousel-wrap :deep(.el-carousel__indicator .el-carousel__button) {
  width: 28px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-border, #d4c8b8);
  opacity: 0.5;
}

.carousel-wrap :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background: var(--color-primary, #3d5a3e);
  opacity: 1;
  width: 40px;
}

.carousel-wrap :deep(.el-carousel__arrow) {
  background: rgba(15, 13, 10, 0.45);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 44px;
  height: 44px;
  font-size: 16px;
}

.carousel-wrap :deep(.el-carousel__arrow:hover) {
  background: rgba(15, 13, 10, 0.7);
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 6s ease;
}

.carousel-slide:hover img {
  transform: scale(1.05);
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px 40px 32px;
  background: linear-gradient(transparent, rgba(15, 13, 10, 0.75));
  color: #fff;
}

.carousel-overlay h3 {
  font-family: var(--font-serif, 'Noto Serif SC', serif);
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: 2px;
}

.carousel-overlay p {
  font-size: 15px;
  opacity: 0.85;
  letter-spacing: 1px;
}

/* ====== TEA INTRO GRID ====== */
.tea-intro-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tea-intro-card {
  background: rgba(15, 13, 10, 0.6);
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(196, 162, 101, 0.12);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.tea-intro-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.tea-intro-img {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.tea-intro-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.tea-intro-card:hover .tea-intro-img img {
  transform: scale(1.08);
}

.tea-intro-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(196, 162, 101, 0.85);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 1px;
  backdrop-filter: blur(4px);
}

.tea-intro-body {
  padding: 18px 16px 20px;
}

.tea-intro-body h3 {
  font-family: var(--font-serif, 'Noto Serif SC', serif);
  font-size: 20px;
  font-weight: 600;
  color: rgba(232, 224, 213, 0.95);
  margin-bottom: 2px;
}

.tea-intro-en {
  font-size: 12px;
  color: rgba(196, 162, 101, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}

.tea-intro-desc {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(200, 190, 175, 0.7);
  margin-bottom: 14px;
}

.tea-intro-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tea-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(196, 162, 101, 0.1);
  color: rgba(196, 162, 101, 0.75);
  border: 1px solid rgba(196, 162, 101, 0.15);
  white-space: nowrap;
}

/* ====== RESPONSIVE ====== */
@media (max-width: 1100px) {
  .tea-intro-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .carousel-slide {
    height: 280px;
  }
  .carousel-wrap :deep(.el-carousel) {
    height: 280px !important;
  }
  .carousel-overlay h3 {
    font-size: 20px;
  }
  .carousel-overlay p {
    font-size: 13px;
  }
  .tea-intro-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .tea-intro-grid {
    grid-template-columns: 1fr;
  }
}
</style>
