const draftKey = 'inspeccion-general-v1:' + location.pathname.replace(/index\.html$/, '');
const controls = Array.from(document.querySelectorAll('input,select,textarea'));
const saved = document.getElementById('saved');
function fieldKey(control) {
  const section = control.closest('fieldset')?.querySelector('legend').textContent || 'Cabecera';
  return section + '/' + control.parentElement.firstChild.textContent;
}
try {
  const draft = JSON.parse(localStorage.getItem(draftKey) || '{}');
  for (const control of controls) {
    const value = draft[fieldKey(control)];
    if (typeof value === 'string') control.value = value;
  }
  if (Object.keys(draft).length) saved.textContent = 'Borrador recuperado';
  document.querySelector('fieldset').querySelectorAll('select')[1].dispatchEvent(new Event('change'));
} catch { saved.textContent = 'No se pudo recuperar el borrador'; }
function saveDraft() {
  try {
    const draft = Object.fromEntries(controls.map(control => [fieldKey(control), control.value]));
    localStorage.setItem(draftKey, JSON.stringify(draft));
    saved.textContent = 'Guardado en este dispositivo';
  } catch { saved.textContent = 'Error al guardar en este dispositivo'; }
}
document.addEventListener('input', saveDraft);
document.addEventListener('change', saveDraft);
const statusLine = document.getElementById('offline');
async function prepareOffline() {
  try {
    await navigator.serviceWorker.register('./sw.js');
    await navigator.serviceWorker.ready;
    statusLine.textContent = 'Lista para usar sin conexión';
  } catch { statusLine.textContent = 'Uso sin conexión pendiente'; }
}
prepareOffline();
