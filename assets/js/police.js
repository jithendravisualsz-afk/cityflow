/**
 * CityFlow AI — Tactical Police Command Controller
 * Adaptive signal green-split optimizer and emergency unit dispatch.
 */

window.CityFlowPolice = (function() {
  let currentRole = 'officer';

  function setRole(role) {
    currentRole = role;
    const officerBtn = document.getElementById('role-officer-btn');
    const citizenBtn = document.getElementById('role-citizen-btn');
    const jurisdictionBadge = document.getElementById('police-jurisdiction-badge');
    const citizenNotice = document.getElementById('police-citizen-notice');
    const applyBtnText = document.getElementById('apply-btn-text');

    if (role === 'officer') {
      if (officerBtn) {
        officerBtn.className = 'px-3 py-1.5 rounded-lg font-bold transition-all bg-amber-500 text-white shadow-sm flex items-center gap-1.5';
      }
      if (citizenBtn) {
        citizenBtn.className = 'px-3 py-1.5 rounded-lg font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5';
      }
      if (jurisdictionBadge) {
        jurisdictionBadge.textContent = 'Sector 4 — Cyberabad Jurisdiction (Authorized Officer)';
        jurisdictionBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
      }
      if (citizenNotice) citizenNotice.classList.add('hidden');
      if (applyBtnText) applyBtnText.textContent = 'Broadcast Adaptive Timing to Controller SIG-042';
    } else {
      if (officerBtn) {
        officerBtn.className = 'px-3 py-1.5 rounded-lg font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5';
      }
      if (citizenBtn) {
        citizenBtn.className = 'px-3 py-1.5 rounded-lg font-bold transition-all bg-cyan-500 text-white shadow-sm flex items-center gap-1.5';
      }
      if (jurisdictionBadge) {
        jurisdictionBadge.textContent = 'Public Citizen Access — Live Police Telemetry & Citizen Intake';
        jurisdictionBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30';
      }
      if (citizenNotice) citizenNotice.classList.remove('hidden');
      if (applyBtnText) applyBtnText.textContent = 'Simulate Signal Timing Optimization';
    }
    if (window.CityFlow && window.CityFlow.playBeep) window.CityFlow.playBeep(900, 'sine', 0.05);
    if (window.lucide) window.lucide.createIcons();
  }

  function init() {
    const sliderA = document.getElementById('signal-phase-a');
    const sliderB = document.getElementById('signal-phase-b');
    const applyBtn = document.getElementById('apply-signal-btn');
    const dispatchBtn = document.getElementById('dispatch-unit-btn');

    if (sliderA) sliderA.addEventListener('input', updateSignalMetrics);
    if (sliderB) sliderB.addEventListener('input', updateSignalMetrics);
    if (applyBtn) applyBtn.addEventListener('click', applySignalPlan);
    if (dispatchBtn) dispatchBtn.addEventListener('click', dispatchPatrol);

    updateSignalMetrics();
  }

  function updateSignalMetrics() {
    const sliderA = document.getElementById('signal-phase-a');
    const sliderB = document.getElementById('signal-phase-b');
    const valA = sliderA ? parseInt(sliderA.value) : 65;
    const valB = sliderB ? parseInt(sliderB.value) : 25;

    const valADisp = document.getElementById('val-phase-a');
    const valBDisp = document.getElementById('val-phase-b');
    const cycleDisp = document.getElementById('val-cycle-time');
    const queueDisp = document.getElementById('val-queue-time');
    const reliefDisp = document.getElementById('val-relief-pct');

    if (valADisp) valADisp.textContent = `${valA}s`;
    if (valBDisp) valBDisp.textContent = `${valB}s`;

    const amber = 6;
    const totalCycle = valA + valB + amber;
    if (cycleDisp) cycleDisp.textContent = `${totalCycle}s`;

    // Queue dissipation model based on green split allocation
    const reliefPct = Math.min(38, Math.round(((valA - 40) / 40) * 22 + 14));
    const queueMinutes = Math.max(3.2, (18.5 * (1 - reliefPct / 100)).toFixed(1));

    if (queueDisp) queueDisp.textContent = `${queueMinutes} min`;
    if (reliefDisp) reliefDisp.textContent = `+${reliefPct}% Flow`;
  }

  function applySignalPlan() {
    if (window.CityFlow && window.CityFlow.playBeep) window.CityFlow.playBeep(1040, 'triangle', 0.08);
    const toast = document.getElementById('police-toast');
    if (toast) {
      toast.textContent = "✅ Adaptive timing broadcast to Signal Controller SIG-HYD-042!";
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 4000);
    }
  }

  function dispatchPatrol() {
    if (window.CityFlow && window.CityFlow.playBeep) window.CityFlow.playBeep(650, 'sawtooth', 0.12);
    const logList = document.getElementById('dispatch-log-list');
    if (logList) {
      const timeStr = new Date().toLocaleTimeString();
      const li = document.createElement('li');
      li.className = 'text-xs p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-slate-800 dark:text-cyan-200 flex items-center justify-between';
      li.innerHTML = `
        <span>🚓 <strong>PCR Unit 07</strong> dispatched to Corridor R0067</span>
        <span class="font-mono text-[10px] text-slate-400">${timeStr}</span>
      `;
      logList.prepend(li);
    }
  }

  function renderCitizenReports() {
    const list = document.getElementById('police-citizen-reports-list');
    if (!list) return;

    let incidents = [];
    try {
      const stored = localStorage.getItem('cityflow_incidents');
      if (stored) incidents = JSON.parse(stored);
    } catch(e) {}

    // Fallback seed if nothing in localStorage yet
    if (!incidents || incidents.length === 0) {
      if (window.CityFlowReport && typeof window.CityFlowReport.getIncidents === 'function') {
        incidents = window.CityFlowReport.getIncidents();
      }
    }

    if (!incidents || incidents.length === 0) {
      list.innerHTML = `<div class="p-4 text-center text-xs text-slate-400">No active citizen reports logged.</div>`;
      return;
    }

    list.innerHTML = incidents.map(inc => {
      const isCritical = inc.severity === 'critical';
      const badgeClass = isCritical ? 'bg-rose-500/15 text-rose-500 border-rose-500/30' : 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      return `
        <div class="p-3 rounded-xl liquid-glass-subtle flex flex-col gap-2 border border-slate-200/50 dark:border-white/5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-mono text-[10px] font-bold text-cyan-400">${inc.id}</span>
                <span class="px-2 py-0.2 rounded text-[10px] font-bold border ${badgeClass}">${inc.typeName}</span>
              </div>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white font-heading mt-0.5">${inc.corridorName || inc.corridor}</h5>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">${inc.description || 'Reported blockage'}</p>
            </div>
            <button onclick="CityFlowPolice.dispatchPCRToIncident('${inc.id}', '${inc.corridor}')" class="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 shrink-0 transition-all cursor-pointer">
              <i data-lucide="siren" class="w-3 h-3"></i>
              <span>Assign Unit</span>
            </button>
          </div>
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
            <span>By: <strong>${inc.reporter || 'Citizen'}</strong></span>
            <span class="text-emerald-400 font-medium">${inc.statusText || 'CAD Pending'}</span>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function dispatchPCRToIncident(incId, corridor) {
    if (window.CityFlow && window.CityFlow.playBeep) window.CityFlow.playBeep(680, 'sawtooth', 0.12);
    const logList = document.getElementById('dispatch-log-list');
    const unitNum = Math.floor(10 + Math.random() * 20);
    const timeStr = new Date().toLocaleTimeString();

    if (logList) {
      const li = document.createElement('li');
      li.className = 'text-xs p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-between animate-fadeIn';
      li.innerHTML = `
        <span>🚓 <strong>PCR Unit ${unitNum}</strong> dispatched to ${corridor} (Incident ${incId})</span>
        <span class="font-mono text-[10px] text-slate-400">${timeStr}</span>
      `;
      logList.prepend(li);
    }

    // Update incident status in localStorage
    try {
      const stored = localStorage.getItem('cityflow_incidents');
      if (stored) {
        const incidents = JSON.parse(stored);
        const target = incidents.find(i => i.id === incId);
        if (target) {
          target.statusText = `PCR Unit ${unitNum} On Scene`;
          localStorage.setItem('cityflow_incidents', JSON.stringify(incidents));
          renderCitizenReports();
        }
      }
    } catch(e) {}
  }

  window.addEventListener('DOMContentLoaded', () => {
    init();
    renderCitizenReports();
  });

  window.addEventListener('cityflowIncidentsUpdated', renderCitizenReports);

  return {
    setRole,
    updateSignalMetrics,
    applySignalPlan,
    dispatchPatrol,
    dispatchPCRToIncident,
    renderCitizenReports
  };
})();
