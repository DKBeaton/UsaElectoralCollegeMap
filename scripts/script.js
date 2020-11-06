// Variables
const svg = document.querySelector('.svg');
const detachedStates = document.querySelectorAll('.detached-states-item.state');
const electoralDemElement = document.querySelector('.electoral-dem-value');
const electoralRemElement = document.querySelector('.electoral-rep-value');
const balanceOfPowerElement = document.querySelector('.balance-of-power');
const presidentElectElement1 = document.querySelector('.president-elect-1');
const presidentElectElement2 = document.querySelector('.president-elect-2');

// Handle click event on the SVG
svg.addEventListener('click', function(e) {
  const input = e.target;

  // Make sure we are not clicking on the map
  if (input.classList.contains('svg')) return

  // Focus path element
  const state = input.parentElement.querySelector('.state');

  // Set SVG map states party data
  setPartyData(state);

  // Set detached states party data
  detachedStates.forEach(detached => {
    if (!detached.classList.contains(state.id)) return
    setPartyData(detached);

    // Set CD1, CD2 and CD3 for NE and ME states
    // Force it to SVG path data
    if (detached.classList.contains('NE')) {
      document.querySelector('.detached-group-neb').querySelectorAll('.CD').forEach(val => {
        val.setAttribute('data-party', state.getAttribute('data-party'));
        val.setAttribute('data-type', state.getAttribute('data-type'));
      });
    } else if (detached.classList.contains('ME')) {
      document.querySelector('.detached-group-maine').querySelectorAll('.CD').forEach(val => {
        val.setAttribute('data-party', state.getAttribute('data-party'));
        val.setAttribute('data-type', state.getAttribute('data-type'));
      });
    }
  });

  // Re-tally vote
  calcVote();
})

detachedStates.forEach(state => {
  state.addEventListener('click', function (e) {
    const detached = e.target;

    // Set detached states party data
    setPartyData(detached);

    // Set SVG map states party data
    svg.querySelectorAll('path').forEach(state => {
      if (!detached.classList.contains(state.id)) return
      setPartyData(state);
    });
    
    // Deal with NE and ME states
    // if (detached.id =='NE1' || detached.id == 'NE-CD1' || detached.id =='NE-CD2' || detached.id == 'NE-CD3') {
    //   svg.querySelectorAll('path').forEach(state => {
    //     if (state.id !== 'NE') return;

    //     switch (detached.id) {
    //       case 'NE1':
    //         if (detached.getAttribute('data-party') == 'rep' && detached.getAttribute('data-type') == 'win') {
    //           state.style.fill = 'url(#pattern-NE-CD1)';
    //         }
    //         break;
    //       case 'NE-CD1':
    //         if (detached.getAttribute('data-party') == 'rep' && detached.getAttribute('data-type') == 'win') {
    //           state.style.fill = 'url(#pattern-NE-CD2)';
    //         }
    //         break;
    //       case 'NE-CD2':
    //         if (detached.getAttribute('data-party') == 'rep' && detached.getAttribute('data-type') == 'win') {
    //           state.style.fill = 'url(#pattern-NE-CD3)';
    //         }
    //         break;
    //       case 'NE-CD3':
    //         if (detached.getAttribute('data-party') == 'rep' && detached.getAttribute('data-type') == 'win') {
    //           state.style.fill = 'rgb(255, 74, 67)';
    //         }
    //         break;
    //       default:
    //         state.style.fill = '#ffc61c';
    //         break;
    //     }
    //   });
    // }

     // Re-tally vote
     calcVote();
  });
});

// Sets party data
function setPartyData(state) {
  if (state.getAttribute('data-party') === 'tossUp') {
    state.setAttribute('data-party', state.getAttribute('data-party') === 'tossUp' ? 'rep' : 'tossUp');
  } else if (state.getAttribute('data-party') === 'rep') {
    if (state.getAttribute('data-type') === 'win') {
      state.setAttribute('data-type', state.getAttribute('data-type') === 'win' ? 'lean' : 'win');
    } else {
      state.setAttribute('data-party', 'dem');
      state.setAttribute('data-type', 'win');
    }
  } else if (state.getAttribute('data-party') === 'dem') {
    if (state.getAttribute('data-type') === 'win') {
      state.setAttribute('data-type', state.getAttribute('data-type') === 'win' ? 'lean' : 'win');
    } else {
      state.setAttribute('data-party', 'tossUp');
      state.setAttribute('data-type', 'win');
    }
  }
}

// Calculate state vote count
function calcVote() {
  const party = {
    dem: 0,
    demLean: 0,
    rep: 0,
    repLean: 0
  };

  svg.querySelectorAll('path').forEach(state => {
    if (state.getAttribute('data-party') == 'rep') {
      state.getAttribute('data-type') == 'win' ? party.rep += stateLookup(state.id) : party.repLean += stateLookup(state.id);
    } else if (state.getAttribute('data-party') === 'dem')  {
      state.getAttribute('data-type') == 'win' ? party.dem += stateLookup(state.id) : party.demLean += stateLookup(state.id);
    }
  });

  // Update candidate values
  electoralDemElement.innerHTML = party.dem + party.demLean;
  electoralRemElement.innerHTML = party.rep + party.repLean;

  // Update balance of power
  electoralTotal(party);

  // Check 270 for win condition
  presidentElectElement1.style.display = (party.dem >= 270) ? 'block' : 'none';
  presidentElectElement2.style.display = (party.rep >= 270) ? 'block' : 'none';
}

// Cal total electoral
function electoralTotal(party) {
  let dem = party.dem / 538 * 100;
  let rep = party.rep / 538 * 100;
  let demLean = (party.demLean + party.dem) / 538 * 100;
  let repLean = (party.repLean + party.rep) / 538 * 100;
  
  const state = document.querySelector('.balance-of-power');
  const state2 = document.querySelector('.balance-container');

  state.style.setProperty("--dem-width", `${dem}%`, "");
  state.style.setProperty("--rep-width", `${rep}%`, "");

  state2.style.setProperty("--dem-lean-width", `${demLean}%`, "");
  state2.style.setProperty("--rep-lean-width", `${repLean}%`, "");
}

// Look up state electoral vote value 
function stateLookup(state) {
  let lookup = {
    'AK': 3,
    'HI': 4,
    'WA': 12,
    'OR': 7,
    'CA': 55,
    'ID': 4,
    'NV': 6,
    'MT': 3,
    'WY': 3,
    'UT': 6,
    'AZ': 11,
    'ND': 3,
    'SD': 3,
    'CO': 9,
    'NM': 5,
    'MN': 10,
    'NE': 5,
    'KS': 6,
    'OK': 7,
    'TX': 38,
    'IA': 6,
    'MO': 10,
    'AR': 6,
    'LA': 8,
    'WI': 10,
    'MI': 16,
    'IL': 20,
    'IN': 11,
    'OH': 18,
    'KY': 8,
    'TN': 11,
    'MS': 6,
    'AL': 9,
    'GA': 16,
    'FL': 29,
    'SC': 9,
    'NC': 15,
    'VA': 13,
    'WV': 5,
    'PA': 20,
    'NY': 29,
    'ME': 4,
    'VT': 3,
    'NH': 4,
    'MD': 10,
    'RI': 4,
    'MA': 11,
    'CT': 7,
    'DC': 3,
    'NJ': 14,
    'DE': 3
  };
  let result = lookup[state];
  return result;
}


