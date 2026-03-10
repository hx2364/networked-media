

(function () {
  const booklet = document.getElementById('booklet');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalForm = document.getElementById('modalForm');
  const btnCancel = document.getElementById('btnCancel');
  const hiddenX = document.getElementById('hiddenX');
  const hiddenY = document.getElementById('hiddenY');

  if (!booklet || !modalOverlay || !modalForm) return;

  // ========== Booklet ==========
  booklet.addEventListener('click', function (e) {
    if (e.target.closest('[data-sticky]') || e.target.closest('.resize-handle')) {
      return;
    }

    const rect = booklet.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    hiddenX.value = x;
    hiddenY.value = y;
    modalOverlay.classList.add('visible');
  });


  btnCancel.addEventListener('click', function () {
    modalOverlay.classList.remove('visible');
  });

  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) modalOverlay.classList.remove('visible');
  });

  modalForm.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // ========== drag sticky notes ==========
  const notes = document.querySelectorAll('[data-sticky]');

  function saveNotePosition(note) {
    const id = note.dataset.postId;
    const x = parseInt(note.style.left, 10);
    const y = parseInt(note.style.top, 10);
    const w = parseInt(note.style.width, 10);
    const h = parseInt(note.style.minHeight, 10);

    fetch(`/post/${id}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, width: w, height: h })
    });
  }

  notes.forEach(function (note) {
    const dragHandle = note.querySelector('.drag-handle');
    const resizeHandle = note.querySelector('.resize-handle');

    // ----- drag -----
    if (dragHandle) {
      let dragStartX, dragStartY, noteStartX, noteStartY;

      dragHandle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        note.classList.add('dragging');
        const bookRect = booklet.getBoundingClientRect();
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        noteStartX = parseInt(note.style.left, 10) || 0;
        noteStartY = parseInt(note.style.top, 10) || 0;

        function onMouseMove(e) {
          const dx = e.clientX - dragStartX;
          const dy = e.clientY - dragStartY;
          const newX = Math.max(0, noteStartX + dx);
          const newY = Math.max(0, noteStartY + dy);
          note.style.left = newX + 'px';
          note.style.top = newY + 'px';
        }

        function onMouseUp() {
          note.classList.remove('dragging');
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          saveNotePosition(note);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }

    // ----- resize -----
    if (resizeHandle) {
      let resizeStartX, resizeStartY, startWidth, startHeight;

      resizeHandle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        note.classList.add('resizing');
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        startWidth = parseInt(note.style.width, 10) || 180;
        startHeight = parseInt(note.style.minHeight, 10) || 180;

        function onMouseMove(e) {
          const dx = e.clientX - resizeStartX;
          const dy = e.clientY - resizeStartY;
          const newWidth = Math.max(120, Math.min(400, startWidth + dx));
          const newHeight = Math.max(120, Math.min(500, startHeight + dy));
          note.style.width = newWidth + 'px';
          note.style.minHeight = newHeight + 'px';
        }

        function onMouseUp() {
          note.classList.remove('resizing');
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          saveNotePosition(note);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  });
})();
