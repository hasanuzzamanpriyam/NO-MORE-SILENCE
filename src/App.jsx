import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Localize, translateText } from './i18n.js';

const navItems = [
  { id: 'overview', label: 'হোম', english: 'Overview', icon: 'grid' },
  { id: 'safe-help', label: 'নিরাপদে সহায়তা', english: 'Safe Help', icon: 'heart' },
  { id: 'emergency', label: 'জরুরি সহায়তা', english: 'Emergency SOS', icon: 'siren', emergency: true },
  { id: 'rights', label: 'নিজের অধিকার জানুন', english: 'Know Your Rights', icon: 'book' },
  { id: 'support', label: 'সহায়তা খুঁজুন', english: 'Find Support', icon: 'map' },
  { id: 'legal', label: 'আইনি সহায়তা', english: 'Legal Support', icon: 'scale' },
  { id: 'psychosocial', label: 'মানসিক সহায়তা', english: 'Psychosocial Support', icon: 'messages' },
  { id: 'reporting', label: 'প্রাতিষ্ঠানিক রিপোর্ট', english: 'Institutional Reporting', icon: 'shield' },
];

const hotlineData = [
  { number: '999', title: 'জাতীয় জরুরি সেবা', detail: 'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স', type: 'emergency', icon: 'siren' },
  { number: '109', title: 'নারী ও শিশু সহায়তা', detail: 'নারী ও শিশু নির্যাতন প্রতিরোধ', type: 'women', icon: 'heart' },
  { number: '1098', title: 'শিশু সহায়তা', detail: 'শিশুর সুরক্ষা ও সহায়তা', type: 'child', icon: 'users' },
  { number: '16699', title: 'সরকারি আইনি সহায়তা', detail: 'জাতীয় আইনগত সহায়তা', type: 'legal', icon: 'scale' },
];

const topics = [
  { icon: 'home', title: 'পারিবারিক সহিংসতা', description: 'নিজের নিরাপত্তা ও সহায়তার পথ বুঝে নিন।', tint: 'rose' },
  { icon: 'users', title: 'যৌন হয়রানি ও সহিংসতা', description: 'সম্মতি, সুরক্ষা ও সহায়তার তথ্য।', tint: 'lilac' },
  { icon: 'briefcase', title: 'কর্মক্ষেত্রে হয়রানি', description: 'প্রাতিষ্ঠানিক অভিযোগ ও প্রতিকার সম্পর্কে জানুন।', tint: 'peach' },
  { icon: 'graduation', title: 'শিক্ষাপ্রতিষ্ঠানে হয়রানি', description: 'বিশ্বস্ত সহায়তা এবং অভিযোগের পথ খুঁজুন।', tint: 'mint' },
  { icon: 'smartphone', title: 'অনলাইন হয়রানি', description: 'ডিজিটাল নিরাপত্তা ও প্রমাণ সংরক্ষণের তথ্য।', tint: 'blue' },
  { icon: 'shield', title: 'বাল্যবিবাহ ও জোরপূর্বক বিবাহ', description: 'সুরক্ষা ও রেফারেল সেবার তথ্য।', tint: 'gold' },
  { icon: 'hand-heart', title: 'শোষণ ও মানবপাচার', description: 'নিরাপদে সহায়তা চাওয়ার সম্ভাব্য উপায়।', tint: 'rose' },
];

const guides = [
  { category: 'নিরাপত্তা', title: 'নিজের জন্য একটি নিরাপত্তা পরিকল্পনা তৈরি করুন', time: '৪ মিনিট', icon: 'shield', description: 'বিশ্বস্ত ব্যক্তি, নিরাপদ স্থান এবং জরুরি যোগাযোগের একটি পরিকল্পনা তৈরি করার প্রাথমিক ধাপ।' },
  { category: 'অধিকার', title: 'সম্মতি (Consent) কী এবং কেন গুরুত্বপূর্ণ?', time: '৩ মিনিট', icon: 'heart', description: 'সম্মতি, ব্যক্তিগত সীমানা এবং সম্মানজনক সম্পর্কের মৌলিক ধারণা।' },
  { category: 'ডিজিটাল নিরাপত্তা', title: 'অনলাইনে নিজের গোপনীয়তা রক্ষা করুন', time: '৫ মিনিট', icon: 'smartphone', description: 'ডিভাইস, অ্যাকাউন্ট এবং ব্যক্তিগত তথ্য আরও নিরাপদ রাখার কিছু মৌলিক পরামর্শ।' },
  { category: 'কর্মক্ষেত্র', title: 'কর্মক্ষেত্রে হয়রানি হলে কীভাবে সহায়তা চাইবেন', time: '৪ মিনিট', icon: 'briefcase', description: 'প্রতিষ্ঠানের নির্ধারিত প্রক্রিয়া ও বিশ্বস্ত সহায়তার পথ চিনে নিন।' },
];

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const shapes = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
    heart: <path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/>,
    siren: <><path d="M5 18h14l-1.1-8.2A5.9 5.9 0 0 0 12 4.7a5.9 5.9 0 0 0-5.9 5.1L5 18Z"/><path d="M3 21h18M12 1v1.5M3.7 5 5 6.3M20.3 5 19 6.3"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h8M8 10h7"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
    scale: <><path d="m12 3 8 4H4l8-4Z"/><path d="M5 7 2 13h6L5 7ZM19 7l-3 6h6l-3-6ZM12 7v12M7 21h10"/></>,
    messages: <><path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-5 3v-6.5A7.5 7.5 0 1 1 21 11.5Z"/><path d="M8 10h8M8 13.5h5"/></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 12h18M10 12v2h4v-2"/></>,
    graduation: <><path d="m2 10 10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c3.5 3 8.5 3 12 0v-5M22 10v6"/></>,
    smartphone: <><rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M9 5h6M11 18h2"/></>,
    'hand-heart': <><path d="M7.5 12.5 4 9a2 2 0 0 0-3 2.7l5.8 7A4 4 0 0 0 9.9 20H15a5 5 0 0 0 4.8-3.6l1.1-3.7a2 2 0 0 0-3.8-1.2l-.9 2.7"/><path d="M9 11.5c1-1.1 2.3-1 3 0 .7-1 2-1.1 3 0 1.1 1.4-1 3-3 4.2-2-1.2-4.1-2.8-3-4.2Z"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m18 6-12 12M6 6l12 12"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    life: <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.9L7.7 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.9-.6l2.8.5a2 2 0 0 1 1.3 2.6Z"/>,
    sparkle: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  };
  return <svg {...common}>{shapes[name] || shapes.sparkle}</svg>;
}

