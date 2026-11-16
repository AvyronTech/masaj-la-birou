const offerForm = document.getElementById('contact-form');
const bookingForm = document.getElementById('booking-form');

const readField = (data, name) => String(data.get(name) || '').trim();
const whatsappUrl = (form, message) =>
  `https://wa.me/${form.dataset.whatsappNumber}?text=${encodeURIComponent(message)}`;

function offerMessage(form) {
  const data = new FormData(form);
  const lines = [
    'Bună ziua, Benvora Grup! Solicit o ofertă pentru masaj la birou.',
    `Companie: ${readField(data, 'company')}`,
    `Persoană de contact: ${readField(data, 'person')}`,
    `Telefon: ${readField(data, 'phone')}`,
    `E-mail: ${readField(data, 'email')}`,
    `Participanți estimați: ${readField(data, 'participants') || 'de stabilit'}`,
    `Program dorit: ${readField(data, 'schedule') || 'de stabilit împreună'}`,
  ];
  if (readField(data, 'message')) lines.push(`Alte detalii: ${readField(data, 'message')}`);
  return lines.join('\n');
}

function bindRequestActions(form, createMessage, validate = () => true) {
  if (!form) return;
  const phone = form.querySelector('[name="phone"]');
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  const prepare = () => {
    if (!validate()) return false;
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 7 && digits.length <= 15 ? '' : 'Introdu un număr de telefon valid.');
    return form.reportValidity();
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (prepare()) window.location.href = whatsappUrl(form, createMessage(form));
  });
}

bindRequestActions(offerForm, offerMessage);

if (bookingForm) {
  const monthLabel = document.getElementById('booking-month');
  const previous = document.getElementById('booking-prev');
  const next = document.getElementById('booking-next');
  const days = document.getElementById('booking-days');
  const selection = document.getElementById('booking-selected');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() + 5, 1);
  let visibleMonth = new Date(firstMonth);
  let selectedDate = null;

  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const monthKey = date => date.getFullYear() * 12 + date.getMonth();
  const longDate = new Intl.DateTimeFormat('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const monthName = new Intl.DateTimeFormat('ro-RO', { month: 'long', year: 'numeric' });

  function renderCalendar(focusKey) {
    const label = monthName.format(visibleMonth);
    monthLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    previous.disabled = monthKey(visibleMonth) <= monthKey(firstMonth);
    next.disabled = monthKey(visibleMonth) >= monthKey(lastMonth);
    const fragment = document.createDocumentFragment();
    const firstWeekday = (visibleMonth.getDay() + 6) % 7;
    for (let index = 0; index < firstWeekday; index += 1) {
      const empty = document.createElement('span');
      empty.className = 'booking-day-empty';
      empty.setAttribute('aria-hidden', 'true');
      fragment.append(empty);
    }
    const count = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    let firstEnabled = null;
    for (let number = 1; number <= count; number += 1) {
      const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), number);
      const key = dateKey(date);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'booking-day';
      button.dataset.date = key;
      button.textContent = String(number);
      button.setAttribute('aria-label', longDate.format(date));
      button.setAttribute('aria-pressed', String(key === selectedDate));
      button.tabIndex = -1;
      button.disabled = date < today;
      if (key === dateKey(today)) button.classList.add('is-today');
      if (key === selectedDate) button.classList.add('is-selected');
      if (!button.disabled && !firstEnabled) firstEnabled = key;
      fragment.append(button);
    }
    days.replaceChildren(fragment);
    const rovingKey = focusKey || (selectedDate?.startsWith(dateKey(visibleMonth).slice(0, 7)) ? selectedDate : firstEnabled);
    const active = [...days.querySelectorAll('.booking-day')].find(button => button.dataset.date === rovingKey);
    if (active && !active.disabled) active.tabIndex = 0;
    if (focusKey) active?.focus();
  }

  function chooseDate(key) {
    selectedDate = key;
    const [year, month, day] = key.split('-').map(Number);
    selection.textContent = `Data preferată: ${longDate.format(new Date(year, month - 1, day))}.`;
    selection.classList.remove('has-error');
    selection.classList.add('has-selection');
    renderCalendar(key);
  }

  previous.addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  next.addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  days.addEventListener('click', event => {
    const button = event.target.closest('button[data-date]');
    if (button && !button.disabled) chooseDate(button.dataset.date);
  });
  days.addEventListener('keydown', event => {
    const button = event.target.closest('button[data-date]');
    if (!button) return;
    const [year, month, day] = button.dataset.date.split('-').map(Number);
    const current = new Date(year, month - 1, day);
    const jumps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let target;
    if (Object.prototype.hasOwnProperty.call(jumps, event.key)) target = new Date(year, month - 1, day + jumps[event.key]);
    else if (event.key === 'Home') target = new Date(year, month - 1, day - (current.getDay() + 6) % 7);
    else if (event.key === 'End') target = new Date(year, month - 1, day + 6 - (current.getDay() + 6) % 7);
    else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const offset = event.key === 'PageUp' ? -1 : 1;
      const lastDay = new Date(year, month + offset, 0).getDate();
      target = new Date(year, month - 1 + offset, Math.min(day, lastDay));
    } else return;
    event.preventDefault();
    if (target < today || monthKey(target) > monthKey(lastMonth)) return;
    visibleMonth = new Date(target.getFullYear(), target.getMonth(), 1);
    renderCalendar(dateKey(target));
  });

  function bookingMessage(form) {
    const data = new FormData(form);
    const [year, month, day] = selectedDate.split('-').map(Number);
    const lines = [
      'Bună ziua, Benvora Grup! Doresc să propun o programare pentru masaj la birou.',
      `Data preferată: ${longDate.format(new Date(year, month - 1, day))}`,
      `Interval preferat: ${readField(data, 'slot')}`,
      `Companie: ${readField(data, 'company')}`,
      `Persoană de contact: ${readField(data, 'person')}`,
      `Telefon: ${readField(data, 'phone')}`,
      `E-mail: ${readField(data, 'email')}`,
      `Participanți estimați: ${readField(data, 'participants') || 'de stabilit'}`,
      `Locația sediului: ${readField(data, 'location') || 'de stabilit'}`,
    ];
    if (readField(data, 'message')) lines.push(`Alte detalii: ${readField(data, 'message')}`);
    lines.push('Vă rog să confirmați disponibilitatea înainte de stabilirea programării.');
    return lines.join('\n');
  }

  function validateDate() {
    if (selectedDate) return true;
    selection.textContent = 'Alege mai întâi o zi din calendar.';
    selection.classList.add('has-error');
    days.querySelector('.booking-day:not(:disabled)')?.focus();
    return false;
  }

  renderCalendar();
  bindRequestActions(bookingForm, bookingMessage, validateDate);
}
