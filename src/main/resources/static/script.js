document.addEventListener('DOMContentLoaded', function() {
    const colorCodeEl = document.getElementById('color-code');
    const saludoEl = document.getElementById('saludo');
    const copyBtn = document.getElementById('copy-button');
    const nombreInput = document.getElementById('nombre-input');
    const saludarBtn = document.getElementById('saludar-button');
    const historialList = document.getElementById('historial-list');
    const refreshHistorialBtn = document.getElementById('refresh-historial');

    function actualizarColor(color) {
        document.body.style.backgroundColor = color;
        colorCodeEl.textContent = color;
    }

    function formatFecha(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d)) return iso;
        return d.toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    function renderHistorial(saludos) {
        historialList.innerHTML = '';

        if (!saludos || saludos.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Aún no hay saludos';
            li.style.color = 'rgba(255,255,255,0.7)';
            li.style.justifyContent = 'center';
            historialList.appendChild(li);
            return;
        }

        saludos.forEach(s => {
            const li = document.createElement('li');

            const swatch = document.createElement('div');
            swatch.className = 'historial-swatch';
            swatch.style.backgroundColor = s.color || '#888888';

            const info = document.createElement('div');
            info.className = 'historial-info';

            const nombre = document.createElement('div');
            nombre.className = 'historial-nombre';
            nombre.textContent = s.nombre || '—';

            const fecha = document.createElement('div');
            fecha.className = 'historial-fecha';
            fecha.textContent = formatFecha(s.fecha);

            info.appendChild(nombre);
            info.appendChild(fecha);

            const hex = document.createElement('span');
            hex.className = 'historial-hex';
            hex.textContent = s.color || '';

            li.appendChild(swatch);
            li.appendChild(info);
            li.appendChild(hex);
            historialList.appendChild(li);
        });
    }

    async function cargarHistorial() {
        try {
            const response = await fetch('/historial');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            const saludos = Array.isArray(data) ? data : [];
            saludos.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
            renderHistorial(saludos);
        } catch (e) {
            historialList.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = 'No se pudo cargar el historial';
            li.style.color = 'rgba(255,255,255,0.7)';
            li.style.justifyContent = 'center';
            historialList.appendChild(li);
        }
    }

    // Copiar con fallback
    async function copiarTexto(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (err) {
            const temp = document.createElement('input');
            temp.value = texto;
            document.body.appendChild(temp);
            temp.select();
            temp.setSelectionRange(0, 99999);
            try {
                const success = document.execCommand('copy');
                document.body.removeChild(temp);
                return success;
            } catch (e) {
                document.body.removeChild(temp);
                return false;
            }
        }
    }

    copyBtn.addEventListener('click', async function() {
        const color = colorCodeEl.textContent;
        const ok = await copiarTexto(color);
        if (ok) {
            copyBtn.textContent = '¡Copiado!';
            setTimeout(() => { copyBtn.textContent = 'Copiar Hex'; }, 2000);
        } else {
            alert('No se pudo copiar el código');
        }
    });

    saludarBtn.addEventListener('click', async function() {
        const nombre = nombreInput.value.trim();
        if (nombre === '') {
            alert('Por favor, escribe un nombre');
            return;
        }

        try {
            //const formData = new FormData();
            //formData.append('nombre', nombre);

            const response = await fetch('/saludar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nombre })
                //body: formData
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al saludar');
            }

            const data = await response.json();
            saludoEl.textContent = data.saludo;
            actualizarColor(data.color);
            nombreInput.value = '';
            cargarHistorial();
        } catch (error) {
            alert('Hubo un error: ' + error.message);
        }
    });

    nombreInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saludarBtn.click();
        }
    });

    refreshHistorialBtn.addEventListener('click', cargarHistorial);
    cargarHistorial();

    actualizarColor(colorCodeEl.textContent.trim());
});