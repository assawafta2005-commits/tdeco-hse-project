import React, { useState, useMemo } from "react";
import { ChevronLeft, Search, Plus, Trash2, FileText } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import Modal from "../components/common/Modal";
import RoleGate from "../components/auth/RoleGate";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import { MANUAL_CATEGORIES } from "../data/manualMock";
import {
  listManualSections, listManualVolumes,
  createManualSection, deleteManualSection,
  createManualVolume, deleteManualVolume,
} from "../services/documentsService";
import { useServiceData } from "../hooks/useServiceData";
import { useAuth } from "../hooks/useAuth";
import { PERMISSIONS } from "../utils/roles";

const EMPTY_SECTION = { code: "", title: "", desc: "", tag: MANUAL_CATEGORIES[1] ?? "" };
const EMPTY_VOLUME = { title: "", code: "", pages: "" };

function ManualPage() {
  const { user } = useAuth();
  const sectionsData = useServiceData(listManualSections, []);
  const volumesData = useServiceData(listManualVolumes, []);

  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [sectionForm, setSectionForm] = useState(EMPTY_SECTION);
  const [volumeForm, setVolumeForm] = useState(EMPTY_VOLUME);
  const [saving, setSaving] = useState(false);

  const sections = sectionsData.rows;
  const volumes = volumesData.rows;

  const filtered = useMemo(() => {
    let list = activeCategory === "الكل" ? sections : sections.filter((s) => s.tag === activeCategory);
    if (search.trim()) {
      const q = search.trim();
      list = list.filter((s) => `${s.title} ${s.desc} ${s.code} ${s.tag}`.includes(q));
    }
    return list;
  }, [activeCategory, sections, search]);

  // Header stats derive from real data instead of hardcoded figures.
  // Page counts are stored as strings like "342 صفحة" — parse the leading
  // number, ignoring any volume without a parseable count.
  const totalPages = useMemo(
    () => volumes.reduce((sum, v) => sum + (parseInt(String(v.pages).replace(/[^\d]/g, ""), 10) || 0), 0),
    [volumes]
  );
  const editionYear = useMemo(() => {
    const years = volumes.map((v) => v.year).filter(Boolean);
    return years.length ? Math.max(...years.map(Number)) : new Date().getFullYear();
  }, [volumes]);

  const handleCreateSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    await createManualSection(sectionForm, user?.uid);
    setSaving(false);
    setShowSectionModal(false);
    setSectionForm(EMPTY_SECTION);
    sectionsData.reload();
  };

  const handleCreateVolume = async (e) => {
    e.preventDefault();
    setSaving(true);
    await createManualVolume(volumeForm, user?.uid);
    setSaving(false);
    setShowVolumeModal(false);
    setVolumeForm(EMPTY_VOLUME);
    volumesData.reload();
  };

  return (
    <div className="space-y-6">
      {(sectionsData.source === "mock" || volumesData.source === "mock") && <MockBadge />}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">دليل السلامة والصحة المهنية</h2>
            <p className="text-sm text-slate-500 mt-1">المرجع الموحد لجميع سياسات وإجراءات السلامة في الشركة</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الدليل..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xl font-bold text-slate-900">{totalPages.toLocaleString("ar-EG")}</p>
            <p className="text-xs text-slate-400 mt-0.5">صفحة موحدة</p>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">{volumes.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">مجلداً تخصيصياً</p>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">إصدار {editionYear}</p>
            <p className="text-xs text-slate-400 mt-0.5">آخر تحديث معتمد</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {MANUAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-amber-500 text-slate-900"
                : "bg-white text-slate-600 border border-slate-200 hover:border-amber-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div>
        <SectionHeading title="الموضوعات التشغيلية الأهم">
          <RoleGate permission={PERMISSIONS.MANAGE_HSE}>
            <button
              onClick={() => setShowSectionModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600"
            >
              <Plus size={14} /> إضافة موضوع
            </button>
          </RoleGate>
        </SectionHeading>
        <DataStatus
          status={sectionsData.status}
          error={sectionsData.error}
          onRetry={sectionsData.reload}
          emptyLabel="لا توجد موضوعات في الدليل حالياً"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((s, i) => {
              // Mock rows carry a React icon component; Firestore rows
              // can't, so fall back to a generic document icon.
              const Icon = typeof s.icon === "function" ? s.icon : FileText;
              return (
                <div key={s.id ?? i} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{s.code}</span>
                  </div>
                  <h4 className="mt-4 text-sm font-semibold text-slate-800">{s.title}</h4>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{s.tag}</span>
                    <div className="flex items-center gap-2">
                      <RoleGate permission={PERMISSIONS.MANAGE_HSE}>
                        {s.id && (
                          <button
                            onClick={async () => {
                              await deleteManualSection(s.id, user?.uid);
                              sectionsData.reload();
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </RoleGate>
                      <button className="flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800">
                        قراءة الإجراء
                        <ChevronLeft size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DataStatus>
      </div>

      <div>
        <SectionHeading title="مجلدات الدليل المعتمدة">
          <RoleGate permission={PERMISSIONS.MANAGE_HSE}>
            <button
              onClick={() => setShowVolumeModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600"
            >
              <Plus size={14} /> إضافة مجلد
            </button>
          </RoleGate>
        </SectionHeading>
        <DataStatus
          status={volumesData.status}
          error={volumesData.error}
          onRetry={volumesData.reload}
          emptyLabel="لا توجد مجلدات معتمدة حالياً"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {volumes.map((v, i) => (
              <div
                key={v.id ?? i}
                className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3 hover:border-amber-300 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{v.title}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2 font-mono text-[10px] text-slate-400">
                    <span className="truncate">{v.code}</span>
                    <span className="shrink-0">{v.pages}</span>
                  </div>
                </div>
                <RoleGate permission={PERMISSIONS.MANAGE_HSE}>
                  {v.id && (
                    <button
                      onClick={async () => {
                        await deleteManualVolume(v.id, user?.uid);
                        volumesData.reload();
                      }}
                      className="text-rose-500 hover:text-rose-700 shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </RoleGate>
              </div>
            ))}
          </div>
        </DataStatus>
      </div>

      {showSectionModal && (
        <Modal title="إضافة موضوع للدليل" onClose={() => setShowSectionModal(false)}>
          <form onSubmit={handleCreateSection} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">رمز الوثيقة</label>
              <input required value={sectionForm.code} onChange={(e) => setSectionForm({ ...sectionForm, code: e.target.value })} placeholder="ELEC-04.3" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">العنوان</label>
              <input required value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">الوصف</label>
              <textarea value={sectionForm.desc} onChange={(e) => setSectionForm({ ...sectionForm, desc: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm h-20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">التصنيف</label>
              <select value={sectionForm.tag} onChange={(e) => setSectionForm({ ...sectionForm, tag: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm">
                {MANUAL_CATEGORIES.filter((c) => c !== "الكل").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-60">
                {saving ? "جارٍ الحفظ..." : "إضافة"}
              </button>
              <button type="button" onClick={() => setShowSectionModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs">إلغاء</button>
            </div>
            {sectionsData.source === "mock" && (
              <p className="text-[11px] text-amber-600">ملاحظة: Firebase غير مهيأ — لن يتم الحفظ فعليًا (وضع تجريبي).</p>
            )}
          </form>
        </Modal>
      )}

      {showVolumeModal && (
        <Modal title="إضافة مجلد للدليل" onClose={() => setShowVolumeModal(false)}>
          <form onSubmit={handleCreateVolume} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">اسم المجلد</label>
              <input required value={volumeForm.title} onChange={(e) => setVolumeForm({ ...volumeForm, title: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">رمز المجلد</label>
              <input value={volumeForm.code} onChange={(e) => setVolumeForm({ ...volumeForm, code: e.target.value })} placeholder="TDECO-HSE-MAN-001" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">عدد الصفحات</label>
              <input value={volumeForm.pages} onChange={(e) => setVolumeForm({ ...volumeForm, pages: e.target.value })} placeholder="342 صفحة" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm" />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-60">
                {saving ? "جارٍ الحفظ..." : "إضافة"}
              </button>
              <button type="button" onClick={() => setShowVolumeModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs">إلغاء</button>
            </div>
            {volumesData.source === "mock" && (
              <p className="text-[11px] text-amber-600">ملاحظة: Firebase غير مهيأ — لن يتم الحفظ فعليًا (وضع تجريبي).</p>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}

export default ManualPage;
