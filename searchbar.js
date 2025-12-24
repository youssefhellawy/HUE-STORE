document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const button = document.getElementById('searchButton');

  // Collect all list items that contain game entries
  const items = Array.from(document.querySelectorAll('section ul li'));

  // Build a name -> li mapping for suggestions
  let nameMap = items.map(li => {
    // priority: data-name, img.alt, onclick name inside anchor, textContent
    let display = '';
    const dataName = li.dataset && li.dataset.name;
    if (dataName) display = dataName.trim();
    else {
      const img = li.querySelector('img');
      if (img && img.alt) display = img.alt.trim();
      else {
        const a = li.querySelector('a');
        if (a && a.getAttribute('onclick')) {
          // try to extract name from onclick like addToCart({ name: 'FC 26 : ', price: 3500})
          const onclick = a.getAttribute('onclick');
          const m = onclick.match(/name:\s*'([^']+)'/i);
          if (m) display = m[1].trim();
        }
      }
    }
    if (!display) display = li.textContent.trim();
    return { display, li, key: display.toLowerCase() };
  }).filter(x => x.display);

  // Add entries from other pages so suggestions can include them and navigate
  const externalEntries = [
    // PlayStation page
    { display: 'FC 26', key: 'fc 26', href: 'playstation.html#corner1', source: 'PlayStation' },
    { display: 'EA Play', key: 'ea play', href: 'playstation.html#corner1', source: 'PlayStation' },
    { display: 'Call Of Duty BlackOps 7', key: 'call of duty blackops 7', href: 'playstation.html#corner1', source: 'PlayStation' },
    { display: 'Spiderman 2', key: 'spiderman 2', href: 'playstation.html#corner2', source: 'PlayStation' },
    { display: 'Need For Speed Heat', key: 'need for speed heat', href: 'playstation.html#corner2', source: 'PlayStation' },
    { display: 'God Of War', key: 'god of war', href: 'playstation.html#corner2', source: 'PlayStation' },
    { display: 'Ghost Of Tsushima', key: 'ghost of tsushima', href: 'playstation.html#corner3', source: 'PlayStation' },
    { display: 'Far Cry 6', key: 'far cry 6', href: 'playstation.html#corner3', source: 'PlayStation' },
    { display: 'Cyber Punk 2077', key: 'cyber punk 2077', href: 'playstation.html#corner3', source: 'PlayStation' },
    { display: 'Call Of Duty 6', key: 'call of duty 6', href: 'playstation.html#corner4', source: 'PlayStation' },
    { display: 'Batman Arkham Knight', key: 'batman arkham knight', href: 'playstation.html#corner4', source: 'PlayStation' },
    { display: 'Gta v', key: 'gta v', href: 'playstation.html#corner4', source: 'PlayStation' },
    // PC page
    { display: 'FC 26', key: 'fc 26', href: 'pcgames.html#corner1', source: 'PC' },
    { display: 'EA Play Pro Month', key: 'ea play pro month', href: 'pcgames.html#corner1', source: 'PC' },
    { display: 'EA Play Pro YEAR', key: 'ea play pro year', href: 'pcgames.html#corner1', source: 'PC' },
    { display: 'Fortnite 1000v', key: 'fortnite 1000v', href: 'pcgames.html#corner2', source: 'PC' },
    { display: 'Fortnite 2800v', key: 'fortnite 2800v', href: 'pcgames.html#corner2', source: 'PC' },
    { display: 'Fortnite 5000v', key: 'fortnite 5000v', href: 'pcgames.html#corner2', source: 'PC' },
    { display: 'Fortnite 13500v', key: 'fortnite 13500v', href: 'pcgames.html#corner3', source: 'PC' },
    { display: 'Fortnite Crew Pack', key: 'fortnite crew pack', href: 'pcgames.html#corner3', source: 'PC' },
    { display: 'Fortnite Starter Pack', key: 'fortnite starter pack', href: 'pcgames.html#corner3', source: 'PC' },
    { display: 'God Of War', key: 'god of war', href: 'pcgames.html#corner4', source: 'PC' },
    { display: 'Cyber Punk 2077', key: 'cyber punk 2077', href: 'pcgames.html#corner4', source: 'PC' },
    { display: 'Gta v', key: 'gta v', href: 'pcgames.html#corner4', source: 'PC' },
    // Mobile page
    { display: 'Pubg 60Uc', key: 'pubg 60uc', href: 'mobilegames.html#corner1', source: 'Mobile' },
    { display: 'Pubg 325Uc', key: 'pubg 325uc', href: 'mobilegames.html#corner1', source: 'Mobile' },
    { display: 'Pubg 660Uc', key: 'pubg 660uc', href: 'mobilegames.html#corner1', source: 'Mobile' },
    { display: 'Pubg 1800Uc', key: 'pubg 1800uc', href: 'mobilegames.html#corner2', source: 'Mobile' },
    { display: 'Pubg 3850Uc', key: 'pubg 3850uc', href: 'mobilegames.html#corner2', source: 'Mobile' },
    { display: 'Pubg 8100Uc', key: 'pubg 8100uc', href: 'mobilegames.html#corner2', source: 'Mobile' },
    { display: 'Free Fire 530D', key: 'free fire 530d', href: 'mobilegames.html#corner3', source: 'Mobile' },
    { display: 'Free Fire 1080D', key: 'free fire 1080d', href: 'mobilegames.html#corner3', source: 'Mobile' },
    { display: 'Free Fire 2200D', key: 'free fire 2200d', href: 'mobilegames.html#corner3', source: 'Mobile' },
    { display: 'Pes mobile 260G', key: 'pes mobile 260g', href: 'mobilegames.html#corner4', source: 'Mobile' },
    { display: 'Pes mobile 840G', key: 'pes mobile 840g', href: 'mobilegames.html#corner4', source: 'Mobile' },
    { display: 'Pes mobile 3430G', key: 'pes mobile 3430g', href: 'mobilegames.html#corner4', source: 'Mobile' }
  ];

  // Merge external entries into nameMap (avoid duplicates by key+source)
  externalEntries.forEach(ext => {
    const exists = nameMap.find(n => n.key === ext.key && n.source === ext.source);
    if (!exists) nameMap.push(Object.assign({}, ext));
  });

  // Create suggestions container
  const suggestions = document.createElement('div');
  suggestions.id = 'searchSuggestions';
  suggestions.className = 'search-suggestions';
  // ensure parent positioning
  const container = input.parentElement || document.body;
  if (window.getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(suggestions);

  // Helper to get searchable text for an li
  function itemText(li) {
    const img = li.querySelector('img');
    if (img && img.alt) return img.alt.trim().toLowerCase();
    const a = li.querySelector('a');
    if (a && a.getAttribute('onclick')) return a.getAttribute('onclick').toLowerCase();
    return li.textContent.trim().toLowerCase();
  }

  // show/hide main sections when searching
  const sectionRecent = document.getElementById('RecentGames');
  const sectionBest = document.getElementById('Best-selling');
  const recentTitle = sectionRecent ? sectionRecent.querySelector('.RecentGamesTitle') : null;
  const bestTitle = sectionBest ? sectionBest.querySelector('.Best-sellingTitle') : null;

  function showAll() {
    items.forEach(i => (i.style.display = ''));
    if (recentTitle) recentTitle.style.display = '';
    if (bestTitle) bestTitle.style.display = '';
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      showAll();
      return;
    }
    // when searching, hide only the section titles (keep lists visible so matched items appear)
    if (recentTitle) recentTitle.style.display = 'none';
    if (bestTitle) bestTitle.style.display = 'none';

    items.forEach(li => {
      const text = itemText(li);
      li.style.display = text.includes(q) ? '' : 'none';
    });
  }

  // show suggestions (autocomplete)
  let selectedIndex = -1;
  function showSuggestions(q) {
    suggestions.innerHTML = '';
    selectedIndex = -1;
    const term = q.trim().toLowerCase();
    if (!term) return;

    // prioritize startsWith, then includes
    const starts = nameMap.filter(n => n.key.startsWith(term));
    const includes = nameMap.filter(n => !n.key.startsWith(term) && n.key.includes(term));
    const list = starts.concat(includes).slice(0, 8);
    if (list.length === 0) return;

    list.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'search-suggestion';
      div.tabIndex = 0;
      // show source label for external entries
      div.textContent = item.display + (item.source ? ` (${item.source})` : '');
      div.addEventListener('click', () => {
        input.value = item.display;
        suggestions.innerHTML = '';
        if (item.href) {
          // navigate to external page
          window.location.href = item.href;
        } else if (item.li) {
          navigateTo(item.li);
        }
      });
      div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') div.click();
      });
      suggestions.appendChild(div);
    });
  }

  function clearSuggestions() { suggestions.innerHTML = ''; selectedIndex = -1; }

  function highlight(li) {
    li.classList.add('search-highlight');
    setTimeout(() => li.classList.remove('search-highlight'), 2500);
  }

  function navigateTo(li) {
    const section = li.closest('section') || li;
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlight(li);
  }

  function showNoMatch() {
    if (typeof showToast === 'function') showToast('No results found');
    else alert('No results found');
  }

  function handleNavigate(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      filter('');
      return;
    }

    // If user typed a hash/id like '#RecentGames', try direct id lookup
    if (q.startsWith('#')) {
      const id = q.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

      // Try to find exact matches (by image alt / data-name / onclick name / text)
      const exactMatches = nameMap.filter(n => n.key === q);

      // prefer local matches if any
      const exactLocal = exactMatches.filter(n => n.li);
      const exactExternal = exactMatches.filter(n => n.href);

      if (exactLocal.length > 0) {
        showAll();
        exactLocal.forEach(n => n.li && highlight(n.li));
        navigateTo(exactLocal[0].li);
        return;
      }

      if (exactExternal.length > 0) {
        // jump to the first external match
        window.location.href = exactExternal[0].href;
        return;
      }

      // If no exact matches, try strict prefix matches (items that start with query)
      const prefixMatches = nameMap.filter(n => n.key.startsWith(q));
      const prefixLocal = prefixMatches.filter(n => n.li);
      const prefixExternal = prefixMatches.filter(n => n.href);

      if (prefixLocal.length > 0) {
        showAll();
        prefixLocal.forEach(n => n.li && highlight(n.li));
        navigateTo(prefixLocal[0].li);
        return;
      }

      if (prefixExternal.length > 0) {
        window.location.href = prefixExternal[0].href;
        return;
      }

      showNoMatch();
  }

    // while typing show only suggestions (don't filter the page live)
    input.addEventListener('input', (e) => { showSuggestions(e.target.value); });

  // navigate on Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // if a suggestion is selected, use it
      const suggs = suggestions.querySelectorAll('.search-suggestion');
      if (selectedIndex >= 0 && selectedIndex < suggs.length) {
        suggs[selectedIndex].click();
        return;
      }
      handleNavigate(input.value);
    }
    if (e.key === 'Escape') {
      input.value = '';
      filter('');
      input.blur();
      clearSuggestions();
    }
    // arrow key navigation inside suggestions
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const nodes = suggestions.querySelectorAll('.search-suggestion');
      if (nodes.length === 0) return;
      e.preventDefault();
      if (e.key === 'ArrowDown') selectedIndex = Math.min(selectedIndex + 1, nodes.length - 1);
      else selectedIndex = Math.max(selectedIndex - 1, 0);
      nodes.forEach(n => n.classList.remove('selected'));
      nodes[selectedIndex].classList.add('selected');
      nodes[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  });

  // button click triggers navigation (useful on touch)
  button.addEventListener('click', () => handleNavigate(input.value));
  // hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) clearSuggestions();
  });
});
