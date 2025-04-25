// script.js
document.getElementById('theme-switcher').addEventListener('change', function() {
  document.body.classList.toggle('solarized');
});

document.getElementById('upload-button').addEventListener('click', function() {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      const mappings = parseMappings(content);
      displayMappings(mappings);
    };
    reader.readAsText(file);
  }
});

function parseMappings(data) {
  const lines = data.split('\n');
  const mappings = [];
  let currentGroup = '';

  lines.forEach(line => {
    if (line.startsWith('"')) {
      currentGroup = line.replace('"', '').trim();
    } else if (line.startsWith('map')) {
      const parts = line.split(' ');
      const keys = parts[1];
      const action = parts.slice(2).join(' ');
      mappings.push({ group: currentGroup, keys, action });
    }
  });

  return mappings;
}

function displayMappings(mappings) {
  const container = document.getElementById('mappings-container');
  container.innerHTML = ''; // Clear previous content
  const groups = {};

  mappings.forEach(mapping => {
    if (!groups[mapping.group]) {
      groups[mapping.group] = [];
    }
    groups[mapping.group].push(mapping);
  });

  for (const group in groups) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'mapping-group';
    const groupTitle = document.createElement('h2');
    groupTitle.textContent = group;
    groupDiv.appendChild(groupTitle);

    groups[group].forEach(mapping => {
      const mappingDiv = document.createElement('div');
      mappingDiv.className = 'mapping';
      const keysDiv = document.createElement('div');
      keysDiv.className = 'keys';
      keysDiv.innerHTML = splitKeys(mapping.keys).map(key => {
        if (key === '<leader>') {
          return `<span class="key leader">Leader</span>`;
        } else {
          return `<span class="key">${key}</span>`;
        }
      }).join(' ');
      const descriptionDiv = document.createElement('div');
      descriptionDiv.className = 'description';
      descriptionDiv.textContent = mapping.action;

      mappingDiv.appendChild(keysDiv);
      mappingDiv.appendChild(descriptionDiv);
      groupDiv.appendChild(mappingDiv);
    });

    container.appendChild(groupDiv);
  }
}

function splitKeys(keys) {
  const result = [];
  let buffer = '';
  let inBracket = false;

  for (let i = 0; i < keys.length; i++) {
    const char = keys[i];
    if (char === '<') {
      inBracket = true;
      buffer += char;
    } else if (char === '>') {
      inBracket = false;
      buffer += char;
      result.push(buffer);
      buffer = '';
    } else if (inBracket) {
      buffer += char;
    } else {
      result.push(char);
    }
  }

  return result;
}
