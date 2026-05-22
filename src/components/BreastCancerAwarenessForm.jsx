import React, { useState, useRef } from 'react';

/* ── Reusable Components (Upgraded UI) ── */

const RadioPill = ({ name, value, label, hasError }) => (
    <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 border-2
        ${hasError ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:shadow-sm'}`}>
        <input type="radio" name={name} value={value} className="radio-custom" />
        {label}
    </label>
);

const CheckboxCard = ({ name, value, label, hasError }) => (
    <label className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm cursor-pointer transition-all duration-200 border-2
        ${hasError ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-700 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:shadow-sm'}`}>
        <input type="checkbox" name={name} value={value} className="checkbox-custom" />
        {label}
    </label>
);

const YesNoTable = ({ prefix, statements, errors }) => (
    <div className="overflow-x-auto -mx-2 pb-2 custom-scrollbar">
        <table className="w-full text-sm min-w-[500px]">
            <thead>
                <tr className="border-b-2 border-slate-200">
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Statement</th>
                    {['Yes', 'No', "Don't Know"].map(h => (
                        <th key={h} className="px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider text-center w-28">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {statements.map((s, i) => {
                    const n = `${prefix}_${i}`;
                    const err = errors[n];
                    return (
                        <tr key={i} className={`border-b border-slate-100 last:border-0 transition-colors ${err ? 'bg-red-50' : 'hover:bg-fuchsia-50/30'}`}>
                            <td className={`px-4 py-3.5 transition-colors leading-relaxed ${err ? 'text-red-700 font-medium' : 'text-slate-700'}`}>{s}</td>
                            {['Yes', 'No', "Don't Know"].map(v => (
                                <td key={v} className="px-4 py-3.5 text-center">
                                    <input type="radio" name={n} value={v} className="table-radio" />
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

const LikertTable = ({ prefix, statements, errors }) => {
    const opts = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];
    return (
        <div className="overflow-x-auto -mx-2 pb-2 custom-scrollbar">
            <table className="w-full text-sm min-w-[700px]">
                <thead>
                    <tr className="border-b-2 border-slate-200">
                        <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Statement</th>
                        {opts.map(o => (
                            <th key={o} className="px-2 py-3 text-slate-500 font-semibold text-center text-[10px] uppercase tracking-wider leading-tight min-w-[100px]">{o}</th>
                        ))}
                    </tr>
                </thead>
            <tbody>
                {statements.map((s, i) => {
                    const n = `${prefix}_${i}`;
                    const err = errors[n];
                    return (
                        <tr key={i} className={`border-b border-slate-100 last:border-0 transition-colors ${err ? 'bg-red-50' : 'hover:bg-fuchsia-50/30'}`}>
                            <td className={`px-4 py-3.5 transition-colors leading-relaxed ${err ? 'text-red-700 font-medium' : 'text-slate-700'}`}>{s}</td>
                            {opts.map(v => (
                                <td key={v} className="px-2 py-3.5 text-center">
                                    <input type="radio" name={n} value={v} className="table-radio" />
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    );
};

const Section = ({ id, letter, title, hasErrors, errorCount, children }) => (
    <fieldset
        id={id}
        className={`rounded-2xl backdrop-blur-md border-2 transition-all duration-300 overflow-hidden shadow-lg
            ${hasErrors 
                ? 'border-red-300 bg-white/80 shadow-red-100/50' 
                : 'border-white/50 bg-white/60 hover:shadow-fuchsia-100/40'}`}
    >
        <div className={`px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 transition-colors
            ${hasErrors ? 'bg-red-50/80 border-red-200' : 'bg-gradient-to-r from-fuchsia-50/50 to-purple-50/50 border-slate-100'}`}>
            <div className="flex items-center gap-3 flex-1">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-md
                    ${hasErrors ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-fuchsia-500 to-purple-600'}`}>
                    {letter}
                </span>
                <legend className="text-base font-bold text-slate-800">{title}</legend>
            </div>
            {hasErrors && (
                <span className="text-[11px] font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-center">
                    {errorCount} unanswered
                </span>
            )}
        </div>
        <div className="p-6">{children}</div>
    </fieldset>
);

/* ── ⭐ PASTE YOUR GOOGLE APPS SCRIPT URL HERE ⭐ ── */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdamNXwB1i0tGJELDVse1TBmFX-35Pvq0oebA_7dK4zOA7Y-Btp557Gr9E1VYK5umxDw/exec';

/* ── Main Form ── */

const BreastCancerAwarenessForm = () => {
    const [errors, setErrors] = useState({});
    const [attempted, setAttempted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const formRef = useRef(null);

    const sectionFields = {
        A: ['age', 'marital', 'education', 'occupation', 'income', 'residence', 'priorAwareness'],
        B: Array.from({ length: 6 }, (_, i) => `secB_${i}`),
        C: Array.from({ length: 5 }, (_, i) => `secC_${i}`),
        D: Array.from({ length: 3 }, (_, i) => `secD_${i}`),
        E: ['bsePerformed', 'bseFrequency', 'cbePerformed', 'mammogram'],
        F: Array.from({ length: 7 }, (_, i) => `secF_${i}`),
        G: Array.from({ length: 4 }, (_, i) => `secG_${i}`),
        H: ['sources']
    };

    const allRequired = Object.values(sectionFields).flat();

    const getSectionErrorCount = (sec) => sectionFields[sec].filter(f => errors[f]).length;
    const getSectionHasErrors = (sec) => getSectionErrorCount(sec) > 0;

    const updateProgress = () => {
        if (!formRef.current) return;
        const groups = new Set();
        formRef.current.querySelectorAll('input[type="radio"]').forEach(r => groups.add(r.name));
        let filled = 0;
        const total = groups.size + 1;
        groups.forEach(name => {
            if (formRef.current.querySelector(`input[name="${name}"]:checked`)) filled++;
        });
        if (formRef.current.querySelector('input[name="sources"]:checked')) filled++;
        setProgress(total > 0 ? Math.round((filled / total) * 100) : 0);
    };

    const clearFieldError = (name) => {
        setErrors(prev => {
            if (!prev[name]) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    const handleChange = (e) => {
        updateProgress();
        if (!attempted) return;
        const name = e.target.name;
        if (name === 'sources') {
            if (formRef.current.querySelector('input[name="sources"]:checked')) clearFieldError('sources');
        } else {
            clearFieldError(name);
        }
    };

    const validate = () => {
        const errs = {};
        if (!formRef.current) return errs;
        allRequired.forEach(name => {
            if (name === 'sources') {
                if (!formRef.current.querySelector('input[name="sources"]:checked')) errs[name] = true;
            } else {
                if (!formRef.current.querySelector(`input[name="${name}"]:checked`)) errs[name] = true;
            }
        });
        return errs;
    };

    const collectFormData = () => {
        const data = {};
        if (!formRef.current) return data;
        const radioGroups = new Set();
        formRef.current.querySelectorAll('input[type="radio"]').forEach(r => radioGroups.add(r.name));
        radioGroups.forEach(name => {
            const checked = formRef.current.querySelector(`input[name="${name}"]:checked`);
            data[name] = checked ? checked.value : '';
        });
        const sourceValues = ['TV_Radio', 'Social_Media', 'LHW', 'Doctor_Nurse', 'Family_Friends', 'Seminars'];
        sourceValues.forEach(val => {
            const cb = formRef.current.querySelector(`input[name="sources"][value="${val}"]`);
            data[`source_${val}`] = cb && cb.checked ? 'Yes' : 'No';
        });
        return data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        const errs = validate();
        setErrors(errs);
        setAttempted(true);

        if (Object.keys(errs).length > 0) {
            const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            for (const sec of sections) {
                if (getSectionHasErrors(sec)) {
                    document.getElementById(`section-${sec.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    break;
                }
            }
            return;
        }

        const formData = collectFormData();
        setLoading(true);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setShowSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Submit error:', err);
            setSubmitError('Something went wrong. Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-rose-100">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-white/50">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 mb-3">Successfully Submitted</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed text-sm">Thank you for your participation. Your responses have been recorded and will contribute to improving breast cancer awareness in Peshawar.</p>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                            setErrors({});
                            setAttempted(false);
                            setProgress(0);
                            setSubmitError('');
                            formRef.current?.reset();
                        }}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold hover:from-fuchsia-700 hover:to-purple-700 transition-all shadow-lg shadow-fuchsia-200 hover:shadow-fuchsia-300 active:scale-95"
                    >
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-rose-50 to-purple-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-40 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                .radio-custom{appearance:none;-webkit-appearance:none;width:20px;height:20px;border:2px solid #CBD5E1;border-radius:50%;cursor:pointer;flex-shrink:0;transition:all .2s;position:relative}
                .radio-custom:hover{border-color:#D946EF;transform:scale(1.1)}
                .radio-custom:checked{border-color:transparent;background:linear-gradient(135deg, #D946EF, #9333EA);box-shadow: 0 4px 10px rgba(217, 70, 239, 0.3)}
                .radio-custom:checked::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:#fff;border-radius:50%}
                
                .checkbox-custom{appearance:none;-webkit-appearance:none;width:20px;height:20px;border:2px solid #CBD5E1;border-radius:6px;cursor:pointer;flex-shrink:0;transition:all .2s;position:relative}
                .checkbox-custom:hover{border-color:#D946EF}
                .checkbox-custom:checked{border-color:transparent;background:linear-gradient(135deg, #D946EF, #9333EA);box-shadow: 0 4px 10px rgba(217, 70, 239, 0.3)}
                .checkbox-custom:checked::after{content:'';position:absolute;top:2px;left:6px;width:5px;height:10px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
                
                .table-radio{appearance:none;-webkit-appearance:none;width:18px;height:18px;border:2px solid #CBD5E1;border-radius:50%;cursor:pointer;transition:all .2s;position:relative}
                .table-radio:hover{border-color:#D946EF;transform:scale(1.2)}
                .table-radio:checked{border-color:transparent;background:linear-gradient(135deg, #D946EF, #9333EA);box-shadow: 0 2px 8px rgba(217, 70, 239, 0.4)}
                .table-radio:checked::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;background:#fff;border-radius:50%}
                
                .custom-scrollbar::-webkit-scrollbar{height:6px}
                .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
                .custom-scrollbar::-webkit-scrollbar-thumb{background:linear-gradient(to right, #F9A8D4, #C084FC);border-radius:10px}
                
                @keyframes spin{to{transform:rotate(360deg)}}
                .spinner{width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
            `}</style>

            {/* Progress Bar */}
            <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 uppercase tracking-widest hidden sm:block">Progress</span>
                    <div className="flex-1 h-2.5 bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out shadow-sm shadow-fuchsia-500/50"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 tabular-nums w-12 text-right">{progress}%</span>
                </div>
            </div>

            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {/* Header */}
                <header className="text-center mb-10">
                    <div className="inline-flex items-center justify-center mb-6 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-lg shadow-fuchsia-100/50">
                        <svg width="56" height="70" viewBox="0 0 64 80" fill="none">
                            <path d="M32 0C32 0 10 20 10 40C10 51 20 60 32 60C44 60 54 51 54 40C54 20 32 0 32 0Z" fill="url(#rg1)" />
                            <path d="M32 60C32 60 20 68 20 74C20 77.3 22.7 80 26 80H38C41.3 80 44 77.3 44 74C44 68 32 60 32 60Z" fill="url(#rg2)" />
                            <defs>
                                <linearGradient id="rg1" x1="10" y1="0" x2="54" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#F0ABFC" /><stop offset="1" stopColor="#D946EF" /></linearGradient>
                                <linearGradient id="rg2" x1="20" y1="60" x2="44" y2="80" gradientUnits="userSpaceOnUse"><stop stopColor="#E879F9" /><stop offset="1" stopColor="#A855F7" /></linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800 leading-tight mb-3 px-2">
                        Breast Cancer Awareness
                    </h1>
                    <p className="text-lg font-semibold text-fuchsia-600 mb-2">Among Women in Peshawar</p>
                    <p className="text-slate-400 text-sm font-medium">A Cross-Sectional Study</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                        <span className="px-3 py-1.5 text-xs font-bold bg-fuchsia-50 text-fuchsia-600 rounded-full border border-fuchsia-100 shadow-sm">Confidential</span>
                        <span className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">Voluntary</span>
                    </div>
                </header>

                {/* Consent */}
                <div className="mb-8 rounded-2xl p-5 bg-white/60 backdrop-blur-sm border border-indigo-100 shadow-md">
                    <div className="flex gap-3">
                        <span className="text-indigo-500 text-xl flex-shrink-0 mt-0.5">ℹ️</span>
                        <div className="text-sm text-slate-600 leading-relaxed space-y-1.5">
                            <p>You are invited to participate in a research study entitled <em className="text-slate-800 font-medium">"Determinants of Breast Cancer Awareness Among Women in Peshawar."</em></p>
                            <p>Your participation is <strong>entirely voluntary</strong>. All information will be kept <strong>strictly confidential</strong> and used solely for research.</p>
                            <p className="font-semibold text-slate-700 pt-1">Please select the most appropriate option for each question.</p>
                        </div>
                    </div>
                </div>

                {/* Error Banners */}
                {attempted && Object.keys(errors).length > 0 && (
                    <div className="mb-6 rounded-xl p-4 bg-red-50 border-2 border-red-200 flex items-start gap-3 shadow-sm">
                        <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
                        <div>
                            <p className="text-sm font-bold text-red-800">Please complete all required questions</p>
                            <p className="text-xs text-red-600 mt-0.5">{Object.keys(errors).length} question{Object.keys(errors).length > 1 ? 's' : ''} still need your response.</p>
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className="mb-6 rounded-xl p-4 bg-orange-50 border-2 border-orange-200 flex items-start gap-3 shadow-sm">
                        <span className="text-orange-500 text-xl flex-shrink-0">✕</span>
                        <div>
                            <p className="text-sm font-bold text-orange-800">Submission Failed</p>
                            <p className="text-xs text-orange-600 mt-0.5">{submitError}</p>
                        </div>
                    </div>
                )}

                <form ref={formRef} onChange={handleChange} onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>

                    {/* ── Section A ── */}
                    <Section id="section-a" letter="A" title="Demographic Information" hasErrors={getSectionHasErrors('A')} errorCount={getSectionErrorCount('A')}>
                        <div className="space-y-6">
                            {[
                                { q: '1. Age Group', name: 'age', opts: ['18–30 years', '31–45 years', '46–60 years'] },
                                { q: '2. Marital Status', name: 'marital', opts: ['Single', 'Married', 'Widowed', 'Divorced'] },
                                { q: '3. Educational Level', name: 'education', opts: ['No Formal Education', 'Primary', 'Secondary', 'Graduate', 'Postgraduate'] },
                                { q: '4. Occupation', name: 'occupation', opts: ['Housewife', 'Student', 'Employed', 'Self-employed', 'Unemployed'] },
                                { q: '5. Monthly Household Income (PKR)', name: 'income', opts: ['Less than 25,000', '25,000 – 50,000', '50,000 – 100,000', 'More than 100,000'] },
                                { q: '6. Place of Residence', name: 'residence', opts: ['Urban (Peshawar City/Cantt)', 'Rural (surrounding villages)'] },
                                { q: '7. Have you ever received education or awareness regarding breast cancer?', name: 'priorAwareness', opts: ['Yes', 'No'] },
                            ].map(item => (
                                <div key={item.name}>
                                    <p className={`text-sm font-semibold mb-3 ${errors[item.name] ? 'text-red-600' : 'text-slate-800'}`}>
                                        {item.q}{errors[item.name] && <span className="text-red-400 ml-1">*</span>}
                                    </p>
                                    <div className="flex flex-wrap gap-2.5">
                                        {item.opts.map(opt => (
                                            <RadioPill key={opt} name={item.name} value={opt} label={opt} hasError={!!errors[item.name]} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ── Sections B, C, D, G (Yes/No Tables) ── */}
                    <Section id="section-b" letter="B" title="General Knowledge & Risk Factors" hasErrors={getSectionHasErrors('B')} errorCount={getSectionErrorCount('B')}>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secB" errors={errors} statements={[
                            'Increasing age increases the risk of breast cancer.',
                            'A family history of breast cancer (mother/sister) increases the risk.',
                            'Obesity increases the risk of breast cancer.',
                            'Lack of physical exercise increases the risk of breast cancer.',
                            'Breastfeeding reduces the risk of breast cancer.',
                            'Late first pregnancy (after 30 years) increases the risk.',
                        ]} />
                    </Section>

                    <Section id="section-c" letter="C" title="Awareness of Symptoms" hasErrors={getSectionHasErrors('C')} errorCount={getSectionErrorCount('C')}>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secC" errors={errors} statements={[
                            'A painless lump in the breast or armpit may be a sign of breast cancer.',
                            'A change in breast size or shape may be a sign of breast cancer.',
                            'Nipple discharge (other than breast milk) may be a sign of breast cancer.',
                            'Skin changes such as redness, dimpling, or "orange peel" texture may be a sign.',
                            'Inward turning of the nipple (nipple inversion) may be a sign.',
                        ]} />
                    </Section>

                    <Section id="section-d" letter="D" title="Screening Knowledge" hasErrors={getSectionHasErrors('D')} errorCount={getSectionErrorCount('D')}>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secD" errors={errors} statements={[
                            'Breast self-examination (BSE) helps in early detection of breast cancer.',
                            'The best time to perform BSE is after menstruation.',
                            'Mammography helps detect breast cancer at an early stage.',
                        ]} />
                    </Section>

                    {/* ── Section E ── */}
                    <Section id="section-e" letter="E" title="Screening Practices" hasErrors={getSectionHasErrors('E')} errorCount={getSectionErrorCount('E')}>
                        <div className="space-y-6">
                            {[
                                { q: '1. Have you ever performed a Breast Self-Examination (BSE)?', name: 'bsePerformed', opts: ['Yes', 'No'] },
                                { q: '2. If yes, how often do you perform BSE?', name: 'bseFrequency', opts: ['Monthly', 'Occasionally', 'Never'] },
                                { q: '3. Have you ever had a Clinical Breast Examination (CBE) by a doctor?', name: 'cbePerformed', opts: ['Yes', 'No'] },
                                { q: '4. If above 40 years, have you ever had a mammogram?', name: 'mammogram', opts: ['Yes', 'No', 'Not Applicable (Under 40)'] },
                            ].map(item => (
                                <div key={item.name}>
                                    <p className={`text-sm font-semibold mb-3 ${errors[item.name] ? 'text-red-600' : 'text-slate-800'}`}>
                                        {item.q}{errors[item.name] && <span className="text-red-400 ml-1">*</span>}
                                    </p>
                                    <div className="flex flex-wrap gap-2.5">
                                        {item.opts.map(opt => (
                                            <RadioPill key={opt} name={item.name} value={opt} label={opt} hasError={!!errors[item.name]} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ── Section F (Likert) ── */}
                    <Section id="section-f" letter="F" title="Barriers to Seeking Care" hasErrors={getSectionHasErrors('F')} errorCount={getSectionErrorCount('F')}>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Indicate your level of agreement with each statement.</p>
                        <LikertTable prefix="secF" errors={errors} statements={[
                            'I feel shy or embarrassed to be examined by a doctor.',
                            'I would only visit a doctor if the healthcare provider is female.',
                            'I need family permission to visit a doctor for breast issues.',
                            'Cost prevents me from seeking medical care.',
                            'Fear of breast removal (mastectomy) prevents me from seeking care.',
                            'Fear of a cancer diagnosis prevents me from seeking care.',
                            'I feel shy discussing breast health issues.',
                        ]} />
                    </Section>

                    {/* ── Section G (Myths) ── */}
                    <Section id="section-g" letter="G" title="Myths & Misconceptions" hasErrors={getSectionHasErrors('G')} errorCount={getSectionErrorCount('G')}>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secG" errors={errors} statements={[
                            'Breast cancer is contagious and can spread by physical contact.',
                            'Biopsy spreads cancer to other parts of the body.',
                            'Breast cancer is caused by the "evil eye" or a curse.',
                            'Only older women can develop breast cancer.',
                        ]} />
                    </Section>

                    {/* ── Section H ── */}
                    <Section id="section-h" letter="H" title="Sources of Information" hasErrors={getSectionHasErrors('H')} errorCount={getSectionErrorCount('H')}>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Select all applicable sources from where you have heard about breast cancer.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { v: 'TV_Radio', l: 'TV / Radio' },
                                { v: 'Social_Media', l: 'Social Media (Facebook, TikTok, YouTube)' },
                                { v: 'LHW', l: 'Lady Health Worker (LHW)' },
                                { v: 'Doctor_Nurse', l: 'Doctor / Nurse' },
                                { v: 'Family_Friends', l: 'Family / Friends / Neighbours' },
                                { v: 'Seminars', l: 'Awareness Seminars / Posters' },
                            ].map(src => (
                                <CheckboxCard key={src.v} name="sources" value={src.v} label={src.l} hasError={!!errors.sources} />
                            ))}
                        </div>
                        {errors.sources && (
                            <p className="text-xs text-red-500 mt-3 pl-1 font-medium">Please select at least one source.</p>
                        )}
                    </Section>

                    {/* Thank You */}
                    <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-center shadow-md">
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong className="text-emerald-700">Thank you</strong> for taking the time to participate. Your responses will contribute significantly to improving breast cancer awareness and public health outcomes among women in Peshawar.
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="text-center pt-4 pb-20">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-12 py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-fuchsia-100 inline-flex items-center gap-3 text-base
                                ${loading
                                    ? 'bg-gradient-to-r from-fuchsia-400 to-purple-400 cursor-wait shadow-fuchsia-200'
                                    : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 hover:shadow-fuchsia-300 hover:scale-105 active:scale-95'
                                }`}
                        >
                            {loading && <span className="spinner" />}
                            {loading ? 'Submitting...' : 'Submit Questionnaire'}
                        </button>
                        <p className="text-[11px] text-slate-400 mt-4 font-medium">All fields are required</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BreastCancerAwarenessForm;