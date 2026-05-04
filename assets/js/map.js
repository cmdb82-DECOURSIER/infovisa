/* InfoVisa.lu — Carte interactive du monde (Leaflet + Natural Earth GeoJSON)
   Dépend de visa-data.js (window.VISA_DATA, VISA_CATEGORIES, FEES_2026).
*/
(() => {
  'use strict';
  if (!window.L) { console.warn('Leaflet non chargé'); return; }

  // Mapping ISO numérique → ISO alpha-2 (subset des pays présents dans VISA_DATA)
  // Source : ISO 3166-1. On gère les principaux pays.
  const ISO_NUM_TO_ALPHA2 = {
    '004':'AF','008':'AL','012':'DZ','020':'AD','024':'AO','028':'AG','031':'AZ','032':'AR',
    '036':'AU','040':'AT','044':'BS','048':'BH','050':'BD','051':'AM','052':'BB','056':'BE',
    '064':'BT','068':'BO','070':'BA','072':'BW','076':'BR','084':'BZ','090':'SB','096':'BN',
    '100':'BG','104':'MM','108':'BI','112':'BY','116':'KH','120':'CM','124':'CA','132':'CV',
    '140':'CF','144':'LK','148':'TD','152':'CL','156':'CN','158':'TW','170':'CO','174':'KM',
    '178':'CG','180':'CD','188':'CR','191':'HR','192':'CU','196':'CY','203':'CZ','204':'BJ',
    '208':'DK','212':'DM','214':'DO','218':'EC','222':'SV','226':'GQ','231':'ET','232':'ER',
    '233':'EE','242':'FJ','246':'FI','250':'FR','266':'GA','268':'GE','270':'GM','276':'DE',
    '288':'GH','292':'GI','296':'KI','300':'GR','308':'GD','320':'GT','324':'GN','328':'GY',
    '332':'HT','340':'HN','344':'HK','348':'HU','352':'IS','356':'IN','360':'ID','364':'IR',
    '368':'IQ','372':'IE','376':'IL','380':'IT','384':'CI','388':'JM','392':'JP','398':'KZ',
    '400':'JO','404':'KE','408':'KP','410':'KR','414':'KW','417':'KG','418':'LA','422':'LB',
    '426':'LS','428':'LV','430':'LR','434':'LY','438':'LI','440':'LT','442':'LU','446':'MO',
    '450':'MG','454':'MW','458':'MY','462':'MV','466':'ML','470':'MT','478':'MR','480':'MU',
    '484':'MX','492':'MC','496':'MN','498':'MD','499':'ME','504':'MA','508':'MZ','512':'OM',
    '516':'NA','520':'NR','524':'NP','528':'NL','554':'NZ','558':'NI','562':'NE','566':'NG',
    '578':'NO','583':'FM','584':'MH','585':'PW','586':'PK','591':'PA','598':'PG','600':'PY',
    '604':'PE','608':'PH','616':'PL','620':'PT','624':'GW','626':'TL','634':'QA','642':'RO',
    '643':'RU','646':'RW','659':'KN','662':'LC','670':'VC','678':'ST','682':'SA','686':'SN',
    '688':'RS','690':'SC','694':'SL','702':'SG','703':'SK','704':'VN','705':'SI','706':'SO',
    '710':'ZA','716':'ZW','724':'ES','728':'SS','729':'SD','740':'SR','748':'SZ','752':'SE',
    '756':'CH','760':'SY','762':'TJ','764':'TH','768':'TG','776':'TO','780':'TT','784':'AE',
    '788':'TN','792':'TR','795':'TM','798':'TV','800':'UG','804':'UA','807':'MK','818':'EG',
    '826':'GB','834':'TZ','840':'US','854':'BF','858':'UY','860':'UZ','862':'VE','882':'WS',
    '887':'YE','894':'ZM','275':'PS','-99':'XK'
  };

  // Couleurs par catégorie
  function colorFor(category) {
    if (!category) return '#CBD5E1';
    return (window.VISA_CATEGORIES && window.VISA_CATEGORIES[category])
      ? window.VISA_CATEGORIES[category].color
      : '#CBD5E1';
  }

  function styleFeature(props, options = {}) {
    const code = ISO_NUM_TO_ALPHA2[props.id] || ISO_NUM_TO_ALPHA2[String(props.id).padStart(3, '0')];
    const data = code && window.VISA_DATA[code];
    const cat = data ? data.r : null;
    const dimmed = options.filter && cat && options.filter !== 'all' && cat !== options.filter;
    return {
      fillColor: colorFor(cat),
      weight: 0.5,
      color: 'rgba(15,23,42,0.5)',
      fillOpacity: dimmed ? 0.18 : (data ? 0.78 : 0.32)
    };
  }

  class WorldMap {
    constructor(container) {
      this.container = container;
      this.filter = 'all';
      this.geoLayer = null;
      this.activeLayer = null;

      // Init Leaflet
      this.map = L.map(container, {
        center: [30, 15],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        worldCopyJump: true,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: 'center',
        preferCanvas: true
      });
      L.control.attribution({ position: 'bottomright', prefix: '' })
        .addAttribution('© Natural Earth · InfoVisa.lu')
        .addTo(this.map);

      this.loadGeoJSON();
    }

    loadGeoJSON() {
      // World Atlas 110m countries (≈110KB) via jsdelivr CDN
      // Provides ISO numeric IDs in feature.id
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json')
        .then(r => r.json())
        .then(topo => {
          // topojson conversion
          if (typeof topojson === 'undefined') {
            console.warn('topojson-client manquant — tentative en GeoJSON brut');
            return null;
          }
          return topojson.feature(topo, topo.objects.countries);
        })
        .then(geo => {
          if (!geo) return;
          this.renderGeo(geo);
        })
        .catch(err => {
          console.error('Erreur de chargement carte:', err);
          this.container.innerHTML = `
            <div style="padding:var(--s-8);text-align:center;color:var(--c-muted);">
              <p>Impossible de charger la carte du monde.</p>
              <p style="font-size:0.85rem">Vérifiez votre connexion et rechargez la page.</p>
            </div>`;
        });
    }

    renderGeo(geo) {
      if (this.geoLayer) this.map.removeLayer(this.geoLayer);

      this.geoLayer = L.geoJSON(geo, {
        style: (feat) => styleFeature(feat, { filter: this.filter }),
        onEachFeature: (feat, layer) => this.bindCountry(feat, layer)
      }).addTo(this.map);
    }

    bindCountry(feat, layer) {
      const code = ISO_NUM_TO_ALPHA2[feat.id] || ISO_NUM_TO_ALPHA2[String(feat.id).padStart(3, '0')];
      const data = code && window.VISA_DATA[code];
      const cat = data ? data.r : null;
      const catInfo = cat && window.VISA_CATEGORIES[cat];

      if (data && catInfo) {
        const tooltip = `
          <div class="tip-name">${data.f || ''} ${data.n}</div>
          <div class="tip-cat">
            <span class="dot" style="background:${catInfo.color}"></span>
            ${catInfo.label}
          </div>
          <div class="tip-meta">${cat === 'visa-c' ? 'Cliquer pour les démarches' : (cat === 'exempt' ? 'Cliquer pour les conditions ETIAS' : 'Cliquer pour plus d\'infos')}</div>
        `;
        layer.bindTooltip(tooltip, { className: 'visa-tip', sticky: true, direction: 'top' });

        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ weight: 1.5, fillOpacity: 0.92, color: '#0A2540' });
            e.target.bringToFront();
          },
          mouseout: (e) => {
            e.target.setStyle(styleFeature(feat, { filter: this.filter }));
          },
          click: (e) => {
            this.openCountryPanel(code, data);
            try { this.map.fitBounds(e.target.getBounds(), { padding:[40,40], maxZoom: 5 }); } catch(_) {}
          }
        });
      } else {
        layer.bindTooltip(`<div class="tip-name">${feat.properties && (feat.properties.name || feat.properties.NAME) || 'Pays'}</div><div class="tip-meta">Données indisponibles</div>`, { className: 'visa-tip', sticky: true });
        layer.options.interactive = false;
      }
    }

    applyFilter(filter) {
      this.filter = filter;
      if (this.geoLayer) {
        this.geoLayer.eachLayer(l => l.setStyle(styleFeature(l.feature, { filter })));
      }
    }

    openCountryPanel(code, data) {
      const panel = document.querySelector('.country-panel');
      if (!panel) return;

      const cat = data.r;
      const catInfo = window.VISA_CATEGORIES[cat] || {};
      const fees = window.FEES_2026 || {};

      const flag = data.f || '🌍';
      panel.querySelector('[data-panel-flag]').textContent = flag;
      panel.querySelector('[data-panel-name]').textContent = data.n;

      // Banner with category
      const banner = panel.querySelector('[data-panel-banner]');
      const icons = { schengen:'★', exempt:'✓', 'visa-c':'📄', special:'⚠' };
      banner.className = `cat-banner ${cat}`;
      banner.innerHTML = `<span class="icon">${icons[cat] || '•'}</span><div>
        <div>${catInfo.label || ''}</div>
        <div style="font-weight:400;font-size:0.85rem;opacity:0.8">${catInfo.desc || ''}</div>
      </div>`;

      // Details
      const dl = panel.querySelector('[data-panel-details]');
      dl.innerHTML = '';
      const rows = [];

      if (cat === 'schengen') {
        rows.push(['Statut', 'Membre Schengen — circulation libre']);
        rows.push(['Pour les résidents UE', 'Aucun visa pour les autres pays Schengen']);
        rows.push(['Ressortissants tiers', 'Visa selon nationalité du voyageur']);
      } else if (cat === 'exempt') {
        rows.push(['Type de séjour', 'Tourisme, affaires, visite familiale, transit']);
        rows.push(['Durée maximale', '≤ 90 jours sur toute période de 180 jours']);
        rows.push(['Visa requis', 'Non, exempté']);
        rows.push(['Frais', '0 €']);
        if (data.etias) rows.push(['ETIAS (dès Q4 2026)', `Autorisation en ligne — ${fees.etias?.value || 7} €, valable 3 ans`]);
        rows.push(['EES (en vigueur)', 'Enregistrement biométrique aux frontières Schengen']);
      } else if (cat === 'visa-c') {
        rows.push(['Type de visa', 'Visa Schengen C (court séjour)']);
        rows.push(['Durée maximale', '≤ 90 jours sur 180']);
        rows.push(['Frais consulaires', `${fees.cAdult?.value || 90} € adulte · ${fees.cChild6_12?.value || 45} € enfant 6-12 · 0 € moins de 6 ans`]);
        rows.push(['Délai indicatif', '15 jours ouvrés (jusqu\'à 45 j en haute saison)']);
        rows.push(['Validité', '90 j max sur 180 j ; mention « Schengen » couvre les 29 pays']);
        rows.push(['Documents clés', 'Passeport (validité ≥ 3 mois après retour, 2 pages vierges), photo biométrique récente, formulaire signé, assurance santé voyage ≥ 30 000 €, justificatifs financiers et de séjour']);
        if (data.atv) rows.push(['ATV', 'Visa de transit aéroportuaire (A) requis pour escales sans entrée en Schengen']);
      } else if (cat === 'special') {
        rows.push(['Statut', catInfo.label]);
        rows.push(['Recommandation', 'Vérifier les conditions actuelles auprès de l\'ambassade ou du consulat compétent']);
      }

      if (data.note) rows.push(['À noter', data.note]);

      dl.innerHTML = rows.map(([dt,dd]) => `<div class="detail-row"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');

      // Actions
      const actions = panel.querySelector('[data-panel-actions]');
      if (cat === 'visa-c' || cat === 'special') {
        actions.innerHTML = `
          <a class="btn btn-primary" href="/fr/comment-postuler.html">Étapes de demande</a>
          <a class="btn btn-secondary" href="/fr/documents-requis.html">Documents requis</a>
          <a class="btn btn-ghost" href="/fr/refus-de-visa.html">En cas de refus</a>
        `;
      } else if (cat === 'exempt') {
        actions.innerHTML = `
          <a class="btn btn-primary" href="/fr/etias.html">Tout savoir sur ETIAS</a>
          <a class="btn btn-secondary" href="/fr/ees-systeme-entree-sortie.html">Système EES</a>
        `;
      } else {
        actions.innerHTML = `
          <a class="btn btn-primary" href="/fr/pays-schengen.html">Tous les pays Schengen</a>
        `;
      }

      panel.classList.add('open');
    }
  }

  // Init when DOM ready
  function init() {
    const el = document.getElementById('world-map');
    if (!el) return;
    window.__worldMap = new WorldMap(el);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
