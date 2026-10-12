import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getErrorMessage(payload, fallback) {
  return payload?.details || payload?.error || fallback;
}

function ScrollZoomHero() {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const titleScale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, 1.28],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -76],
  );
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.82, 1],
    shouldReduceMotion ? [1, 1, 1] : [1, 0.7, 0],
  );
  const haloScale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [0.72, 1.35],
  );
  const haloRotate = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 28],
  );
  const cardY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 54],
  );
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, 0.18],
    shouldReduceMotion ? [1, 1] : [1, 0],
  );

  return (
    <section
      ref={containerRef}
      className="relative -mx-5 h-[145svh] sm:-mx-8"
      aria-label="แนะนำเครื่องมือสรุปรายงาน"
    >
      <div className="sticky top-[68px] flex h-[calc(100svh-68px)] min-h-[540px] items-center justify-center overflow-hidden">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[min(82vw,650px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(216,232,218,0.58)_0%,_rgba(240,247,240,0.36)_38%,_rgba(255,255,255,0)_72%)]"
          style={{ scale: haloScale, rotate: haloRotate }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[min(58vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-900/[0.06]"
          style={{ scale: haloScale, rotate: haloRotate }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute left-[max(8%,calc(50%-360px))] top-[28%] hidden w-40 rotate-[-8deg] rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-[0_16px_50px_rgba(25,40,28,0.05)] backdrop-blur-sm sm:block"
          style={{ y: cardY, opacity: titleOpacity }}
          aria-hidden="true"
        >
          <div className="mb-4 h-2 w-14 rounded-full bg-emerald-900/15" />
          <div className="mb-2 h-1.5 w-full rounded-full bg-stone-200" />
          <div className="mb-2 h-1.5 w-4/5 rounded-full bg-stone-200" />
          <div className="h-1.5 w-3/5 rounded-full bg-stone-200" />
        </motion.div>
        <motion.div
          className="relative z-10 mx-auto max-w-3xl px-5 text-center"
          style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/85 px-3.5 py-2 text-xs font-medium text-emerald-900 shadow-sm backdrop-blur">
            <svg
              className="size-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="m10 1 1.85 5.65L17.5 8.5l-5.65 1.85L10 16l-1.85-5.65L2.5 8.5l5.65-1.85L10 1Zm6 11 .92 2.58L19.5 15.5l-2.58.92L16 19l-.92-2.58-2.58-.92 2.58-.92L16 12Z" />
            </svg>
            สรุปไว เข้าใจง่าย
          </div>
          <h1 className="mb-4 text-4xl leading-[1.12] font-semibold tracking-[-0.055em] text-stone-950 sm:text-6xl">
            เปลี่ยนรายงานยาว
            <br />
            <span className="text-emerald-900">ให้เป็นเรื่องง่าย</span>
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-7 text-stone-500 sm:text-base">
            สกัดประเด็นสำคัญ ปัญหา และข้อเสนอแนะ
            <br className="hidden sm:block" /> จากข้อความหรือไฟล์รายงานของคุณ
          </p>
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-stone-400 uppercase"
          style={{ opacity: scrollHintOpacity }}
          aria-hidden="true"
        >
          <span>เลื่อนลงเพื่อเริ่ม</span>
          <span className="h-8 w-px bg-gradient-to-b from-emerald-800/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function Reveal({ children, className = '', delay = 0 }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transform-gpu transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Summary({ summary }) {
  if (!summary) return null;

  const sections = [
    { title: 'ภาพรวม', content: summary.overview, icon: '01' },
    { title: 'ประเด็นสำคัญ', content: summary.keyPoints, icon: '02' },
    { title: 'ปัญหาหรืออุปสรรค', content: summary.problems, icon: '03' },
    {
      title: 'ข้อมูลสำคัญ',
      content: summary.importantData,
      list: true,
      icon: '04',
    },
    {
      title: 'ข้อเสนอแนะ',
      content: summary.recommendations,
      list: true,
      icon: '05',
    },
  ];

  return (
    <section className="mt-14 scroll-mt-8" aria-live="polite">
      <Reveal>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
              สรุปเสร็จแล้ว
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              สรุปรายงาน
            </h2>
          </div>
          <span className="hidden rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-500 sm:inline-flex">
            สร้างด้วย AI
          </span>
        </div>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map(({ title, content, list, icon }, index) => (
          <Reveal
            className={index === 0 ? 'sm:col-span-2' : ''}
            delay={index * 70}
            key={title}
          >
            <article className="group h-full rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(25,40,28,0.035)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_14px_35px_rgba(25,40,28,0.08)]">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-[10px] font-semibold tracking-wide text-emerald-800 transition-colors group-hover:bg-emerald-100">
                  {icon}
                </span>
                <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
              </div>
              {Array.isArray(content) ? (
                content.length ? (
                  <ul className="space-y-2.5 pl-1">
                    {content.map((item, itemIndex) => (
                      <li
                        className="flex gap-2.5 text-sm leading-7 text-stone-600"
                        key={`${title}-${itemIndex}`}
                      >
                        <span
                          className="mt-[11px] size-1.5 shrink-0 rounded-full bg-emerald-600"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-400">ไม่มีข้อมูล</p>
                )
              ) : list ? (
                <p className="text-sm text-stone-400">ไม่มีข้อมูล</p>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-7 text-stone-600">
                  {content || 'ไม่มีข้อมูล'}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setSummary(null);
  }

  function selectFile(event) {
    const selected = event.target.files?.[0] || null;
    setError('');
    setSummary(null);

    if (!selected) {
      setFile(null);
      return;
    }

    const extension = selected.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'txt'].includes(extension)) {
      setFile(null);
      event.target.value = '';
      setError('รองรับเฉพาะไฟล์ PDF หรือ TXT');
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      event.target.value = '';
      setError('ไฟล์ต้องมีขนาดไม่เกิน 10 MB');
      return;
    }

    setFile(selected);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSummary(null);

    if (mode === 'text' && !text.trim()) {
      setError('กรุณาวางข้อความรายงานก่อนสรุป');
      return;
    }

    if (mode === 'file' && !file) {
      setError('กรุณาเลือกไฟล์ PDF หรือ TXT');
      return;
    }

    setLoading(true);
    try {
      const request =
        mode === 'text'
          ? fetch('/api/reports/summarize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text }),
            })
          : (() => {
              const formData = new FormData();
              formData.append('file', file);
              return fetch('/api/reports/upload', {
                method: 'POST',
                body: formData,
              });
            })();

      const response = await request;
      const responseBody = await response.text();
      let payload = {};
      try {
        payload = responseBody ? JSON.parse(responseBody) : {};
      } catch {
        payload = {};
      }
      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            payload,
            `เซิร์ฟเวอร์ตอบกลับ ${response.status} ${response.statusText || ''}`.trim(),
          ),
        );
      }

      if (!payload.summary) {
        throw new Error('เซิร์ฟเวอร์ไม่ได้ส่งผลสรุปกลับมา กรุณาลองอีกครั้ง');
      }
      setSummary(payload.summary);
    } catch (submitError) {
      setError(
        submitError.message ||
          'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่า backend กำลังทำงานอยู่',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <a
            className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-stone-900"
            href="/"
            aria-label="สรุปรายงานด้วย AI"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-950 text-sm font-semibold text-white shadow-sm transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
              A
            </span>
            <span>รายงานสรุป</span>
          </a>
          <span className="hidden text-[10px] font-semibold tracking-[0.2em] text-stone-400 sm:block">
            AI REPORT SUMMARIZER
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1.5 text-[11px] font-medium text-stone-600">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-40 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
            </span>
            พร้อมใช้งาน
          </span>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
        <ScrollZoomHero />

        <Reveal className="relative mx-auto max-w-2xl" delay={100}>
          <section className="rounded-3xl border border-stone-200/80 bg-white p-4 shadow-[0_24px_80px_rgba(28,42,31,0.08)] sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-stone-900">
                  เพิ่มรายงาน
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  เลือกวิธีที่สะดวกสำหรับคุณ
                </p>
              </div>
              <span className="hidden rounded-lg bg-stone-50 px-2.5 py-1.5 text-[11px] font-medium text-stone-500 sm:block">
                PDF · TXT · ข้อความ
              </span>
            </div>

            <div
              className="mb-5 grid grid-cols-2 rounded-xl bg-stone-100/80 p-1"
              role="tablist"
              aria-label="วิธีใส่รายงาน"
            >
              <button
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                  mode === 'text'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                type="button"
                role="tab"
                aria-selected={mode === 'text'}
                onClick={() => changeMode('text')}
              >
                วางข้อความ
              </button>
              <button
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                  mode === 'file'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                type="button"
                role="tab"
                aria-selected={mode === 'file'}
                onClick={() => changeMode('file')}
              >
                อัปโหลดไฟล์
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === 'text' ? (
                <label
                  className="block text-sm font-medium text-stone-700"
                  htmlFor="report-text"
                >
                  เนื้อหารายงาน
                  <textarea
                    className="mt-2.5 min-h-56 w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm leading-7 text-stone-800 outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-900/5 disabled:bg-stone-50"
                    id="report-text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="วางหรือพิมพ์เนื้อหารายงานที่นี่..."
                    rows={9}
                    maxLength={100000}
                    disabled={loading}
                  />
                  <span className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px] font-normal text-stone-400">
                    <span>ข้อความจะถูกใช้เพื่อสร้างสรุปเท่านั้น</span>
                    <span>{text.length.toLocaleString('th-TH')} / 100,000</span>
                  </span>
                </label>
              ) : (
                <div>
                  <span className="text-sm font-medium text-stone-700">
                    ไฟล์รายงาน
                  </span>
                  <label
                    className="group mt-2.5 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50/50 px-5 py-8 text-center transition duration-300 hover:border-emerald-500 hover:bg-emerald-50/40"
                    htmlFor="report-file"
                  >
                    <span className="mb-4 grid size-12 place-items-center rounded-2xl border border-stone-200 bg-white text-emerald-900 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3.25c0 .97.78 1.75 1.75 1.75h10.5c.97 0 1.75-.78 1.75-1.75V15"
                        />
                      </svg>
                    </span>
                    <strong className="max-w-full truncate text-sm font-semibold text-stone-800">
                      {file ? file.name : 'คลิกเพื่อเลือกไฟล์'}
                    </strong>
                    <span className="mt-1.5 text-xs font-normal text-stone-500">
                      {file
                        ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : 'รองรับ PDF หรือ TXT ขนาดไม่เกิน 10 MB'}
                    </span>
                    <input
                      className="sr-only"
                      id="report-file"
                      type="file"
                      accept=".pdf,.txt,application/pdf,text/plain"
                      onChange={selectFile}
                      disabled={loading}
                    />
                  </label>
                </div>
              )}

              {error && (
                <p
                  className="mt-4 animate-fade-up rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(6,45,28,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-[0_10px_22px_rgba(6,45,28,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 active:translate-y-0 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      aria-hidden="true"
                    />
                    กำลังสรุปรายงาน...
                  </>
                ) : (
                  <>
                    สรุปรายงาน
                    <svg
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 10h12m-5-5 5 5-5 5"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </section>
        </Reveal>

        {summary && (
          <div className="mx-auto max-w-4xl">
            <Summary summary={summary} />
          </div>
        )}

        <footer className="mx-auto mt-12 max-w-2xl border-t border-stone-100 pt-5 text-center text-[11px] leading-6 text-stone-400">
          ผลสรุปจาก AI อาจมีความคลาดเคลื่อน โปรดตรวจสอบข้อมูลสำคัญอีกครั้ง
        </footer>
      </div>
    </main>
  );
}
