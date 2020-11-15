// Use this. in functions for my obj

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

  // Make sure we are clicking on a state element in the SVG and not blank space
  if (input.classList.contains('svg')) return

  // Focus state path element
  const state = input.parentElement.querySelector('.state');

  // Set electoral votes data
  setStateData(state);

  // Set SVG map states party data
  setPartyData(state);

  // Set detached states party data
  detachedStates.forEach(detached => {
    if (!detached.classList.contains(state.id)) return
    setPartyData(detached);

    // Set detached party data
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

// Handle detached states click event
detachedStates.forEach(state => {
  state.addEventListener('click', function (e) {
    const detached = e.target;

    // Set detached states party data
    setPartyData(detached);

    // Set detached electoral votes on element
    setStateData(detached);

    // Set SVG map states party data
    svg.querySelectorAll('path').forEach(state => {
      if (!detached.classList.contains(state.id)) return
      setPartyData(state);
    });

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

  // Reduce method of looping through states and adding it to the party object
  const partyData = Array.from(svg.querySelectorAll('path')).reduce((obj, state) => {
      // Handle NE and ME
      if (state.id == 'NE' || state.id == 'ME') {
        // Get detached state electoral data
        if (state.id == 'NE') {
          document.querySelector('.detached-group-neb').querySelectorAll('.detached-states-item').forEach(val => {
            if (val.id == 'NE1') {
              if (val.getAttribute('data-party') == 'rep') {
                val.getAttribute('data-type') == 'win' ? obj.rep += +val.getAttribute('data-ne') : obj.repLean += +val.getAttribute('data-ne');
              } else if (val.getAttribute('data-party') === 'dem')  {
                val.getAttribute('data-type') == 'win' ? obj.dem += +val.getAttribute('data-ne') : obj.demLean += +val.getAttribute('data-ne');
              }
            } else if (val.id == 'NE-CD1') {
              if (val.getAttribute('data-party') == 'rep') {
                val.getAttribute('data-type') == 'win' ? obj.rep += +val.getAttribute('data-cd1') : obj.repLean += +val.getAttribute('data-cd1');
              } else if (val.getAttribute('data-party') === 'dem')  {
                val.getAttribute('data-type') == 'win' ? obj.dem += +val.getAttribute('data-cd1') : obj.demLean += +val.getAttribute('data-cd1');
              }
            } else if (val.id == 'NE-CD2') {
              if (val.getAttribute('data-party') == 'rep') {
                val.getAttribute('data-type') == 'win' ? obj.rep += +val.getAttribute('data-cd2'): obj.repLean += +val.getAttribute('data-cd2');
              } else if (val.getAttribute('data-party') === 'dem')  {
                val.getAttribute('data-type') == 'win' ? obj.dem += +val.getAttribute('data-cd2') : obj.demLean += +val.getAttribute('data-cd2');
              }
            } else if (val.id == 'NE-CD3') {
              if (val.getAttribute('data-party') == 'rep') {
                val.getAttribute('data-type') == 'win' ? obj.rep += +val.getAttribute('data-cd3'): obj.repLean += +val.getAttribute('data-cd3');
              } else if (val.getAttribute('data-party') === 'dem')  {
                val.getAttribute('data-type') == 'win' ? obj.dem += +val.getAttribute('data-cd3') : obj.demLean += +val.getAttribute('data-cd3');
              }
            }
          });
        } else {
          document.querySelector('.detached-group-maine').querySelectorAll('.detached-states-item').forEach(val => {
            if (val.id == 'ME1') {
              if (val.getAttribute('data-party') == 'rep') {
                val.getAttribute('data-type') == 'win' ? obj.rep += +val.getAttribute('data-me') : obj.repLean += +val.getAttribute('data-me');
              } else if (val.getAttribute('data-party') === 'dem')  {
                val.getAttribute('data-type') == 'win' ? obj.dem += +val.getAttribute('data-me') : obj.demLean += +val.getAttribute('data-me');
              }
            } else if (val.id == 'ME-CD1') {
              if (val.getAttribute('data-party') == 'rep') {
                val.getAttribute('data-type') == 'win' ? obj.rep += +val.getAttribute('data-cd1') : obj.repLean += +val.getAttribute('data-cd1');
              } else if (val.getAttribute('data-party') === 'dem')  {
                val.getAttribute('data-type') == 'win' ? obj.dem += +val.getAttribute('data-cd1') : obj.demLean += +val.getAttribute('data-cd1');
              }
            } else if (val.id == 'ME-CD2') {
              if (val.getAttribute('data-party') == 'rep') {
                val.getAttribute('data-type') == 'win' ? obj.rep += +val.getAttribute('data-cd2') : obj.repLean += +val.getAttribute('data-cd2');
              } else if (val.getAttribute('data-party') === 'dem')  {
                val.getAttribute('data-type') == 'win' ? obj.dem += +val.getAttribute('data-cd2') : obj.demLean += +val.getAttribute('data-cd2');
              }
            }
          });
        }
      } else {
        if (state.getAttribute('data-party') == 'rep') {
          state.getAttribute('data-type') == 'win' ? obj.rep += stateLookup(state.id) : obj.repLean += stateLookup(state.id);
        } else if (state.getAttribute('data-party') === 'dem')  {
          state.getAttribute('data-type') == 'win' ? obj.dem += stateLookup(state.id) : obj.demLean += stateLookup(state.id);
        }
      }

      return obj;
  }, {
    dem: 0,
    demLean: 0,
    rep: 0,
    repLean: 0
  });

  // Update candidate values
  electoralDemElement.innerHTML = partyData.dem + partyData.demLean;
  electoralRemElement.innerHTML = partyData.rep + partyData.repLean;

  // Update balance of power
  electoralTotal(partyData);

  // Check 270 for win condition and update winner
  presidentElectElement1.style.display = (partyData.dem >= 270) ? 'block' : 'none';
  presidentElectElement2.style.display = (partyData.rep >= 270) ? 'block' : 'none';
}

// Calculate and set total electoral
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

// Set state data
function setStateData(detached) {
  //SVG element 
  if (detached.tagName == 'path') {
    if (detached.id == 'NE') {
      document.querySelector('.detached-group-neb').querySelectorAll('.detached-states-item').forEach(state => {
        if (state.id == 'NE1') {
          state.setAttribute('data-ne', 2);
        } else if (state.id == 'NE-CD1') {
          state.setAttribute('data-cd1', 1);
        } else if (state.id == 'NE-CD2') {
          state.setAttribute('data-cd2', 1);
        } else if (state.id == 'NE-CD3') {
          state.setAttribute('data-cd3', 1);
        }
      });
    } else {
      document.querySelector('.detached-group-maine').querySelectorAll('.detached-states-item').forEach(state => {
        if (state.id == 'ME1') {
          state.setAttribute('data-me', 2);
        } else if (state.id == 'ME-CD1') {
          state.setAttribute('data-cd1', 1);
        } else if (state.id == 'ME-CD2') {
          state.setAttribute('data-cd2', 1);
        } else if (state.id == 'ME-CD3') {
          state.setAttribute('data-cd3', 1);
        }
      });
    }
  } else {
    // Detached elements
    if (detached.id == 'ME1') {
      detached.setAttribute('data-me', 2);
    } else if (detached.id == 'NE1') {
      detached.setAttribute('data-ne', 2);
    } else if (detached.id == 'ME-CD1' || detached.id == 'NE-CD1') {
      detached.setAttribute('data-cd1', 1);
    } else if (detached.id == 'ME-CD2' || detached.id == 'NE-CD2') {
      detached.setAttribute('data-cd2', 1);
    } else if (detached.id == 'ME-CD3' || detached.id == 'NE-CD3') {
      detached.setAttribute('data-cd3', 1);
    }
  }
}