function Button({ children, onClick, variant = 'primary', icon, type = 'button', className = '' }) {
  return <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick}>{children}{icon && <Icon name={icon} size={17} />}</button>;
}

function App() {
  const [active, setActive] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [helpType, setHelpType] = useState('আমি এখন নিরাপদ কি না, তা নিয়ে উদ্বিগ্ন');
  const [helpChannel, setHelpChannel] = useState('তথ্য ও সেবার পথ');
  const [anonymous, setAnonymous] = useState(true);
  const [helpSubmitted, setHelpSubmitted] = useState(false);
  const [reportType, setReportType] = useState('কর্মক্ষেত্রে হয়রানি');
  const [reportOrg, setReportOrg] = useState('কর্মক্ষেত্র');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState(null);
  const [privacyNotice, setPrivacyNotice] = useState(true);
  const [language, setLanguage] = useState('bn');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageSwitcherRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearch('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  useEffect(() => {
    if (!languageMenuOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!languageSwitcherRef.current?.contains(event.target)) setLanguageMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLanguageMenuOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [languageMenuOpen]);

  const current = navItems.find((item) => item.id === active) || navItems[0];
  const filteredGuides = useMemo(() => guides.filter((guide) => `${guide.title} ${guide.category} ${guide.description} ${translateText(guide.title, 'en')} ${translateText(guide.category, 'en')} ${translateText(guide.description, 'en')}`.toLowerCase().includes(search.toLowerCase())), [search]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3400);
  }

  function go(id) {
    setActive(id);
    setMobileNav(false);
    setHelpSubmitted(false);
    setReportSubmitted(false);
    setExpandedGuide(null);
  }

  function renderHeader(eyebrow, title, subtitle) {
    return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div><button className="avatar-button" onClick={() => notify('এই প্রোটোটাইপে ব্যক্তিগত প্রোফাইল চালু নেই।')} aria-label="প্রোফাইল"><span>অ</span></button></div>;
  }

  function hotlineCards(compact = false) {
    return <div className={`hotline-grid ${compact ? 'hotline-grid-compact' : ''}`}>{hotlineData.map((item) => <article className={`hotline-card hotline-${item.type}`} key={item.number}><div className="hotline-icon"><Icon name={item.icon} size={20} /></div><div className="hotline-copy"><div className="hotline-title">{item.title}</div><p>{item.detail}</p></div><div className="hotline-right"><strong>{item.number}</strong><a href={`tel:${item.number}`} aria-label={`${item.number} নম্বরে কল করুন`}><Icon name="phone" size={16} /> কল করুন</a></div></article>)}</div>;
  }

  function renderOverview() {
    return <>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-dot" /> আপনার কথা গুরুত্বপূর্ণ</div>
          <h2>নীরবতা নয়,<br/><span>নিরাপত্তা চাই।</span></h2>
          <p>আপনি একা নন। নিজের অধিকার জানুন, নিরাপদে সহায়তার পথ খুঁজুন এবং প্রয়োজন হলে বিশ্বস্ত সেবার সঙ্গে যুক্ত হোন।</p>
          <div className="hero-actions"><Button onClick={() => go('safe-help')} icon="arrow">নিরাপদে সহায়তা চান</Button><button className="hero-text-link" onClick={() => go('rights')}>নিজের অধিকার জানুন <Icon name="arrow" size={16}/></button></div>
          <div className="hero-meta"><span><Icon name="lock" size={15}/> আপনার গোপনীয়তা গুরুত্বপূর্ণ</span><i/> <span>NO MORE SILENCE</span></div>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
          <div className="hero-big-heart"><Icon name="heart" size={70} strokeWidth={1.3}/></div>
          <div className="floating-note note-one"><span className="note-icon note-pink"><Icon name="shield" size={18}/></span><div><b>আপনার অধিকার</b><small>জেনে নিন, সচেতন থাকুন</small></div></div>
          <div className="floating-note note-two"><span className="note-icon note-green"><Icon name="messages" size={18}/></span><div><b>সহায়তা আছে</b><small>একটি পদক্ষেপ দিয়ে শুরু</small></div></div>
          <div className="hero-spark spark-a">✦</div><div className="hero-spark spark-b">✳</div>
        </div>
      </section>

      {privacyNotice && <div className="privacy-banner"><div className="privacy-badge"><Icon name="lock" size={19}/></div><div><strong>আপনার নিরাপত্তা সবার আগে</strong><p>এই প্রোটোটাইপে কোনো অভিযোগ জমা হয় না। বাস্তব ব্যবহারের আগে গোপনীয়তা, সম্মতি ও সেবার সক্ষমতা যাচাই করা জরুরি।</p></div><button onClick={() => setPrivacyNotice(false)} aria-label="বার্তাটি বন্ধ করুন"><Icon name="close" size={18}/></button></div>}

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">এখান থেকে শুরু করুন</span><h3>আপনার কী ধরনের সহায়তা দরকার?</h3></div><button className="subtle-link" onClick={() => go('support')}>সব সহায়তা দেখুন <Icon name="arrow" size={15}/></button></div>
        <div className="feature-grid">
          <button className="feature-card feature-main" onClick={() => go('safe-help')}><span className="feature-icon icon-pink"><Icon name="heart" size={23}/></span><span className="feature-arrow"><Icon name="arrow" size={17}/></span><b>নিরাপদে সহায়তা</b><p>আপনার পরিস্থিতি অনুযায়ী তথ্য ও সহায়তার পথ খুঁজুন।</p><span className="feature-label">SAFE HELP</span></button>
          <button className="feature-card" onClick={() => go('emergency')}><span className="feature-icon icon-red"><Icon name="siren" size={23}/></span><span className="feature-arrow"><Icon name="arrow" size={17}/></span><b>জরুরি সহায়তা</b><p>প্রয়োজনীয় জরুরি নম্বর ও নিরাপত্তা নির্দেশনা।</p><span className="feature-label">EMERGENCY SOS</span></button>
          <button className="feature-card" onClick={() => go('legal')}><span className="feature-icon icon-lilac"><Icon name="scale" size={23}/></span><span className="feature-arrow"><Icon name="arrow" size={17}/></span><b>আইনি সহায়তা</b><p>অধিকার, আইনি পরামর্শ এবং সেবার তথ্য।</p><span className="feature-label">LEGAL SUPPORT</span></button>
          <button className="feature-card" onClick={() => go('psychosocial')}><span className="feature-icon icon-green"><Icon name="messages" size={23}/></span><span className="feature-arrow"><Icon name="arrow" size={17}/></span><b>মনোসামাজিক সহায়তা</b><p>মানসিক সুস্থতা ও প্রশিক্ষিত সহায়তার পথ।</p><span className="feature-label">WELLBEING</span></button>
        </div>
      </section>

      <section className="section-block two-column-section">
        <div className="section-panel guide-panel">
          <div className="section-heading"><div><span className="eyebrow">জ্ঞানই শক্তি</span><h3>জেনে রাখুন</h3></div><button className="subtle-link" onClick={() => go('rights')}>সব বিষয় <Icon name="arrow" size={15}/></button></div>
          <div className="guide-list">{guides.slice(0, 3).map((guide) => <button className="guide-item" key={guide.title} onClick={() => { setExpandedGuide(guide.title); go('rights'); }}><span className="guide-icon"><Icon name={guide.icon} size={19}/></span><span className="guide-copy"><b>{guide.title}</b><small>{guide.category} <i/> {guide.time} পড়া</small></span><Icon name="arrow" size={17}/></button>)}</div>
        </div>
        <div className="section-panel emergency-panel"><div className="emergency-panel-top"><span className="mini-pill"><span className="live-dot"/> জরুরি যোগাযোগ</span><Icon name="phone" size={22}/></div><h3>কখনো কখনো একটি কলই প্রথম পদক্ষেপ।</h3><p>বাংলাদেশের সরকারি জরুরি ও সহায়তা নম্বরগুলো এক জায়গায় রাখুন। কলের আগে নিজের পরিস্থিতি ও নিরাপত্তা বিবেচনা করুন।</p><div className="emergency-number-row"><div><small>জাতীয় জরুরি সেবা</small><strong>999</strong></div><a href="tel:999" aria-label="999 নম্বরে কল করুন"><Icon name="phone" size={18}/></a></div><button className="panel-bottom-link" onClick={() => go('emergency')}>সব জরুরি নম্বর দেখুন <Icon name="arrow" size={16}/></button></div>
      </section>

      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">আমরা যে বিষয়গুলো নিয়ে কাজ করি</span><h3>সহিংসতা ও হয়রানির বিভিন্ন ধরন</h3></div><button className="subtle-link" onClick={() => go('safe-help')}>সহায়তা নিন <Icon name="arrow" size={15}/></button></div><div className="topic-grid">{topics.slice(0, 4).map((topic) => <button className="topic-card" key={topic.title} onClick={() => { setHelpType(topic.title); go('safe-help'); }}><span className={`topic-icon tint-${topic.tint}`}><Icon name={topic.icon} size={20}/></span><b>{topic.title}</b><p>{topic.description}</p></button>)}</div></section>
    </>;
  }

  function renderSafeHelp() {
    return <>{renderHeader('SAFE HELP', 'নিরাপদে সহায়তা চান', 'আপনার পরিস্থিতি সম্পর্কে যতটুকু স্বাচ্ছন্দ্যবোধ করেন, ততটুকু দিয়ে শুরু করুন। পরিচয় প্রকাশ না করেও প্রাথমিক তথ্য দেখতে পারেন।')}
      <div className="safety-callout"><span className="callout-icon"><Icon name="shield" size={22}/></span><div><b>আপনি কি এখন তাৎক্ষণিক ঝুঁকিতে আছেন?</b><p>জরুরি বিপদে স্থানীয় জরুরি সেবায় যোগাযোগ করুন। এই প্রোটোটাইপ কোনো লাইভ মনিটরিং বা তাৎক্ষণিক রেসপন্স সেবা নয়।</p></div><Button variant="danger" onClick={() => go('emergency')} icon="arrow">জরুরি সহায়তা</Button></div>
      <div className="content-two-col"><section className="section-panel form-panel"><div className="panel-title"><span className="eyebrow">আপনার প্রয়োজন বুঝতে সাহায্য করি</span><h3>কোন বিষয়ে সহায়তা খুঁজছেন?</h3><p>এই তথ্য শুধু পেজে উপযুক্ত তথ্য দেখানোর জন্য ব্যবহার হয়; কোথাও পাঠানো হয় না।</p></div>
        {!helpSubmitted ? <form onSubmit={(e) => { e.preventDefault(); setHelpSubmitted(true); }}><label className="field-label" htmlFor="helpType">আপনার পরিস্থিতির সঙ্গে কোনটি মেলে?</label><select id="helpType" value={helpType} onChange={(e) => setHelpType(e.target.value)}>{['আমি এখন নিরাপদ কি না, তা নিয়ে উদ্বিগ্ন', ...topics.map((t) => t.title), 'আমি অন্য কারও জন্য সহায়তা খুঁজছি', 'আমি শুধু তথ্য জানতে চাই'].map((topic) => <option key={topic}>{topic}</option>)}</select><label className="field-label">আপনি কী খুঁজছেন?</label><div className="choice-grid">{['তথ্য ও সেবার পথ', 'আইনি সহায়তা', 'মানসিক সহায়তা', 'অভিযোগের প্রক্রিয়া'].map((channel) => <button type="button" className={`choice-card ${helpChannel === channel ? 'selected' : ''}`} key={channel} onClick={() => setHelpChannel(channel)}><span className="choice-radio">{helpChannel === channel && <i/>}</span><span>{channel}</span></button>)}</div><label className="check-row"><input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)}/><span>আমি পরিচয় প্রকাশ না করে তথ্য দেখতে চাই</span></label><Button type="submit" icon="arrow">আমার জন্য সহায়তার পথ দেখান</Button><p className="form-footnote"><Icon name="lock" size={14}/> কোনো তথ্য সার্ভারে পাঠানো হচ্ছে না—এটি একটি ডেমো ফর্ম।</p></form> : <div className="inline-success"><div className="success-mark"><Icon name="check" size={26}/></div><h4>আপনার জন্য তথ্য প্রস্তুত</h4><p>আপনি বেছে নিয়েছেন: <b>{helpChannel}</b>। নিচের যাচাইকরণ-প্রয়োজনীয় সহায়তার পথগুলো দেখুন। এটি কোনো আনুষ্ঠানিক অভিযোগ জমা দেয়নি।</p><div className="success-actions"><Button onClick={() => go(helpChannel === 'আইনি সহায়তা' ? 'legal' : helpChannel === 'মানসিক সহায়তা' ? 'psychosocial' : helpChannel === 'অভিযোগের প্রক্রিয়া' ? 'reporting' : 'support')} icon="arrow">প্রাসঙ্গিক সেবা দেখুন</Button><button className="subtle-link" onClick={() => setHelpSubmitted(false)}>উত্তর পরিবর্তন করুন</button></div></div>}</section>
        <aside className="section-panel info-panel"><span className="aside-icon"><Icon name="lock" size={22}/></span><h3>আপনার গোপনীয়তা আপনার অধিকার</h3><p>সহায়তা খোঁজার সময় নিজের নিরাপত্তা ও ব্যক্তিগত তথ্যের ওপর নিয়ন্ত্রণ রাখুন।</p><ul className="check-list"><li><Icon name="check" size={16}/> যতটুকু স্বাচ্ছন্দ্যবোধ করেন, ততটুকুই শেয়ার করুন</li><li><Icon name="check" size={16}/> নিরাপদ ডিভাইস ব্যবহার করার কথা বিবেচনা করুন</li><li><Icon name="check" size={16}/> অবস্থান শেয়ার করার আগে অনুমতি ও ঝুঁকি বুঝুন</li><li><Icon name="check" size={16}/> বিশ্বস্ত ব্যক্তি বা যাচাইকৃত সেবার সঙ্গে যোগাযোগ করুন</li></ul><div className="quiet-note"><Icon name="eye" size={17}/><span>কেউ আপনার ডিভাইস পরীক্ষা করতে পারেন বলে আশঙ্কা হলে ব্রাউজিং/অ্যাপ ব্যবহারের ঝুঁকিও বিবেচনা করুন।</span></div></aside></div>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">সহায়তার ধরন</span><h3>কোন বিষয়গুলোতে সহায়তা পাওয়া যেতে পারে</h3></div></div><div className="topic-grid">{topics.map((topic) => <button className="topic-card" key={topic.title} onClick={() => setHelpType(topic.title)}><span className={`topic-icon tint-${topic.tint}`}><Icon name={topic.icon} size={20}/></span><b>{topic.title}</b><p>{topic.description}</p></button>)}</div></section>
    </>;
  }

  function renderEmergency() {
    return <>{renderHeader('EMERGENCY SOS', 'জরুরি সহায়তা', 'তাৎক্ষণিক বিপদে থাকলে নিরাপদ স্থানে যাওয়ার চেষ্টা করুন এবং প্রয়োজন অনুযায়ী জরুরি সেবায় যোগাযোগ করুন।')}
      <div className="emergency-hero"><div className="emergency-hero-icon"><Icon name="siren" size={32}/></div><div><span className="emergency-eyebrow">জরুরি অবস্থায়</span><h2>আপনার নিরাপত্তাই প্রথম।</h2><p>এই পেজ শুধু যোগাযোগের তথ্য দেয়। SOS বাটন চাপলেই সহায়তা পৌঁছে যাবে—এমন কোনো লাইভ ব্যবস্থা এই প্রোটোটাইপে নেই।</p></div><div className="call-now"><small>জাতীয় জরুরি সেবা</small><strong>999</strong><a href="tel:999"><Icon name="phone" size={17}/> কল করুন</a></div></div>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">যাচাইযোগ্য যোগাযোগের তালিকা</span><h3>জরুরি ও বিশেষায়িত সহায়তা</h3></div><span className="verified-note"><Icon name="check" size={15}/> সরকারি সূত্রে তালিকাভুক্ত নম্বর</span></div>{hotlineCards()}</section>
      <div className="content-two-col"><section className="section-panel"><div className="panel-title"><span className="eyebrow">সম্ভাব্য নিরাপত্তা পরিকল্পনা</span><h3>এখন কী করতে পারেন</h3></div><div className="step-list"><div className="step-row"><span>01</span><div><b>নিরাপদ স্থানে যাওয়ার চেষ্টা করুন</b><p>সম্ভব হলে এমন জায়গায় যান যেখানে আপনি নিরাপদ বোধ করেন এবং সহায়তা চাইতে পারেন।</p></div></div><div className="step-row"><span>02</span><div><b>বিশ্বস্ত কাউকে জানান</b><p>আপনার সম্মতি ও নিরাপত্তা বিবেচনা করে পরিচিত বিশ্বস্ত ব্যক্তির সঙ্গে যোগাযোগ করুন।</p></div></div><div className="step-row"><span>03</span><div><b>সঠিক সেবায় যোগাযোগ করুন</b><p>পরিস্থিতি অনুযায়ী জরুরি সেবা বা নারী ও শিশু সহায়তা নম্বর বেছে নিন।</p></div></div></div></section><section className="section-panel caution-panel"><span className="caution-icon"><Icon name="life" size={22}/></span><h3>যোগাযোগ করার আগে বিবেচনা করুন</h3><p>ফোন করা নিরাপদ কি না, আপনার অবস্থান প্রকাশ পাবে কি না এবং ফোনের অন্য কেউ কলের ইতিহাস দেখতে পারবেন কি না ভেবে নিন।</p><button className="subtle-link" onClick={() => go('safe-help')}>নিরাপদে সহায়তার অন্যান্য পথ <Icon name="arrow" size={15}/></button></section></div>
    </>;
  }

  function renderRights() {
    const rightsTopics = [
      { icon: 'heart', title: 'সম্মতি ও ব্যক্তিগত সীমানা', body: 'সম্মতি স্বেচ্ছায়, স্পষ্টভাবে এবং নির্দিষ্ট পরিস্থিতির জন্য দেওয়া হয়। যে কোনো সময় মত পরিবর্তনের অধিকার রয়েছে।' },
      { icon: 'shield', title: 'নিরাপত্তা ও মর্যাদা', body: 'হয়রানি বা সহিংসতার অভিজ্ঞতায় সহায়তা চাওয়া আপনার অধিকার। নিরাপদ সিদ্ধান্ত নিতে সময় নেওয়া যেতে পারে।' },
      { icon: 'smartphone', title: 'ডিজিটাল নিরাপত্তা', body: 'শক্তিশালী পাসওয়ার্ড, দুই-ধাপ যাচাইকরণ এবং সংবেদনশীল তথ্যের সীমিত শেয়ারিং বিবেচনা করুন।' },
      { icon: 'briefcase', title: 'কর্মক্ষেত্রে সম্মান', body: 'আপনার প্রতিষ্ঠানে অনুমোদিত হয়রানি প্রতিরোধ ও অভিযোগ ব্যবস্থার তথ্য জেনে রাখুন।' },
      { icon: 'graduation', title: 'শিক্ষাপ্রতিষ্ঠানে সুরক্ষা', body: 'প্রতিষ্ঠানের নির্ধারিত সুরক্ষা/অভিযোগ ব্যবস্থার সঙ্গে যোগাযোগের সুযোগ খুঁজে নিন।' },
      { icon: 'users', title: 'বাল্যবিবাহ প্রতিরোধ', body: 'বাল্যবিবাহের ঝুঁকি দেখলে স্থানীয় কর্তৃপক্ষ বা প্রাসঙ্গিক সরকারি সহায়তা সেবার নির্দেশনা নিন।' },
    ];
    return <>{renderHeader('KNOW YOUR RIGHTS', 'নিজের অধিকার জানুন', 'অধিকারভিত্তিক সহজ তথ্য, নিরাপত্তা এবং সম্মানজনক সম্পর্ক নিয়ে পড়ুন। আইন-সংক্রান্ত তথ্য প্রকাশের আগে বিশেষজ্ঞের যাচাই প্রয়োজন।')}
      <div className="rights-feature"><div className="rights-feature-symbol"><Icon name="book" size={31}/></div><div><span className="eyebrow">শিখুন • বুঝুন • সিদ্ধান্ত নিন</span><h2>আপনার অভিজ্ঞতা গুরুত্বপূর্ণ। আপনার কণ্ঠস্বরও।</h2><p>সহজ ভাষায় অধিকারভিত্তিক তথ্য পড়ুন এবং প্রয়োজন হলে যাচাইকৃত সহায়তার পথ বেছে নিন।</p></div><div className="rights-feature-stamp"><Icon name="sparkle" size={24}/><span>সবার জন্য<br/>অধিকার</span></div></div>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">শেখার বিষয়</span><h3>কোন বিষয় দিয়ে শুরু করবেন?</h3></div><span className="results-count">{rightsTopics.length}টি বিষয়</span></div><div className="rights-grid">{rightsTopics.map((topic, index) => <article className="rights-card" key={topic.title}><span className="rights-card-num">0{index + 1}</span><span className="feature-icon icon-lilac"><Icon name={topic.icon} size={22}/></span><h4>{topic.title}</h4><p>{topic.body}</p><button className="subtle-link" onClick={() => setExpandedGuide(expandedGuide === topic.title ? null : topic.title)}>{expandedGuide === topic.title ? 'সংক্ষিপ্ত করুন' : 'আরও জানুন'} <Icon name={expandedGuide === topic.title ? 'close' : 'arrow'} size={15}/></button>{expandedGuide === topic.title && <div className="expanded-detail">এই তথ্যগুলো সাধারণ সচেতনতামূলক কনটেন্ট। ব্যক্তিগত পরিস্থিতি বা আইনি পদক্ষেপের জন্য অনুমোদিত সেবাদাতা/বিশেষজ্ঞের পরামর্শ নিন। <button onClick={() => go('support')}>সহায়তা খুঁজুন</button></div>}</article>)}</div></section>
      <div className="legal-disclaimer"><Icon name="life" size={20}/><p><b>গুরুত্বপূর্ণ:</b> এই অংশটি সাধারণ সচেতনতামূলক তথ্যের জন্য। এটি আইনি পরামর্শ নয়; বাংলাদেশের প্রযোজ্য আইন ও নির্দেশনা বিশেষজ্ঞের মাধ্যমে যাচাই করে প্রকাশ করতে হবে।</p></div>
    </>;
  }

  function renderSupport() {
    const supportServices = hotlineData.filter((item) => `${item.title} ${item.detail} ${item.number} ${translateText(item.title, 'en')} ${translateText(item.detail, 'en')}`.toLowerCase().includes(search.toLowerCase()));
    return <>{renderHeader('FIND SUPPORT', 'সহায়তা খুঁজুন', 'প্রয়োজন অনুযায়ী সরকারি জরুরি সেবা, নারী ও শিশু সহায়তা, শিশু সুরক্ষা এবং আইনি সহায়তার যোগাযোগ দেখুন।')}
      <div className="support-search"><Icon name="search" size={20}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="সেবা, বিষয় বা নম্বর দিয়ে খুঁজুন..." aria-label="সহায়তা খুঁজুন"/>{search && <button onClick={() => setSearch('')} aria-label="সার্চ মুছুন"><Icon name="close" size={17}/></button>}</div>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">যোগাযোগের তথ্য</span><h3>সরকারি হেল্পলাইন</h3></div><span className="results-count">{supportServices.length}টি সেবা</span></div>{supportServices.length ? hotlineCards() : <div className="empty-state"><Icon name="search" size={26}/><b>কোনো সেবা পাওয়া যায়নি</b><p>অন্য শব্দ বা নম্বর দিয়ে খুঁজে দেখুন।</p></div>}</section>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">আরও সহায়তা</span><h3>আপনার প্রয়োজন অনুযায়ী বেছে নিন</h3></div></div><div className="feature-grid support-feature-grid"><button className="feature-card" onClick={() => go('legal')}><span className="feature-icon icon-lilac"><Icon name="scale" size={23}/></span><b>আইনি সহায়তা</b><p>আইনি সেবা কোথায় পাওয়া যায় এবং কীভাবে যোগাযোগ করবেন।</p><span className="feature-label">LEGAL AID</span></button><button className="feature-card" onClick={() => go('psychosocial')}><span className="feature-icon icon-green"><Icon name="messages" size={23}/></span><b>মনোসামাজিক সহায়তা</b><p>প্রশিক্ষিত কাউন্সেলর ও রেফারেল সেবার তথ্য।</p><span className="feature-label">WELLBEING</span></button><button className="feature-card" onClick={() => go('reporting')}><span className="feature-icon icon-pink"><Icon name="shield" size={23}/></span><b>প্রাতিষ্ঠানিক অভিযোগ</b><p>প্রতিষ্ঠানের অনুমোদিত অভিযোগ ব্যবস্থার তথ্য।</p><span className="feature-label">REPORTING</span></button><button className="feature-card" onClick={() => go('safe-help')}><span className="feature-icon icon-red"><Icon name="heart" size={23}/></span><b>সহায়তার পথ বেছে নিন</b><p>আপনার প্রয়োজন অনুযায়ী পরবর্তী ধাপ দেখতে শুরু করুন।</p><span className="feature-label">SAFE HELP</span></button></div></section>
      <div className="legal-disclaimer"><Icon name="life" size={20}/><p>সেবার নম্বর, সময়সূচি ও সক্ষমতা সময়ের সঙ্গে পরিবর্তিত হতে পারে। বাস্তব চালুর আগে সব তথ্য নিয়মিত যাচাই করতে হবে।</p></div>
    </>;
  }

  function renderLegal() {
    return <>{renderHeader('LEGAL SUPPORT', 'আইনি সহায়তা', 'আইন, অধিকার এবং প্রাসঙ্গিক সেবার পথ সম্পর্কে জানুন। নির্দিষ্ট আইনি সিদ্ধান্তের জন্য অনুমোদিত বিশেষজ্ঞের পরামর্শ নিন।')}
      <div className="rights-feature legal-feature"><div className="rights-feature-symbol"><Icon name="scale" size={31}/></div><div><span className="eyebrow">জানুন • যাচাই করুন • সহায়তা নিন</span><h2>আইনি সহায়তা পাওয়ার পথ সবার জন্য সহজ হওয়া উচিত।</h2><p>প্রয়োজনীয় তথ্য খুঁজুন এবং প্রাসঙ্গিক সরকারি বা অনুমোদিত সেবাদাতার সঙ্গে যোগাযোগের পথ জানুন।</p></div></div>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">প্রাথমিক ধাপ</span><h3>কীভাবে শুরু করতে পারেন</h3></div></div><div className="step-list steps-in-panel"><div className="step-row"><span>01</span><div><b>আপনার প্রয়োজন পরিষ্কার করুন</b><p>আপনি তথ্য, আইনি পরামর্শ, অভিযোগের প্রক্রিয়া, নাকি নিরাপত্তা-সংক্রান্ত সহায়তা খুঁজছেন তা ভাবুন।</p></div></div><div className="step-row"><span>02</span><div><b>অনুমোদিত সেবার তথ্য যাচাই করুন</b><p>সরকারি আইনগত সহায়তা বা পরিচিত আইন সহায়তাকারী প্রতিষ্ঠানের যাচাইকৃত তথ্য ব্যবহার করুন।</p></div></div><div className="step-row"><span>03</span><div><b>ব্যক্তিগত তথ্য সতর্কভাবে শেয়ার করুন</b><p>কোন তথ্য কেন দরকার, কারা দেখবেন এবং কীভাবে সংরক্ষিত হবে তা জেনে নিন।</p></div></div></div></section>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">যোগাযোগ</span><h3>প্রাসঙ্গিক হেল্পলাইন</h3></div></div>{hotlineCards()}</section>
      <div className="legal-disclaimer"><Icon name="life" size={20}/><p><b>আইনি তথ্যের সীমা:</b> এই প্রোটোটাইপ নির্দিষ্ট আইনি পরামর্শ বা মামলার সিদ্ধান্ত দেয় না। কনটেন্ট প্রকাশের আগে বাংলাদেশের বর্তমান আইন ও সরকারি সেবার সঙ্গে মিলিয়ে আইন বিশেষজ্ঞের যাচাই জরুরি।</p></div>
    </>;
  }

  function renderPsychosocial() {
    return <>{renderHeader('PSYCHOSOCIAL SUPPORT', 'মনোসামাজিক সহায়তা', 'কঠিন অভিজ্ঞতার পর নিজের অনুভূতি বুঝতে, সমর্থন খুঁজতে এবং প্রয়োজনে প্রশিক্ষিত ব্যক্তির কাছে যেতে পারেন।')}
      <div className="wellbeing-hero"><div className="wellbeing-art"><div className="wellbeing-circle"><Icon name="hand-heart" size={50}/></div><span className="wellbeing-star star1">✦</span><span className="wellbeing-star star2">✳</span></div><div><span className="eyebrow">আপনার অনুভূতির মূল্য আছে</span><h2>নিজের প্রতি একটু সদয় হোন।</h2><p>যা ঘটেছে তার জন্য আপনি দায়ী নন। সহায়তা চাইতে পারেন নিজের গতিতে, নিজের পছন্দমতো।</p><Button onClick={() => go('support')} icon="arrow">সহায়তার সেবা খুঁজুন</Button></div></div>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">আপনার যত্ন নিন</span><h3>এখন সহায়ক হতে পারে এমন কিছু পদক্ষেপ</h3></div></div><div className="rights-grid selfcare-grid">{[{n:'01',t:'একটু বিরতি নিন',p:'সম্ভব হলে এমন জায়গায় থাকুন যেখানে আপনি স্বস্তি ও নিরাপত্তা অনুভব করেন।',i:'clock'},{n:'02',t:'বিশ্বস্ত কাউকে জানান',p:'কথা বলতে ইচ্ছা হলে এমন কাউকে বেছে নিন যিনি আপনার কথা মনোযোগ দিয়ে শুনবেন।',i:'messages'},{n:'03',t:'নিজেকে দোষ দেবেন না',p:'সহিংসতা বা হয়রানির দায় যিনি করেছেন তার; আপনার নয়।',i:'heart'}].map((item) => <article className="rights-card" key={item.n}><span className="rights-card-num">{item.n}</span><span className="feature-icon icon-green"><Icon name={item.i} size={22}/></span><h4>{item.t}</h4><p>{item.p}</p></article>)}</div></section>
      <section className="section-panel support-professional"><div className="support-professional-icon"><Icon name="messages" size={24}/></div><div><h3>প্রশিক্ষিত সহায়তা খুঁজছেন?</h3><p>কাউন্সেলিং বা রেফারেল সেবার প্রাপ্যতা, সময়সূচি এবং গোপনীয়তার সীমা আগে যাচাই করুন।</p></div><Button onClick={() => go('support')} variant="secondary" icon="arrow">সেবার তথ্য দেখুন</Button></section>
      <div className="legal-disclaimer"><Icon name="life" size={20}/><p>এই তথ্য পেশাদার মানসিক স্বাস্থ্যসেবার বিকল্প নয়। তাৎক্ষণিক ঝুঁকিতে থাকলে জরুরি সহায়তা নিন।</p></div>
    </>;
  }

  function renderReporting() {
    return <>{renderHeader('INSTITUTIONAL REPORTING', 'প্রাতিষ্ঠানিক অভিযোগ ও প্রতিকার', 'কর্মক্ষেত্র বা শিক্ষাপ্রতিষ্ঠানের অনুমোদিত অভিযোগ ব্যবস্থার তথ্য জানুন। এই ডেমো কোনো বাস্তব অভিযোগ গ্রহণ বা সংরক্ষণ করে না।')}
      <div className="reporting-warning"><span><Icon name="lock" size={21}/></span><div><b>সংবেদনশীল তথ্য শেয়ার করার আগে থামুন</b><p>প্রতিষ্ঠানের অভিযোগ গ্রহণ ও পর্যালোচনার ক্ষমতা, গোপনীয়তা নীতি এবং নিরাপদ যোগাযোগের ব্যবস্থা নিশ্চিত না করে কোনো সংবেদনশীল তথ্য জমা দেবেন না।</p></div></div>
      <div className="content-two-col"><section className="section-panel form-panel"><div className="panel-title"><span className="eyebrow">প্রক্রিয়া সম্পর্কে জানুন</span><h3>কোন ধরনের প্রতিষ্ঠানের তথ্য খুঁজছেন?</h3><p>নিচের ফর্মটি শুধু প্রোটোটাইপের অভিজ্ঞতা দেখানোর জন্য।</p></div>{!reportSubmitted ? <form onSubmit={(e) => { e.preventDefault(); setReportSubmitted(true); }}><label className="field-label" htmlFor="reportOrg">প্রতিষ্ঠান</label><select id="reportOrg" value={reportOrg} onChange={(e) => setReportOrg(e.target.value)}><option>কর্মক্ষেত্র</option><option>শিক্ষাপ্রতিষ্ঠান</option><option>BRAC-এর অভ্যন্তরীণ ব্যবস্থা</option><option>অন্যান্য প্রতিষ্ঠান</option></select><label className="field-label" htmlFor="reportType">আপনি কী বিষয়ে তথ্য চান?</label><select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)}><option>কর্মক্ষেত্রে হয়রানি</option><option>যৌন হয়রানি</option><option>সুরক্ষা (Safeguarding)</option><option>অভিযোগের অগ্রগতি</option><option>প্রতিশোধমূলক আচরণ প্রতিরোধ</option></select><Button type="submit" icon="arrow">প্রক্রিয়ার তথ্য দেখুন</Button><p className="form-footnote"><Icon name="lock" size={14}/> কোনো অভিযোগ, নাম বা যোগাযোগের তথ্য নেওয়া হচ্ছে না।</p></form> : <div className="inline-success"><div className="success-mark"><Icon name="check" size={26}/></div><h4>তথ্যের অনুরোধ নির্বাচন করা হয়েছে</h4><p><b>{reportOrg}</b> — {reportType}। এই প্রোটোটাইপে প্রকৃত অভিযোগ দায়ের হয়নি; প্রতিষ্ঠানের অনুমোদিত সুরক্ষা/অভিযোগ দলের যাচাইকৃত তথ্য যুক্ত করতে হবে।</p><Button onClick={() => setReportSubmitted(false)} variant="secondary">পরিবর্তন করুন</Button></div>}</section><aside className="section-panel info-panel"><span className="aside-icon"><Icon name="shield" size={22}/></span><h3>অভিযোগ ব্যবস্থায় যা থাকা জরুরি</h3><ul className="check-list"><li><Icon name="check" size={16}/> অনুমোদিত অভিযোগ গ্রহণকারী ও পর্যালোচক</li><li><Icon name="check" size={16}/> ভূমিকা-ভিত্তিক তথ্য প্রবেশাধিকার</li><li><Icon name="check" size={16}/> নিরাপদ সংরক্ষণ ও নির্ধারিত মেয়াদে মুছে ফেলা</li><li><Icon name="check" size={16}/> প্রতিশোধমূলক আচরণ প্রতিরোধে নির্দেশনা</li><li><Icon name="check" size={16}/> স্পষ্ট অভিযোগ নিষ্পত্তির ধাপ ও জবাবদিহি</li></ul><div className="quiet-note"><Icon name="life" size={17}/><span>BRAC-এর বিদ্যমান Safeguarding নীতি ও অভিযোগ ব্যবস্থার সঙ্গে সামঞ্জস্য নিশ্চিত করে তবেই চালু করা উচিত।</span></div></aside></div>
    </>;
  }

  const renderers = { overview: renderOverview, 'safe-help': renderSafeHelp, emergency: renderEmergency, rights: renderRights, support: renderSupport, legal: renderLegal, psychosocial: renderPsychosocial, reporting: renderReporting };

  return <Localize language={language}><div className={`app-shell ${language === 'en' ? 'language-english' : ''}`} lang={language}>
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand-block"><div className="brac-logo-wrap"><img className="brac-logo" src="/brac-logo.png" alt="BRAC logo"/></div><div className="product-brand"><span className="product-mark"><Icon name="heart" size={17}/></span><div><b>NO MORE SILENCE</b><small>নিরাপদ সহায়তার ডিজিটাল উদ্যোগ</small></div></div></div>
      <div className="nav-section-label">মেনু</div><nav className="side-nav" aria-label="প্রধান নেভিগেশন">{navItems.map((item) => <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''} ${item.emergency ? 'nav-emergency' : ''}`} onClick={() => go(item.id)}><span className="nav-icon"><Icon name={item.icon} size={19}/></span><span>{item.label}</span>{item.emergency && <span className="nav-alert-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-safe-card"><div className="safe-card-icon"><Icon name="lock" size={18}/></div><b>আপনার নিরাপত্তা আগে</b><p>ব্যক্তিগত তথ্য শেয়ার করার আগে নিরাপত্তা বিবেচনা করুন।</p><button onClick={() => go('safe-help')}>নিরাপত্তা টিপস <Icon name="arrow" size={14}/></button></div><div className="sidebar-footer"><span className="footer-dot"/> কনসেপ্ট প্রোটোটাইপ <span className="footer-version">v1.0</span></div></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="মেনু বন্ধ করুন"/>}
    <main className="main-area"><header className="topbar"><div className="topbar-left"><button className="mobile-menu-btn" onClick={() => setMobileNav(!mobileNav)} aria-label="মেনু খুলুন"><Icon name="menu" size={22}/></button><div className="breadcrumb"><span>NO MORE SILENCE</span><Icon name="arrow" size={13}/><b>{current.english}</b></div></div><div className="topbar-right"><label className="global-search"><Icon name="search" size={18}/><input ref={searchInputRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="এখানে খুঁজুন..." aria-label="পেজে খুঁজুন"/><kbd>⌘ K</kbd></label><button className="icon-button" onClick={() => notify('এই প্রোটোটাইপে কোনো নতুন নোটিফিকেশন নেই।')} aria-label="নোটিফিকেশন"><Icon name="bell" size={19}/><i/></button><div className="topbar-divider"/><div className="language-switcher" ref={languageSwitcherRef}><button className="language-button" aria-haspopup="menu" aria-expanded={languageMenuOpen} onClick={() => setLanguageMenuOpen((open) => !open)}>{language === 'bn' ? 'বাং' : 'EN'} <span>{languageMenuOpen ? '⌃' : '⌄'}</span></button>{languageMenuOpen && <div className="language-menu" role="menu" aria-label={language === 'bn' ? 'ভাষা নির্বাচন' : 'Choose language'}><button type="button" role="menuitemradio" aria-checked={language === 'bn'} className={language === 'bn' ? 'selected' : ''} onClick={() => { setLanguage('bn'); setLanguageMenuOpen(false); }}><span>বাংলা</span><small>{language === 'bn' ? '✓' : ''}</small></button><button type="button" role="menuitemradio" aria-checked={language === 'en'} className={language === 'en' ? 'selected' : ''} onClick={() => { setLanguage('en'); setLanguageMenuOpen(false); }}><span>English</span><small>{language === 'en' ? '✓' : ''}</small></button></div>}</div></div></header>
      <div className="page-content"><div className="mobile-page-title"><div className="eyebrow">NO MORE SILENCE</div><h2>{current.label}</h2></div>{(renderers[active] || renderOverview)()}</div>
      <footer className="app-footer"><div><span className="footer-heart"><Icon name="heart" size={13}/></span> <b>NO MORE SILENCE</b> <span>— নীরবতা ভাঙুন, নিরাপদ পৃথিবী গড়ুন।</span></div><div className="footer-links"><button onClick={() => notify('গোপনীয়তা নীতি বাস্তবায়নের আগে BRAC-এর অনুমোদন ও পর্যালোচনা প্রয়োজন।')}>গোপনীয়তা</button><button onClick={() => notify('এই প্রোটোটাইপে সহায়তা ডেস্ক সংযুক্ত নয়।')}>সহায়তা</button><span>© Concept UI</span></div></footer>
    </main>
    {toast && <div className="toast-message" role="status"><span><Icon name="check" size={17}/></span>{toast}<button onClick={() => setToast('')} aria-label="বন্ধ করুন"><Icon name="close" size={15}/></button></div>}
  </div></Localize>;
}

export default App;
