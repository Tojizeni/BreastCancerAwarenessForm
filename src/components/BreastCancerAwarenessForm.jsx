import React, { useState, useRef } from 'react';

/* ── Reusable Components ── */

const RadioPill = ({ name, value, label, hasError }) => (
    <label className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm cursor-pointer transition-all border w-full sm:w-auto
        ${hasError
            ? 'border-red-200 bg-red-50/60 text-red-700'
            : 'border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200 active:bg-gray-100'
        }`}>
        <input type="radio" name={name} value={value} className="radio-custom" />
        {label}
    </label>
);

const CheckboxCard = ({ name, value, label, hasError }) => (
    <label className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all border w-full
        ${hasError
            ? 'border-red-200 bg-red-50/60 text-red-700'
            : 'border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200 active:bg-gray-100'
        }`}>
        <input type="checkbox" name={name} value={value} className="checkbox-custom" />
        {label}
    </label>
);

const YesNoTable = ({ prefix, statements, errors }) => (
    <div className="-mx-6 -mb-6 sm:mx-0 sm:mb-0 sm:rounded-lg sm:overflow-x-auto sm:border sm:border-gray-100">
        {/* Mobile: stacked cards / Desktop: table */}
        <div className="sm:hidden divide-y divide-gray-100">
            {statements.map((s, i) => {
                const n = `${prefix}_${i}`;
                const err = errors[n];
                return (
                    <div key={i} className={`px-6 py-4 ${err ? 'bg-red-50/70' : ''}`}>
                        <p className={`text-sm mb-3 leading-relaxed ${err ? 'text-red-700 font-medium' : 'text-gray-700'}`}>{s}</p>
                        <div className="flex gap-2">
                            {['Yes', 'No', "Don't Know"].map(v => (
                                <label key={v} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm cursor-pointer transition-all border
                                    ${err ? 'border-red-200' : 'border-gray-100 hover:bg-gray-50 active:bg-gray-100'}`}>
                                    <input type="radio" name={n} value={v} className="radio-custom" />
                                    {v}
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
        {/* Desktop: normal table */}
        <table className="hidden sm:table w-full text-sm min-w-[560px]">
            <thead>
                <tr className="border-b-2 border-gray-200">
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">Statement</th>
                    {['Yes', 'No', "Don't Know"].map(h => (
                        <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide text-center w-24">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {statements.map((s, i) => {
                    const n = `${prefix}_${i}`;
                    const err = errors[n];
                    return (
                        <tr key={i} className={`border-b border-gray-100 last:border-0 transition-colors ${err ? 'bg-red-50/70' : 'hover:bg-gray-50/50'}`}>
                            <td className={`px-4 py-3 transition-colors ${err ? 'text-red-700 font-medium' : 'text-gray-700'}`}>{s}</td>
                            {['Yes', 'No', "Don't Know"].map(v => (
                                <td key={v} className="px-4 py-3 text-center">
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
    const shortOpts = ['S. Agree', 'Agree', 'Neutral', 'Disagree', 'S. Disagree'];
    return (
        <div className="-mx-6 -mb-6 sm:mx-0 sm:mb-0 sm:rounded-lg sm:overflow-x-auto sm:border sm:border-gray-100">
            {/* Mobile: stacked */}
            <div className="sm:hidden divide-y divide-gray-100">
                {statements.map((s, i) => {
                    const n = `${prefix}_${i}`;
                    const err = errors[n];
                    return (
                        <div key={i} className={`px-6 py-4 ${err ? 'bg-red-50/70' : ''}`}>
                            <p className={`text-sm mb-3 leading-relaxed ${err ? 'text-red-700 font-medium' : 'text-gray-700'}`}>{s}</p>
                            <div className="grid grid-cols-5 gap-1.5">
                                {opts.map((v, vi) => (
                                    <label key={v} className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] leading-tight cursor-pointer transition-all border text-center
                                        ${err ? 'border-red-200' : 'border-gray-100 hover:bg-gray-50 active:bg-gray-100'}`}>
                                        <input type="radio" name={n} value={v} className="radio-custom" />
                                        {shortOpts[vi]}
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Desktop: table */}
            <table className="hidden sm:table w-full text-sm min-w-[760px]">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">Statement</th>
                        {opts.map(o => (
                            <th key={o} className="px-2 py-3 text-gray-500 font-semibold text-center text-[11px] uppercase tracking-wide leading-tight">{o}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {statements.map((s, i) => {
                        const n = `${prefix}_${i}`;
                        const err = errors[n];
                        return (
                            <tr key={i} className={`border-b border-gray-100 last:border-0 transition-colors ${err ? 'bg-red-50/70' : 'hover:bg-gray-50/50'}`}>
                                <td className={`px-4 py-3 transition-colors ${err ? 'text-red-700 font-medium' : 'text-gray-700'}`}>{s}</td>
                                {opts.map(v => (
                                    <td key={v} className="px-2 py-3 text-center">
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
        className={`rounded-2xl bg-white border transition-all duration-300 overflow-hidden
            ${hasErrors ? 'border-red-300 shadow-md shadow-red-100/50' : 'border-gray-100 shadow-sm'}`}
    >
        <div className={`px-5 sm:px-6 py-4 border-b flex items-center gap-3 transition-colors
            ${hasErrors ? 'bg-red-50/60 border-red-200' : 'bg-gray-50/50 border-gray-100'}`}>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0
                ${hasErrors ? 'bg-red-500' : 'bg-rose-500'}`}>{letter}</span>
            <legend className="text-sm sm:text-base font-bold text-gray-900 flex-1 leading-tight">{title}</legend>
            {hasErrors && (
                <span className="text-[11px] font-semibold text-red-600 bg-red-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {errorCount} left
                </span>
            )}
        </div>
        <div className="p-5 sm:p-6">{children}</div>
    </fieldset>
);

/* ── ⭐ PASTE YOUR GOOGLE APPS SCRIPT URL HERE ⭐ ── */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

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

    /* ── ⭐ PASTE YOUR GOOGLE APPS SCRIPT URL HERE ⭐ ── */
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzh9O0nFeUKjd-9U_WbvLUDvPkix5fm4-luPhTfkFhISYvTOKMAoaIecvugrXcjJanOmw/exec';

    /* Inside your component, replace collectFormData and handleSubmit with these: */

    const collectFormData = () => {
        const data = {};
        if (!formRef.current) return data;

        // Radios
        const radioGroups = new Set();
        formRef.current.querySelectorAll('input[type="radio"]').forEach(r => radioGroups.add(r.name));
        radioGroups.forEach(name => {
            const checked = formRef.current.querySelector(`input[name="${name}"]:checked`);
            data[name] = checked ? checked.value : '';
        });

        // Checkboxes → individual yes/no
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
                    document.getElementById(`section-${sec.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    break;
                }
            }
            return;
        }

        const formData = collectFormData();
        setLoading(true);

        try {
            // ⭐ KEY FIX: use URLSearchParams instead of JSON
            // This sends as application/x-www-form-urlencoded which
            // works reliably on ALL devices including iOS Safari
            const params = new URLSearchParams();

            Object.keys(formData).forEach(key => {
                params.append(key, formData[key]);
            });

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            // no-cors = can't read response, assume success if no error thrown
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
            <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-amber-50">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-gray-100">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Submitted</h2>
                    <p className="text-gray-500 mb-6 leading-relaxed text-sm">Thank you for your participation. Your responses have been recorded.</p>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                            setErrors({});
                            setAttempted(false);
                            setProgress(0);
                            setSubmitError('');
                            formRef.current?.reset();
                        }}
                        className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors text-sm"
                    >
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-amber-50/20">
            <style>{`
                .radio-custom{appearance:none;-webkit-appearance:none;width:20px;height:20px;border:2px solid #D1D5DB;border-radius:50%;cursor:pointer;flex-shrink:0;transition:all .15s;position:relative}
                .radio-custom:hover{border-color:#F43F5E}
                .radio-custom:checked{border-color:#E11D48;background:#E11D48}
                .radio-custom:checked::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:#fff;border-radius:50%}
                .checkbox-custom{appearance:none;-webkit-appearance:none;width:20px;height:20px;border:2px solid #D1D5DB;border-radius:5px;cursor:pointer;flex-shrink:0;transition:all .15s;position:relative}
                .checkbox-custom:hover{border-color:#F43F5E}
                .checkbox-custom:checked{border-color:#E11D48;background:#E11D48}
                .checkbox-custom:checked::after{content:'';position:absolute;top:2px;left:6px;width:5px;height:10px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
                .table-radio{appearance:none;-webkit-appearance:none;width:18px;height:18px;border:2px solid #D1D5DB;border-radius:50%;cursor:pointer;transition:all .15s;position:relative}
                .table-radio:hover{border-color:#F43F5E;transform:scale(1.15)}
                .table-radio:checked{border-color:#E11D48;background:#E11D48}
                .table-radio:checked::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;background:#fff;border-radius:50%}
                ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#FECDD3;border-radius:10px}
                @keyframes spin{to{transform:rotate(360deg)}}
                .spinner{width:20px;height:20px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
            `}</style>

            {/* Progress Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3 flex items-center gap-4">
                    <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider hidden sm:inline">Progress</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold text-rose-600 tabular-nums w-10 text-right">{progress}%</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-5 sm:px-6 py-8 sm:py-10">

                {/* Header */}
                <header className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center mb-4 sm:mb-5">
                        <svg width="44" height="55" viewBox="0 0 64 80" fill="none" className="sm:w-[48px] sm:h-[60px]">
                            <path d="M32 0C32 0 10 20 10 40C10 51 20 60 32 60C44 60 54 51 54 40C54 20 32 0 32 0Z" fill="url(#rg1)" />
                            <path d="M32 60C32 60 20 68 20 74C20 77.3 22.7 80 26 80H38C41.3 80 44 77.3 44 74C44 68 32 60 32 60Z" fill="url(#rg2)" />
                            <defs>
                                <linearGradient id="rg1" x1="10" y1="0" x2="54" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#FB7185" /><stop offset="1" stopColor="#E11D48" /></linearGradient>
                                <linearGradient id="rg2" x1="20" y1="60" x2="44" y2="80" gradientUnits="userSpaceOnUse"><stop stopColor="#F43F5E" /><stop offset="1" stopColor="#BE123C" /></linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-2">
                        Breast Cancer Awareness<br />
                        <span className="text-rose-600">Among Women in Peshawar</span>
                    </h1>
                    <p className="text-gray-400 text-sm">A Cross-Sectional Study</p>
                    <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
                        <span className="px-2.5 py-1 text-[11px] font-medium bg-rose-50 text-rose-600 rounded-full border border-rose-100">Confidential</span>
                        <span className="px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">Voluntary</span>
                    </div>
                </header>

                {/* Consent */}
                <div className="mb-6 sm:mb-8 rounded-2xl p-4 sm:p-5 bg-amber-50/50 border border-amber-100/80">
                    <div className="flex gap-3">
                        <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">ℹ</span>
                        <div className="text-sm text-gray-600 leading-relaxed space-y-1.5">
                            <p>You are invited to participate in a research study entitled <em>"Determinants of Breast Cancer Awareness Among Women in Peshawar."</em></p>
                            <p>Your participation is <strong>entirely voluntary</strong>. All information will be kept <strong>strictly confidential</strong> and used solely for research.</p>
                            <p className="font-semibold text-gray-700 pt-1">Please select the most appropriate option for each question.</p>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {attempted && Object.keys(errors).length > 0 && (
                    <div className="mb-6 rounded-xl p-4 bg-red-50 border border-red-200 flex items-start gap-3">
                        <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
                        <div>
                            <p className="text-sm font-semibold text-red-800">Please complete all required questions</p>
                            <p className="text-xs text-red-600 mt-0.5">
                                {Object.keys(errors).length} question{Object.keys(errors).length > 1 ? 's' : ''} still need your response.
                            </p>
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className="mb-6 rounded-xl p-4 bg-orange-50 border border-orange-200 flex items-start gap-3">
                        <span className="text-orange-500 text-lg flex-shrink-0">✕</span>
                        <div>
                            <p className="text-sm font-semibold text-orange-800">Submission Failed</p>
                            <p className="text-xs text-orange-600 mt-0.5">{submitError}</p>
                        </div>
                    </div>
                )}

                <form ref={formRef} onChange={handleChange} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>

                    {/* ── Section A ── */}
                    <Section id="section-a" letter="A" title="Demographic Information" hasErrors={getSectionHasErrors('A')} errorCount={getSectionErrorCount('A')}>
                        <div className="space-y-5 sm:space-y-5">
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
                                    <p className={`text-sm font-medium mb-2.5 ${errors[item.name] ? 'text-red-600' : 'text-gray-800'}`}>
                                        {item.q}{errors[item.name] && <span className="text-red-400 ml-1">*</span>}
                                    </p>
                                    {/* Mobile: stacked full-width / Desktop: inline wrap */}
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                                        {item.opts.map(opt => (
                                            <RadioPill key={opt} name={item.name} value={opt} label={opt} hasError={!!errors[item.name]} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ── Section B ── */}
                    <Section id="section-b" letter="B" title="General Knowledge & Risk Factors" hasErrors={getSectionHasErrors('B')} errorCount={getSectionErrorCount('B')}>
                        <p className="text-xs text-gray-400 mb-4">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secB" errors={errors} statements={[
                            'Increasing age increases the risk of breast cancer.',
                            'A family history of breast cancer (mother/sister) increases the risk.',
                            'Obesity increases the risk of breast cancer.',
                            'Lack of physical exercise increases the risk of breast cancer.',
                            'Breastfeeding reduces the risk of breast cancer.',
                            'Late first pregnancy (after 30 years) increases the risk.',
                        ]} />
                    </Section>

                    {/* ── Section C ── */}
                    <Section id="section-c" letter="C" title="Awareness of Symptoms" hasErrors={getSectionHasErrors('C')} errorCount={getSectionErrorCount('C')}>
                        <p className="text-xs text-gray-400 mb-4">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secC" errors={errors} statements={[
                            'A painless lump in the breast or armpit may be a sign of breast cancer.',
                            'A change in breast size or shape may be a sign of breast cancer.',
                            'Nipple discharge (other than breast milk) may be a sign of breast cancer.',
                            'Skin changes such as redness, dimpling, or "orange peel" texture may be a sign.',
                            'Inward turning of the nipple (nipple inversion) may be a sign.',
                        ]} />
                    </Section>

                    {/* ── Section D ── */}
                    <Section id="section-d" letter="D" title="Screening Knowledge" hasErrors={getSectionHasErrors('D')} errorCount={getSectionErrorCount('D')}>
                        <p className="text-xs text-gray-400 mb-4">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secD" errors={errors} statements={[
                            'Breast self-examination (BSE) helps in early detection of breast cancer.',
                            'The best time to perform BSE is after menstruation.',
                            'Mammography helps detect breast cancer at an early stage.',
                        ]} />
                    </Section>

                    {/* ── Section E ── */}
                    <Section id="section-e" letter="E" title="Screening Practices" hasErrors={getSectionHasErrors('E')} errorCount={getSectionErrorCount('E')}>
                        <div className="space-y-5">
                            {[
                                { q: '1. Have you ever performed a Breast Self-Examination (BSE)?', name: 'bsePerformed', opts: ['Yes', 'No'] },
                                { q: '2. If yes, how often do you perform BSE?', name: 'bseFrequency', opts: ['Monthly', 'Occasionally', 'Never'] },
                                { q: '3. Have you ever had a Clinical Breast Examination (CBE) by a doctor?', name: 'cbePerformed', opts: ['Yes', 'No'] },
                                { q: '4. If above 40 years, have you ever had a mammogram?', name: 'mammogram', opts: ['Yes', 'No', 'Not Applicable (Under 40)'] },
                            ].map(item => (
                                <div key={item.name}>
                                    <p className={`text-sm font-medium mb-2.5 ${errors[item.name] ? 'text-red-600' : 'text-gray-800'}`}>
                                        {item.q}{errors[item.name] && <span className="text-red-400 ml-1">*</span>}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                                        {item.opts.map(opt => (
                                            <RadioPill key={opt} name={item.name} value={opt} label={opt} hasError={!!errors[item.name]} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ── Section F ── */}
                    <Section id="section-f" letter="F" title="Barriers to Seeking Care" hasErrors={getSectionHasErrors('F')} errorCount={getSectionErrorCount('F')}>
                        <p className="text-xs text-gray-400 mb-4">Indicate your level of agreement with each statement.</p>
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

                    {/* ── Section G ── */}
                    <Section id="section-g" letter="G" title="Myths & Misconceptions" hasErrors={getSectionHasErrors('G')} errorCount={getSectionErrorCount('G')}>
                        <p className="text-xs text-gray-400 mb-4">Indicate your response for each statement.</p>
                        <YesNoTable prefix="secG" errors={errors} statements={[
                            'Breast cancer is contagious and can spread by physical contact.',
                            'Biopsy spreads cancer to other parts of the body.',
                            'Breast cancer is caused by the "evil eye" or a curse.',
                            'Only older women can develop breast cancer.',
                        ]} />
                    </Section>

                    {/* ── Section H ── */}
                    <Section id="section-h" letter="H" title="Sources of Information" hasErrors={getSectionHasErrors('H')} errorCount={getSectionErrorCount('H')}>
                        <p className="text-xs text-gray-400 mb-4">Select all applicable sources from where you have heard about breast cancer.</p>
                        <div className="flex flex-col gap-2">
                            {[
                                { v: 'TV_Radio', l: 'TV / Radio' },
                                { v: 'Social_Media', l: 'Social Media (Facebook, TikTok, YouTube, etc.)' },
                                { v: 'LHW', l: 'Lady Health Worker (LHW)' },
                                { v: 'Doctor_Nurse', l: 'Doctor / Nurse' },
                                { v: 'Family_Friends', l: 'Family / Friends / Neighbours' },
                                { v: 'Seminars', l: 'Awareness Seminars / Posters' },
                            ].map(src => (
                                <CheckboxCard key={src.v} name="sources" value={src.v} label={src.l} hasError={!!errors.sources} />
                            ))}
                        </div>
                        {errors.sources && (
                            <p className="text-xs text-red-500 mt-3 pl-1">Please select at least one source.</p>
                        )}
                    </Section>

                    {/* Thank You */}
                    <div className="rounded-2xl p-5 sm:p-6 bg-emerald-50/50 border border-emerald-100/80 text-center">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            <strong>Thank you</strong> for taking the time to participate. Your responses will contribute significantly to improving breast cancer awareness and public health outcomes among women in Peshawar.
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="text-center pt-2 pb-12 sm:pb-16">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full sm:w-auto px-10 py-4 rounded-xl font-semibold text-white transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-rose-100 inline-flex items-center justify-center gap-2.5 text-base
                                ${loading
                                    ? 'bg-rose-400 cursor-wait shadow-rose-200/30'
                                    : 'bg-rose-600 hover:bg-rose-700 active:scale-[0.98] shadow-rose-200/50'
                                }`}
                        >
                            {loading && <span className="spinner" />}
                            {loading ? 'Submitting...' : 'Submit Questionnaire'}
                        </button>
                        <p className="text-[11px] text-gray-300 mt-3">All fields are required</p>
                    </div>
                </form>

                <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent mx-auto mb-6" />
                <p className="text-center text-[11px] text-gray-300 pb-8">Breast Cancer Awareness Research Study — Peshawar, Pakistan</p>
            </div>
        </div>
    );
};

export default BreastCancerAwarenessForm;