import './style.css';

/* ── RAIN GENERATOR ── */
    (function () {
      const rain = document.getElementById('rain');
      const COUNT = 80;

      for (let i = 0; i < COUNT; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';

        const left     = Math.random() * 100;
        const height   = 60 + Math.random() * 80;
        const duration = 1.4 + Math.random() * 2.2;
        const delay    = -(Math.random() * duration);
        const opacity  = 0.25 + Math.random() * 0.45;

        drop.style.cssText = `
          left: ${left}%;
          height: ${height}px;
          opacity: ${opacity};
          animation-duration: ${duration}s;
          animation-delay: ${delay}s;
        `;
        rain.appendChild(drop);
      }
    })();

    /* ── CHAR COUNTER ── */
    const queja     = document.getElementById('queja');
    const charCount = document.getElementById('charCount');

    queja.addEventListener('input', () => {
      const len = queja.value.length;
      charCount.textContent = `${len} / 120`;
      charCount.className = 'char-count' +
        (len >= 100 ? (len >= 115 ? ' limit' : ' warning') : '');
    });

    /* ── SLIDER ── */
    const slider     = document.getElementById('dolor');
    const sliderLabel= document.getElementById('sliderLabel');
    const emojiLeft  = document.getElementById('emojiLeft');
    const emojiRight = document.getElementById('emojiRight');

    const LABELS = [
      { max: 30,  text: 'meh' },
      { max: 70,  text: 'dolor' },
      { max: 100, text: 'nivel cebolla 🧅' },
    ];

    function updateSlider () {
      const val = parseInt(slider.value, 10);
      const pct = val / 100;

      const label = LABELS.find(l => val <= l.max);
      sliderLabel.textContent = label ? label.text : 'nivel cebolla 🧅';

      // fill track
      slider.style.background =
        `linear-gradient(to right, rgba(91, 141, 239, 0.75) ${val}%, rgba(148, 163, 184, 0.12) ${val}%)`;

      // scale emojis subtly
      emojiLeft.style.transform  = `scale(${1 + (1-pct) * 0.2})`;
      emojiRight.style.transform = `scale(${1 + pct * 0.2})`;
    }

    slider.addEventListener('input', updateSlider);
    updateSlider();

    /* ── BUTTON ── */
    const btn      = document.getElementById('btnLlorar');
    const reaction = document.getElementById('reaction');

    const REACTIONS = [
      'Ahí, bien. Soltalo todo. 💧',
      'El universo recibió tu queja. No le importó, pero la recibió.',
      'Estadísticamente, alguien en el mundo también está llorando. Solidaridad.',
      'La cebollas también lloran. Son valientes.',
      'Tu queja fue archivada en la carpeta "pendiente de resolver desde 1998".',
      'El dolor compartido es dolor a medias. El tuyo sigue siendo tuyo, igual.',
      'Llorar hidrata. Eso dicen.',
      'Procesando emociones… error 404: solución no encontrada. 💙',
      'Muy bien. ¿Querés llorar de nuevo o lo dejamos acá?',
      'Tu queja fue recibida con el respeto y la indiferencia que merece el universo.',
    ];

    btn.addEventListener('click', () => {
      btn.classList.remove('crying');
      void btn.offsetWidth;
      btn.classList.add('crying');

      spawnTears();

      const texto      = queja.value.trim();
      const intensidad = parseInt(slider.value, 10);
      guardarLloro(texto, intensidad);
      renderLloros();

      queja.value = '';
      charCount.textContent = '0 / 120';
      charCount.className = 'char-count';

      const msg = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
      reaction.textContent = msg;
      reaction.classList.add('visible');

      // ── nuevas funciones ──
      mostrarPsicologo();
      celebrar();
      animarBoton();

      btn.addEventListener('animationend', () => btn.classList.remove('crying'), { once: true });
    });

    /* ── LLOROS STORE ── */
    const lloros = [];

    function crearId () {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    function guardarLloro (texto, intensidad) {
      lloros.push({ id: crearId(), texto, intensidad });
    }

    function elegirEmoji (intensidad) {
      if (intensidad <= 30) return '💧';
      if (intensidad <= 70) return '😢';
      return '🧅';
    }

    function renderLloros () {
      const row   = document.getElementById('llorosRow');
      const empty = document.getElementById('llorosEmpty');
      const lloro = lloros[lloros.length - 1];

      if (lloros.length === 0) return;
      if (empty) empty.remove();

      // ── tamaño según intensidad ──
      const size = 36 + Math.round(lloro.intensidad * 0.28);

      // ── float wrapper ──
      const floatEl = document.createElement('div');
      floatEl.className = 'lagrima-float';

      // parámetros únicos de flotación
      const fx  = (3 + Math.random() * 5).toFixed(1) + 'px';
      const fy  = (2 + Math.random() * 4).toFixed(1) + 'px';
      const dur = (3.5 + Math.random() * 3).toFixed(2) + 's';
      const del = -(Math.random() * 3).toFixed(2) + 's';

      floatEl.style.cssText = `
        --fx: ${fx}; --fy: ${fy};
        animation: float ${dur} ease-in-out ${del} infinite;
      `;

      // ── lagrima ──
      const el = document.createElement('div');
      el.className = 'lagrima';
      el.dataset.id = lloro.id;
      el.style.width  = `${size}px`;
      el.style.height = `${size * 1.15}px`;
      el.style.marginLeft = `${Math.floor(Math.random() * 55)}px`;

      const inner = document.createElement('span');
      inner.className = 'lagrima-inner';
      inner.textContent = elegirEmoji(lloro.intensidad);

      const tip = document.createElement('div');
      tip.className = 'tooltip';
      tip.textContent = lloro.texto || '(sin palabras, solo llanto)';

      el.appendChild(inner);
      el.appendChild(tip);
      floatEl.appendChild(el);
      row.appendChild(floatEl);

      // interacciones
      agregarPop(el);
      agregarDrag(el, floatEl);

      const area = document.getElementById('llorosArea');
      area.scrollTop = area.scrollHeight;
    }

    /* ── POP AL CLICK ── */
    function agregarPop (el) {
      el.addEventListener('click', (e) => {
        if (el._dragged) return; // no pop si fue arrastre
        el.classList.remove('popping');
        void el.offsetWidth;
        el.classList.add('popping');
        el.addEventListener('animationend', () => {
          el.classList.remove('popping');
        }, { once: true });
      });
    }

    /* ── DRAG CON RETORNO ELÁSTICO ── */
    function agregarDrag (el, floatEl) {
      let startX = 0, startY = 0, curX = 0, curY = 0, dragging = false;

      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        dragging = true;
        el._dragged = false;
        startX = e.clientX - curX;
        startY = e.clientY - curY;
        el.style.transition = 'box-shadow 0.2s';
        floatEl.style.animationPlayState = 'paused';
      });

      document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        curX = e.clientX - startX;
        curY = e.clientY - startY;
        if (Math.abs(curX) > 4 || Math.abs(curY) > 4) el._dragged = true;
        el.style.transform = `translate(${curX}px, ${curY}px)`;
      });

      document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        // retorno elástico
        el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s';
        el.style.transform = 'translate(0px, 0px)';
        curX = 0; curY = 0;
        floatEl.style.animationPlayState = 'running';
        setTimeout(() => { el._dragged = false; }, 80);
      });

      // touch
      el.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        dragging = true; el._dragged = false;
        startX = t.clientX - curX; startY = t.clientY - curY;
        floatEl.style.animationPlayState = 'paused';
      }, { passive: true });

      el.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        const t = e.touches[0];
        curX = t.clientX - startX; curY = t.clientY - startY;
        if (Math.abs(curX) > 4 || Math.abs(curY) > 4) el._dragged = true;
        el.style.transform = `translate(${curX}px, ${curY}px)`;
      }, { passive: true });

      el.addEventListener('touchend', () => {
        dragging = false;
        el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate(0px, 0px)';
        curX = 0; curY = 0;
        floatEl.style.animationPlayState = 'running';
      });
    }

    /* ── ONDA AL CLICK EN EL ÁREA ── */
    (function () {
      const area = document.getElementById('llorosArea');
      area.addEventListener('click', (e) => {
        const rect  = area.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top + area.scrollTop;
        const size  = 120;
        const wave  = document.createElement('div');
        wave.className = 'wave-ripple';
        wave.style.cssText = `
          width: ${size}px; height: ${size}px;
          left: ${x - size / 2}px;
          top: ${y - size / 2}px;
        `;
        area.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
      });
    })();

    /* ── PSICÓLOGO ── */
    const PSICOLOGO_RESPONSES = [
      'Entiendo perfectamente... aunque no sé qué entendí exactamente 😭',
      'Tu tristeza fue recibida oficialmente por la Llorería 💧',
      'He analizado tu problema durante 3 segundos y mi conclusión es: necesitás una galletita.',
      'Recuerda: hasta las nubes lloran y siguen siendo bonitas ☁️',
      'Diagnóstico: mucho lloro. Tratamiento: probablemente un abrazo.',
      'Esto es muy serio. Voy a anotarlo en mi cuaderno imaginario 📓',
      'Respirá hondo. ¿Ya? Bien. Ahora llorá un poco más, que te hace bien.',
      '¡Qué valiente sos por llorar! Los héroes también lloran. Y los antihéroes. Y las cebollas.',
      'Según mis estudios de 0 años en psicología, esto tiene solución. No sé cuál. Pero tiene.',
      'He visto casos peores. Bueno, no los he visto. Pero me los imagino.',
      'Tu lloro fue registrado en el Gran Libro de los Lloros de la Humanidad 📖',
      'Como diría alguien muy sabio: "a veces las cosas son así". Muy sabio, sí.',
      'Propongo que te tomes el día. No? ¿Tampoco? Ok. Propongo un vaso de agua entonces.',
      'El universo escuchó tu queja y dijo "mmm, interesante" y siguió girando igual.',
      'Diagnóstico oficial: sos una persona con sentimientos. ¡Qué noticia tan humana!',
      '¿Sabías que llorar libera toxinas? Bueno, creo que leí eso en algún lado. O lo soñé.',
      'Esto también pasará. No sé cuándo. Pero pasará. O no. Igual, ánimo 💙',
      'Mi recomendación profesional: tres respiras, un té, y ver un video de ositos.',
      'Anotado, procesado, archivado y ligeramente olvidado. Con mucho amor 💧',
      'Eso que sentís se llama... un sentimiento. Y los sentimientos son... sentimentales.',
      'No estás solo/a. Yo estoy acá. Soy una gotita de agua, pero estoy acá.',
      'En base a tu intensidad, recomiendo entre 1 y 47 galletitas. A tu criterio.',
      'Tu queja entró al Departamento de Quejas. Estamos en fila. Somos todos 💧',
      '¡Excelente decisión llorar hoy! Mañana también podés. Es gratis.',
      'Lo que describís suena muy difícil. O fácil. No soy el mejor juez de estas cosas.',
      'Un abrazo virtual de mi parte. Lamentablemente soy líquido y no tengo brazos.',
      'Esto lo resolverías con una buena siesta. ¿Ya probaste con una buena siesta?',
    ];

    let psicologoTimer = null;

    function mostrarPsicologo () {
      const bubble = document.getElementById('psicologoBubble');
      const text   = document.getElementById('psicologoText');
      const char   = document.getElementById('psicologoChar');

      const resp = PSICOLOGO_RESPONSES[Math.floor(Math.random() * PSICOLOGO_RESPONSES.length)];

      // pequeño rebote del personaje
      char.style.animation = 'none';
      void char.offsetWidth;
      char.style.animation = 'psi-bob 2.6s ease-in-out infinite';

      bubble.classList.remove('visible');
      clearTimeout(psicologoTimer);

      setTimeout(() => {
        text.textContent = resp;
        bubble.classList.add('visible');
        psicologoTimer = setTimeout(() => bubble.classList.remove('visible'), 7000);
      }, 180);
    }

    /* ── CELEBRACIÓN ── */
    const CEL_EMOJIS = ['💧', '😢', '✨', '🫧', '💦', '🌧️'];

    function celebrar () {
      const card = document.querySelector('.card');
      card.classList.remove('celebrating');
      void card.offsetWidth;
      card.classList.add('celebrating');
      card.addEventListener('animationend', () => card.classList.remove('celebrating'), { once: true });

      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const n    = 10 + Math.floor(parseInt(slider.value, 10) / 12);

      for (let i = 0; i < n; i++) {
        const p   = document.createElement('div');
        p.className = 'cel-particle';
        p.textContent = CEL_EMOJIS[Math.floor(Math.random() * CEL_EMOJIS.length)];

        const angle = Math.random() * Math.PI * 2;
        const dist  = 60 + Math.random() * 110;
        const tx    = Math.round(Math.cos(angle) * dist);
        const ty    = Math.round(Math.sin(angle) * dist - 40);
        const dur   = (0.7 + Math.random() * 0.6).toFixed(2) + 's';
        const rot   = (Math.random() * 360 - 180).toFixed(0) + 'deg';
        const delay = (Math.random() * 0.18).toFixed(2) + 's';

        p.style.cssText = `
          left: ${cx}px; top: ${cy}px;
          font-size: ${0.8 + Math.random() * 0.6}rem;
          --tx: ${tx}px; --ty: ${ty}px;
          --dur: ${dur}; --rot: ${rot};
          animation-delay: ${delay};
        `;
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
      }
    }

    /* ── TEXTO DINÁMICO DEL BOTÓN ── */
    const BTN_LABELS = [
      'Llorado con éxito 💧',
      'Descarga emocional completada 😭',
      'Lloro enviado al océano',
      'Emoción procesada ✔️',
      '¡Llorado! ¿Más? 💦',
      'Queja archivada en el cosmos',
    ];

    function animarBoton () {
      const label = BTN_LABELS[Math.floor(Math.random() * BTN_LABELS.length)];
      btn.textContent = label;
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Llorar';
        btn.disabled = false;
      }, 2200);
    }

    /* ── SPAWN TEARS ── */
    function spawnTears () {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top;
      const n    = 5 + Math.floor(parseInt(slider.value, 10) / 20);

      for (let i = 0; i < n; i++) {
        const tear = document.createElement('div');
        tear.className = 'tear';
        tear.textContent = '💧';
        const x = cx + (Math.random() - 0.5) * rect.width * 1.2;
        tear.style.left = `${x}px`;
        tear.style.top  = `${cy}px`;
        tear.style.animationDelay = `${Math.random() * 0.25}s`;
        document.body.appendChild(tear);
        tear.addEventListener('animationend', () => tear.remove());
      }
    }
