/* ==========================================================================
   INTERACTIVE CYBER TERMINAL EMULATOR
   Full interactive command-line experience with command history, autocomplete,
   and dynamic feedback.
   ========================================================================== */

(function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalInput = document.getElementById('terminal-input');

  if (!terminalBody || !terminalHistory || !terminalInput) return;

  const history = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `Available commands:
  <span style="color:var(--accent-cyan)">whoami</span>       - Display identity and academic background
  <span style="color:var(--accent-cyan)">skills</span>       - Inspect technical stack and competencies
  <span style="color:var(--accent-cyan)">projects</span>     - Browse featured systems & engineering works
  <span style="color:var(--accent-cyan)">rules</span>        - Read the 3 Core Engineering Principles
  <span style="color:var(--accent-cyan)">contact</span>      - Retrieve secure transmission channels
  <span style="color:var(--accent-cyan)">clear</span>        - Clear terminal screen
  <span style="color:var(--accent-cyan)">date</span>         - Display current system timestamp
  <span style="color:var(--accent-cyan)">sudo</span>         - Attempt elevated root execution`,

    whoami: `<span style="color:var(--accent-cyan);font-weight:bold;">TAMAL KANTI SARKER</span>
Role: Systems & Mobile Engineer · Algorithmic Problem Solver
Institution: University of Dhaka (DU)
Department: Computer Science and Engineering (CSE)
Location: Dhaka, Bangladesh [23.7275° N, 90.4043° E]
Mission: Building resilient distributed architectures and cryptographic protocols.`,

    skills: `LANGUAGES:
  • C/C++20 (Competitive Programming, Low-Level)
  • Java (Enterprise Systems, Socket Protocols, JavaFX)
  • Dart / Flutter (Mobile Cross-Platform, Dynamic Rive UI)
  • Python (Automation, Microservices, ML Prototyping)
  • SQL (PostgreSQL, MySQL Relational Schemas)

SYSTEMS & PROTOCOLS:
  • Hybrid Encryption (RSA Key Exchange + AES-GCM Payloads)
  • Non-blocking Multi-threading & Socket I/O
  • Custom Application-Layer Chunked Resumable Transfers
  • QoS Packet Priority Queuing (Real-time latency mitigation)`,

    projects: `FEATURED REPOSITORIES:
  [1] <a href="https://github.com/tamalkantisarker/Networking" target="_blank" style="color:var(--accent-cyan)">Networking</a>
      - Encrypted client-server suite with RSA/AES-GCM & QoS queues.
  [2] <a href="https://github.com/tamalkantisarker/HoneyTALK" target="_blank" style="color:#70d6ff)">HoneyTALK</a>
      - Live multi-seat audio rooms in Flutter with fallback asset caching.
  [3] <a href="https://github.com/tamalkantisarker/DSA" target="_blank" style="color:var(--accent-cyan)">DSA & Graph Theory</a>
      - Tarjan's SCC, Articulation Points, Bellman-Ford, Kruskal/Prim.
  [4] <a href="https://github.com/tamalkantisarker/Java_project" target="_blank" style="color:#fde68a)">Cafeteria Enterprise System</a>
      - JavaFX + MySQL 4-tier RBAC for Science Complex, University of Dhaka.
  [5] <a href="https://github.com/tamalkantisarker/Number-Theory-part-1" target="_blank" style="color:var(--accent-cyan)">Number-Theory-part-1</a>
      - Computational number theory & cryptography primitives in C++.`,

    rules: `THE 3 CORE PRINCIPLES OF THE ENGINEER:
  RULE I   · Code must optimize for both asymptotic elegance and real-world resilience.
  RULE II  · Security is not an afterthought; cryptographic primitives must be mathematically rigorous.
  RULE III · Clean modular abstractions conquer chaotic business requirements.`,

    contact: `TRANSMISSION CHANNELS:
  • Email:    <a href="mailto:tamalkanti223@gmail.com" style="color:var(--accent-cyan)">tamalkanti223@gmail.com</a>
  • GitHub:   <a href="https://github.com/tamalkantisarker" target="_blank" style="color:var(--accent-cyan)">github.com/tamalkantisarker</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/tamalkantisarker" target="_blank" style="color:var(--accent-cyan)">linkedin.com/in/tamalkantisarker</a>`,

    sudo: `<span style="color:#ef4444">Permission denied:</span> User 'visitor' is not in the sudoers file on the DU mainframe. This incident will be reported to Tamal.`,

    date: () => new Date().toUTCString()
  };

  function appendLine(content, isCommand = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (isCommand) {
      line.innerHTML = `<span class="terminal-prompt-label">visitor@tks-kernel:~$</span> ${content}`;
    } else {
      line.innerHTML = `<div style="margin-left: 1rem; color: var(--text-muted);">${content}</div>`;
    }
    terminalHistory.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (window.soundEngine) {
      window.soundEngine.playKeypress();
    }

    if (e.key === 'Enter') {
      const input = terminalInput.value.trim();
      terminalInput.value = '';

      if (input.length > 0) {
        history.push(input);
        historyIndex = history.length;
        appendLine(input, true);

        const lowerCmd = input.toLowerCase();

        if (lowerCmd === 'clear') {
          terminalHistory.innerHTML = '';
          return;
        }

        if (COMMANDS[lowerCmd]) {
          const res = typeof COMMANDS[lowerCmd] === 'function' ? COMMANDS[lowerCmd]() : COMMANDS[lowerCmd];
          appendLine(res);
          if (window.soundEngine) window.soundEngine.playHover();
        } else {
          appendLine(`<span style="color:#ef4444">Command not found: '${input}'. Type <span style="color:var(--accent-cyan)">'help'</span> for available commands.</span>`);
          if (window.soundEngine) window.soundEngine.playGlitch();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  // Clicking anywhere inside terminal focuses input
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
})();
